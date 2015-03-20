global.window = {};
global.webkitAudioContext = {};

var assert = require("assert"),
    mp3 = require("../js/model.js"),
    should = require("should");


describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      var mp3Model = new mp3.Mp3Model();

      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})