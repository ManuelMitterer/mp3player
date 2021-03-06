var mp3Player = window.mp3Player || {};

(function (window, namespace) {
  "use strict";
  /**
   * @constructor
   * Mp3ControlsView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   */
  var Mp3ControlsView = function Mp3ControlsView(model){
    this.model = model;
  }
  /**
   * @constructor
   * ProgressSliderView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   * @property {object} progressSlider
   * @property {object} progressText
   * @property {object} durationText
   * @property {boolean} timeLeft - true if Time left is shown, false if Duration of the song is shown
   * @property {object} slider
   */
  var ProgressSliderView = function ProgressSliderView(model){
    this.model = model;
    this.progressSlider = $('#progressSlider');
    this.timeLeft = true;
    var that = this;

    this.progressText = $('#progressText');
    this.durationText = $('#durationText');

    this.slider = new components.HSlider({
        view: this.progressSlider,
        min: parseFloat(this.progressSlider.attr('data-min')),
        max: parseFloat(this.progressSlider.attr('data-max')),
        value: parseFloat(this.progressSlider.attr('data-value'))
    });

    $(this.slider).on('change', this.updateTimeAudio.bind(this));

    $(this.model).on('tracklistLoaded newtrack', this.resetSliderTime.bind(this));
    $(this.model).on('durationChange', this.changeDuration.bind(this));
    $(this.model).on('bufferedProgress', this.updateProgress.bind(this));
    $(this.model).on('playedProgress', this.updateTimeSlider.bind(this));
    $(this.model).on('changeDurationText', this.changeText.bind(this));
  }
  /**
   * @method pad
   * @memberof mp3Player.ProgressSliderView
   * @param  {integer} n
   */
  ProgressSliderView.prototype.pad = function pad(n){
    return (n < 10) ? ("0" + n) : n;
  }
  /**
   * @method updateProgress
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.updateProgress = function() {
      if (this.model.buffered.length) {
          this.slider.setBuffer(this.model.buffered.end(this.model.buffered.length - 1) / this.model.duration);
      } else {
          //console.log('no progress');
      }
  }
  /**
   * @method changeDuration
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.changeDuration = function() {
      this.slider.setBuffer(0);
      this.slider.setMax(this.model.duration);

      this.setDuration();
  }
  /**
   * @method resetSliderTime
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.resetSliderTime = function() {
      this.slider.setExternalValue(0);
      this.progressText.html("00:00");
  }
  /**
   * @method updateTimeSlider
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.updateTimeSlider = function() {
      this.setcurrentTime();

      this.slider.setExternalValue(this.model.currentTime);

      if(this.timeLeft) this.setTimeLeft();
      else this.setDuration();
  }
  /**
   * @method updateTimeAudio
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.updateTimeAudio = function() {
      if (this.model.currentTrack !== undefined) this.model.updateTime(this.slider.getValue());
  }
  /**
   * @method changeText
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.changeText = function() {
      this.timeLeft = !this.timeLeft;
  }
  /**
   * @method setcurrentTime
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.setcurrentTime = function() {
      var min = this.pad(parseInt(this.model.currentTime / 60, 10));
      var sec = this.pad(parseInt(this.model.currentTime % 60, 10));
      this.progressText.html(min + ":" + sec);
  }
  /**
   * @method setDuration
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.setDuration = function() {
      var min = this.pad(parseInt((this.model.duration) / 60, 10));
      var sec = this.pad(parseInt((this.model.duration) % 60, 10));
      this.durationText.html(min + ":" + sec);
  }
  /**
   * @method setTimeLeft
   * @memberof mp3Player.ProgressSliderView
   */
  ProgressSliderView.prototype.setTimeLeft = function() {
      var min = this.pad(parseInt((this.model.duration - this.model.currentTime) / 60, 10));
      var sec = this.pad(parseInt((this.model.duration - this.model.currentTime) % 60, 10));
      this.durationText.html("-" + min + ":" + sec);
  }
  /**
   * @constructor
   * TrackInfoView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   */
  var TrackInfoView = function TrackInfoView(model, $element){
    this.model = model;

    $(this.model).on('tracklistLoaded newTrack', this.update.bind(this));
  }
  /**
   * @method setTimeLeft
   * @memberof mp3Player.TrackInfoView
   */
  TrackInfoView.prototype.update = function update(){
    console.log("changed Track...");
    var that = this;

    $('#trackInfo').animate({opacity: 0}, 200, function(){
      console.log(that.model.currentTrack.title);
      $(this).find('#track-title').html(that.model.currentTrack.title);
      $(this).find('#track-artist').html(that.model.currentTrack.artist);
      $(this).find('#track-genre').html(that.model.currentTrack.genre);
      $(this).find('#track-album').html(that.model.currentTrack.album);
    });
    $('#trackInfo').animate({opacity: 1}, 200);
  }
  /**
   * @constructor
   * TrackListView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   */
  var TrackListView = function TrackListView(model, $element){
    this.model = model;
    this.model.loadTrackList();

    $(this.model).on('tracklistLoaded', this.initializeTracklist.bind(this));
    $(this.model).on('newTrack', this.changeTrack.bind(this));
    $(this.model).on('tracklistLoaded newTrack', this.changeTrack.bind(this));
  }
  /**
   * @method changeTrack
   * @memberof mp3Player.TrackListView
   */
  TrackListView.prototype.changeTrack = function changeTrack(){
    $('#tracklist .tracks').each(function() {
      $(this).removeClass('activeTrack');
    });
    $('#' + this.model.currentTrack.id).addClass('activeTrack');
  }
  /**
   * @method initializeTracklist
   * @memberof mp3Player.TrackListView
   */
  TrackListView.prototype.initializeTracklist = function initializeTracklist(){
    var tracks = $('#tracklist');
    tracks.html('');
    for(var i = 0; i < this.model.trackList.length; i++){
      tracks.append('<div class="tracks" draggable="true" id="' + this.model.trackList[i].id + '">' + this.model.trackList[i].title + ' - ' + this.model.trackList[i].artist + '</div>');
    }
  }
  /**
   * @constructor
   * VolumeSliderView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   * @property {object} volumeSlider
   * @property {object} slider
   */
  var VolumeSliderView = function VolumeSliderView(model, $element){
    this.model = model;
    this.volumeSlider = $('#volumeSlider');

    this.slider = new components.HSlider({
        view: this.volumeSlider,
        min: parseFloat(this.volumeSlider.attr('data-min')),
        max: parseFloat(this.volumeSlider.attr('data-max')),
        value: parseFloat(this.volumeSlider.attr('data-value'))
    });

    $(this.slider).on('change', this.updateValue.bind(this));
    $(this.model).on('volumeChange', this.updateButton.bind(this));
    $(this.model).on('muteChange', this.muteButton.bind(this));
  }
  /**
   * @method updateValue
   * @memberof mp3Player.VolumeSliderView
   */
  VolumeSliderView.prototype.updateValue = function updateValue(e){
    this.model.setVolume(this.slider.getValue());
    if(this.model.muted){
        this.model.unMute();
    }
  };
  /**
   * @method muteButton
   * @memberof mp3Player.VolumeSliderView
   */
  VolumeSliderView.prototype.muteButton = function(e) {
    if(this.model.muted){
        this.model.unMute();
        this.slider.setExternalValue(this.model.volume);
    }
    else {
        this.model.mute();
        this.slider.setExternalValue(0);
    }
  };
  /**
   * @method updateButton
   * @memberof mp3Player.VolumeSliderView
   */
  VolumeSliderView.prototype.updateButton = function(e){
      if(this.model.volume < 0.5 && this.model.volume > 0.0 && this.model.muted == false){
          $('#btnVolume').removeClass('volume-up-bg volume-off-bg');
          $('#btnVolume').addClass('volume-down-bg');
      }
      else if(this.model.volume >= 0.5 && this.model.muted == false){
          $('#btnVolume').removeClass('volume-down-bg volume-off-bg');
          $('#btnVolume').addClass('volume-up-bg');
      }
      else if(this.model.muted || this.model.volume == 0){
          $('#btnVolume').removeClass('volume-down-bg volume-up-bg');
          $('#btnVolume').addClass('volume-off-bg');
      }
  };
  /**
   * @constructor
   * DraggableItemView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   * @property {object} dragStartElem
   */
  var DraggableItemView = function DraggableItemView(model){
    this.model = model;
    this.dragStartElem = null;
    $(this.model).on('tracklistLoaded', this.initializeDraggableItems.bind(this, arguments));
  }
  /**
   * @method initializeDraggableItems
   * @memberof mp3Player.DraggableItemView
   * @param  {event} event
   * @param  {array} trackList
   */
  DraggableItemView.prototype.initializeDraggableItems = function initializeDraggableItems(event, trackList) {
    var that = this;
    $('.tracks').each(function(index) {
      // start dragging
      $(this).on('dragstart', function(e) {
        $(this).addClass('dragging');

        $('<hr id="targetPos" />').insertAfter(this);

        that.dragStartElem = this;

        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
      });

      // enter another element
      $(this).on('dragenter', function(e) {});
      // leave element
      $(this).on('dragleave', function(e) {});
      // stop dragging
      $(this).on('dragend', function(e) {
        $('#targetPos').remove();
        $(that.dragStartElem).removeClass('dragging');
      });
    });
    // hover over another element
    $('#tracklist').on('dragover', function(e) {
      e.originalEvent.dataTransfer.dropEffect = 'move';
      var placeholder = null;

      if ($(window.event.target).hasClass('tracks') && window.event.pageY > ($(window.event.target).offset().top + ($(window.event.target).height() / 2) + $('#targetPos').height())) {
        placeholder = $('#targetPos').detach();
        placeholder.insertAfter(window.event.target);
      } else if ($(window.event.target).hasClass('tracks') && window.event.pageY <= ($(window.event.target).offset().top + ($(window.event.target).height() / 2) + $('#targetPos').height())) {
        placeholder = $('#targetPos').detach();
        placeholder.insertBefore(window.event.target);
      }

      e.preventDefault();
    });
    // drop the item
    $('#tracklist').on('drop', function(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      // rearrange Tracks in DOM
      var tempStartElem = $(that.dragStartElem).detach();
      tempStartElem.insertAfter($('#targetPos'));

      // rearrange Tracks in the Tracklist
      var tempArrayElem;

      for (var i = 0; i < that.model.trackList.length; i++) {
        if (that.model.trackList[i].id == that.dragStartElem.id) {
          tempArrayElem = that.model.trackList[i];
          that.model.trackList.remove(i);
          break;
        }
      };

      that.model.trackList.insert(($(that.dragStartElem).index() - 1), tempArrayElem);
    });
    console.log('draggable Elements initialized...');
  };
  /**
   * @constructor
   * VisualizationGraphView
   * @memberOf mp3Player
   * @property {object} model - the Mp3Model where this controller belongs to
   * @property {object} graph
   */
  var VisualizationGraphView = function VisualizationGraphView(model){
    this.model = model;
    this.graph = $('#graph');
    this.initialize();
    this.update();
  }
  /**
   * @method initialize
   * @memberof mp3Player.VisualizationGraphView
   */
  VisualizationGraphView.prototype.initialize = function initialize(){
    this.graph.html('');
    for(var i = 0; i < 32; i++){
      this.graph.append('<div class="frequency-bar" id="frequency_' + i + '"></div>');
      var leftValue = i * 12 + 5;
      $('#frequency_' + i).css({
        left: leftValue
      });
    }
  };
  /**
   * @method update
   * @memberof mp3Player.VisualizationGraphView
   */
  VisualizationGraphView.prototype.update = function update(){
    var that = this;
    requestAnimationFrame(function(){
      that.update();
    });
    this.model.analyser.getByteFrequencyData(this.model.frequencyData);

    var bars = this.graph.find('.frequency-bar');
    // Update the visualisation
    bars.each(function (index, bar) {
      var value = that.model.frequencyData[index] / 2;
        bar.style.height = value + 'px';
    });
  };

  namespace.Mp3ControlsView = Mp3ControlsView;
  namespace.ProgressSliderView = ProgressSliderView;
  namespace.VolumeSliderView = VolumeSliderView;
  namespace.TrackInfoView = TrackInfoView;
  namespace.TrackListView = TrackListView;
  namespace.DraggableItemView = DraggableItemView;
  namespace.VisualizationGraphView = VisualizationGraphView;

})(window, mp3Player);