var Level = function(game, levelId) {
	this.game = game;
	this.isPaused = true;
	this.tiles = [];
	this.gameObjectManager = new GameObjectManager(game);
};

Level.prototype = new Scene();

Level.prototype.unload = function(callback) {
	callback();
};

Level.prototype.update = function() {
	for(var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].update();
	}
	this.gameObjectManager.update();
};

Level.prototype.draw = function() {
	for(var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].draw();
	}
	this.gameObjectManager.draw();
};