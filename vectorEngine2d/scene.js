var Scene = function(game) {
	this.game = game;
	this.isPaused = true;
};

Scene.prototype.unload = function(callback) {
	callback();
};

Scene.prototype.update = function() {

};

Scene.prototype.draw = function() {

};