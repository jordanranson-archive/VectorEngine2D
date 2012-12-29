var GameObjectManager = function(game) {
	this.game = game;
	this.gameObjects = [];
};

GameObjectManager.prototype.loadContent = function(resourceManager) {
    for(var i = 0; i < this.gameObjects.length; i++) {
		this.gameObjects[i].loadContent(this.game.resourceManager);
	}
}

GameObjectManager.prototype.addObject = function(gameObject) {
	this.gameObjects.push(gameObject);
};

GameObjectManager.prototype.update = function() {
	for(var i = 0; i < this.gameObjects.length; i++) {
		this.gameObjects[i].update(this.game);
	}
};

GameObjectManager.prototype.draw = function() {
	for(var i = 0; i < this.gameObjects.length; i++) {
		this.gameObjects[i].draw(this.game.renderManager, this.game.sceneManager.scene.camera);
	}
};