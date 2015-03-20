/**
 * @method remove
 * @memberof Array
 * @param  {integer} index index that is to be deleted from the array
 */
Array.prototype.remove = function(index) {
	this.splice(index, 1);
};
/**
 * @method insert
 * @memberof Array
 * @param  {integer} index index at which item will be inserted
 * @param  {object} item item that is to be inserted
 */
Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};
var mp3Player = window.mp3Player || {};

(function (window, namespace) {
	"use strict";
	/**
	 * @constructor
	 * Mp3Controller
	 * @memberOf mp3Player
	 * @property {object} model - the Mp3Model where this controller belongs to
	 */
	var Mp3Controller = function Mp3Controller(model){
		this.model = model;
		var that = this;

		$('#btnPlayPause').on('click', function(e){
			if (!that.model.playing && that.model.currentTrack !== undefined) {
				that.model.play();
				that.updatePlayButton();
			} else {
				that.model.pause();
				that.updatePauseButton();
			}
		});

		$('#btnPrev').on('click', function(e){
			that.model.prevTrack();
		});
		$('#btnNext').on('click', function(e){
			that.model.nextTrack();
		});
		$('#btnStop').on('click', function(e){
			that.model.stop();
		});
		$('#durationText').on('click', function(e){
			$(that.model).trigger('changeDurationText');
		});
		$('#btnVolume').on('click', function(e){
			$(that.model).trigger('muteChange');
		});
		$('#btnShuffle').on('click', function(e){
			that.model.changeShuffle();
		});
		$('#btnRepeat').on('click', function(e){
			that.model.changeRepeat();
		});

		$(document).on('dblclick', '.tracks', function(e){
			that.model.startPlayer.call(that.model, $(this).attr('id'));
		});

    $(this.model).on('play', this.updatePlayButton.bind(this));
    $(this.model).on('pause', this.updatePauseButton.bind(this));
	};
	/**
	 * @method updatePlayButton
	 * @memberof mp3Player.Mp3Controller
	 */
	Mp3Controller.prototype.updatePlayButton = function updatePlayButton(){
		$('#btnPlayPause').addClass('active');
		$('#btnPlayPause i').removeClass('icon-play');
		$('#btnPlayPause i').addClass('icon-pause');
	};
	/**
	 * @method updatePauseButton
	 * @memberof mp3Player.Mp3Controller
	 */
	Mp3Controller.prototype.updatePauseButton = function updatePauseButton(){
		$('#btnPlayPause').removeClass('active');
		$('#btnPlayPause i').removeClass('icon-pause');
		$('#btnPlayPause i').addClass('icon-play');
	};

	namespace.Mp3Controller = Mp3Controller;

})(window, mp3Player);