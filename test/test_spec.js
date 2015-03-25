global.window = {};
global.webkitAudioContext = {};

var assert = require("assert"),
    mp3 = require("../js/model.js"),
    should = require("should"),
    mp3Model,
    timeOut;

var createModel = function() {
    return mp3Model = new mp3.Mp3Model();
}


describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            model = setInterval(createModel, 300);
            model.mute;
           // assert(true);
        })
    })
})