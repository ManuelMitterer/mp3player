/**
 * @namespace mp3Player
 */
var mp3Player = window.mp3Player || {};

var AudioContext = AudioContext || webkitAudioContext;

(function (window, namespace) {
	"use strict";
	/**
	 * @constructor
	 * Mp3Model
	 * @memberOf mp3Player
	 * @property {object} audio - Audio Element
	 * @property {object} context - Audio Context
	 * @property {object} analyser - Analyser Node
	 * @property {array} trackList - holds the tracks
	 * @property {array} shuffledTrackList - holds the shuffled tracks
	 * @property {float} volume - Volume 0..1
	 * @property {object} currentTrack - holds information to the current Track
	 * @property {boolean} playing - is the song playing?
	 * @property {float} buffered - length of the buffer
	 * @property {float} duration - length of the song
	 * @property {float} currentTime - current time in the song
	 * @property {boolean} muted
	 * @property {boolean} shuffle
	 * @property {boolean} repeat - repeat one song
	 */
	var Mp3Model = function Mp3Model(){
		this.audio = new Audio();
		this.context = new AudioContext();
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 512;
		this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(this.frequencyData);

		this.audioSource = this.context.createMediaElementSource(this.audio);
		this.audioSource.connect(this.analyser);
		this.analyser.connect(this.context.destination);

		this.trackList = [];
		this.shuffledTrackList = [];
		this.volume = 1;
		this.currentTrack;
		this.playing = false; // true = playing, false = paused
		this.buffered = null;
		this.duration = null;
		this.currentTime = null;
		this.muted = false;
		this.shuffle = false;
		this.repeat = false;

		this.audio.autoplay = false;
		this.audio.controls = false;
		this.audio.preload = 'auto'; //auto, metadata
		var that = this;
		this.audio.addEventListener('timeupdate', function(event) {
			that.currentTime = that.audio.currentTime;
			$(that).trigger('playedProgress');
		});
		this.audio.addEventListener('ended', function(event) {
			$(that).trigger('pause');
			that.nextTrack();
		});
		this.audio.addEventListener('play', function(event) {
			$(that).trigger('play');
		});
		this.audio.addEventListener('pause', function(event) {
			$(that).trigger('pause');
		});
		this.audio.addEventListener('progress', function(event) {
			that.buffered = that.audio.buffered;
			$(that).trigger('bufferedProgress');
		});
		this.audio.addEventListener('durationchange', function(event) {
			that.duration = that.audio.duration;
			$(that).trigger('durationChange');
		});
	};
	/**
	 * @method startPlayer
	 * @memberof mp3Player.Mp3Model
	 * @param  {integer} sourceId id of the song to start
	 */
	Mp3Model.prototype.startPlayer = function(sourceId) {
		this.audio.pause();
		this.setTrack(sourceId);
		this.audio.play();
		this.playing = true;

		console.log("Track loaded...");
	};
	/**
	 * @method mute
	 * @memberof mp3Player.Mp3Model
	 * @fires volumeChange
	 */
	Mp3Model.prototype.mute = function() {
		this.audio.muted = true;
		this.muted = true;

		$(this).trigger('volumeChange');
		console.log("Muted...");
	};
	/**
	 * @method changeRepeat
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.changeRepeat = function() {
		this.repeat = !this.repeat;
	};
	/**
	 * @method changeShuffle
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.changeShuffle = function() {
		if(!this.shuffle){
			this.shuffledTrackList = _.shuffle(this.trackList);
			console.log("shuffling enabled!");
			console.log(this.shuffledTrackList);
		}
		this.shuffle = !this.shuffle;
	};
	/**
	 * @method unMute
	 * @memberof mp3Player.Mp3Model
	 * @fires volumeChange
	 */
	Mp3Model.prototype.unMute = function() {
		this.audio.muted = false;
		this.muted = false;

		$(this).trigger('volumeChange');
		console.log("UnMuted...");
	};
	/**
	 * @method setTrack
	 * @memberof mp3Player.Mp3Model
	 * @param  {integer} sourceId id of the song to be set
	 * @fires newTrack
	 */
	Mp3Model.prototype.setTrack = function(sourceId) {
		var newSource = null;
		var that = this;

		this.trackList.forEach(function(track) {
			if (track.id == sourceId) {
				that.currentTrack = track;
			}
		});

		if (this.audio.src !== "") this.audio.currentTime = 0.0;

		this.audio.src = this.currentTrack.url;

		if (this.playing) this.audio.play();
		$(this).trigger('newTrack');
	};
	/**
	 * @method nextTrack
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.nextTrack = function() {
		var nextID = null;
		if(this.repeat){
			this.setTrack(this.currentTrack.id);
		} else {
			if(this.shuffle){
				for (var i = 0; i < this.trackList.length; i++) {
					if (this.currentTrack.id == this.shuffledTrackList[i].id) nextID = i;
				};
			}
			else {
				for (var i = 0; i < this.trackList.length; i++) {
					if (this.currentTrack.id == this.trackList[i].id) nextID = i;
				};
			}

			if (nextID + 1 >= this.trackList.length) {
				nextID = (nextID + 1) % this.trackList.length;
				if(this.shuffle){
					this.shuffledTrackList = _.shuffle(this.trackList);
					this.setTrack(this.shuffledTrackList[nextID].id);
				}
				else {
					this.stop();
					this.setTrack(this.trackList[0].id);
					$(this).trigger('pause');
				}
			} else {
				nextID = nextID + 1;
				if(this.shuffle) this.setTrack(this.shuffledTrackList[nextID].id);
				else this.setTrack(this.trackList[nextID].id);
			}
		}
	};
	/**
	 * @method prevTrack
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.prevTrack = function() {
		var nextID = null;
		if(this.repeat){
			this.setTrack(this.currentTrack.id);
		} else {
			if(this.shuffle){
				for (var i = 0; i < this.trackList.length; i++) {
					if (this.currentTrack.id == this.shuffledTrackList[i].id) {
						nextID = i;
						break;
					}
				};
			}
			else {
				for (var i = 0; i < this.trackList.length; i++) {
					if (this.currentTrack.id == this.trackList[i].id) {
						nextID = i;
						break;
					}
				};
			}
			if ((nextID - 1) >= 0) {
				nextID = nextID - 1;
				if(this.shuffle) this.setTrack(this.shuffledTrackList[nextID].id);
				else this.setTrack(this.trackList[nextID].id);
			}
		}
	};
	/**
	 * @method play
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.play = function() {
		this.playing = true;
		this.audio.play();
	};
	/**
	 * @method pause
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.pause = function() {
		this.playing = false;
		this.audio.pause();
	};
	/**
	 * @method updateTime
	 * @memberof mp3Player.Mp3Model
	 * @param  {float} time - new time
	 */
	Mp3Model.prototype.updateTime = function(time) {
		this.audio.currentTime = time;
	};
	/**
	 * @method setTrackList
	 * @memberof mp3Player.Mp3Model
	 * @param  {array} tracklist deep copy of the tracklist
	 */
	Mp3Model.prototype.setTrackList = function(tracklist) {
		this.trackList = tracklist;
	};
	/**
	 * @method setVolume
	 * @memberof mp3Player.Mp3Model
	 * @param  {float} volume new volume
	 * @fires volumeChange
	 */
	Mp3Model.prototype.setVolume = function(volume) {
		this.audio.volume = volume;
		this.volume = volume;
		$(this).trigger('volumeChange');
	};
	/**
	 * @method stop
	 * @memberof mp3Player.Mp3Model
	 */
	Mp3Model.prototype.stop = function() {
		if (this.audio.src !== "") {
			this.audio.pause();
			this.audio.currentTime = 0.0;
			this.playing = false;
		}
	};
	/**
	 * @method loadTrackList
	 * @memberof mp3Player.Mp3Model
	 * @fires tracklistLoaded
	 */
	Mp3Model.prototype.loadTrackList = function() {
		var trackList = [];
		var that = this;

		$.getJSON("assets/tracklist.json", function(data) {
			var i = 0;
			data.tracks.forEach(function(track) {
				trackList[i] = track;
				trackList[i].id = i;
				i++;
			});
			console.log("Tracklist loaded...");
			that.trackList = trackList;
			that.currentTrack = that.trackList[0];
			that.audio.src = that.currentTrack.url;
			$(that).trigger('tracklistLoaded');
		})
			.fail(function() {
			console.log("error loading JSON Tracklist!");
		});
	};

	namespace.Mp3Model = Mp3Model;

})(window, mp3Player);