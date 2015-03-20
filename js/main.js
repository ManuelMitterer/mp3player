$(function () {

  var mp3Model = new mp3Player.Mp3Model();
  var mp3Controller = new mp3Player.Mp3Controller(mp3Model);

  var Mp3ControlsView = new mp3Player.Mp3ControlsView(mp3Model);
  var ProgressSliderView = new mp3Player.ProgressSliderView(mp3Model);
  var TrackInfoView = new mp3Player.TrackInfoView(mp3Model);
  var TrackListView = new mp3Player.TrackListView(mp3Model);
  var VolumeSliderView = new mp3Player.VolumeSliderView(mp3Model);
  var DraggableItemView = new mp3Player.DraggableItemView(mp3Model);
  var VisualizationGraphView = new mp3Player.VisualizationGraphView(mp3Model);
});