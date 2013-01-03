var SceneManager = function(game) {
    this.game = game;
    this.scene = new Scene(game);
};

SceneManager.prototype.loadScene = function(scene) {
    var _this = this;
    this.scene.unload(function() {
        // Load scene content before loading the scene
        scene.loadContent(_this.game.resourceManager);
        var timer = setInterval(function() {
            if(document.readyState == "complete"){
                clearInterval(timer);
                _this.scene = scene;
            }
        }, 100);
    });
};

SceneManager.prototype.update = function() {
    if(!this.scene.isPaused) {
        this.scene.update();
    }
};

SceneManager.prototype.draw = function() {
    this.scene.draw();
};