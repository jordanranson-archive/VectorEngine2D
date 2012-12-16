var SceneManager = function(game) {
	this.game = game;
	this.scene = new Scene(game);
};

SceneManager.prototype.loadScene = function(scene) {
	var _this = this;
	this.scene.unload(function() { _this.scene = scene; });
};

SceneManager.prototype.update = function() {
	if(!this.scene.isPaused) {
		this.scene.update();
	}
};

SceneManager.prototype.draw = function() {
	this.scene.draw();
};