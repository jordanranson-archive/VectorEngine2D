var Level = function(game, levelId) {
    this.renderManager = game.renderManager;
    this.resourceManager = game.resourceManager;
    this.inputManager = game.inputManager;
    this.sceneManager = game.sceneManager;
    this.camera = new Camera(this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2);
    this.tiles = [];
    this.gameObjectManager = new GameObjectManager(this);
    
    // States
    this.isRunning = false;
    this.isPaused = false;

    // Add game objects like the player
    this.gameObjectManager.addObject(new Player(this, 128, 128, 16, 32, 16, 32)); // x, y, width, height, drawingWidth, drawingHeight
};

Level.prototype.init = function() {
    var _this = this;
    this.loadTiles();
    this.gameObjectManager.init();
    
    // Pause the game
    this.inputManager.addKeyEvent(KeyAction.cancel, function() {
        _this.isPaused = !_this.isPaused;
    });
    
    /* Debug keys */
    
    // Toggle wireframes
    this.inputManager.addKeyEvent(KeyAction.func1, function() {
        _this.renderManager.wireframes = !_this.renderManager.wireframes;
    }); 
    
    this.update();
};

Level.prototype.loadContent = function() {
    var timestamp = new Date().getTime();
    this.resourceManager.load("levels/test.txt?" + timestamp, "test-level", ResourceType.text);
    this.gameObjectManager.loadContent();
};

Level.prototype.unload = function(callback) {
    this.inputManager.removeKeyEvent(this.inputManager.keyAction.cancel);
    callback();
};

Level.prototype.loadTiles = function() {
    var levelData = this.resourceManager.generic["test-level"];
    var tileRows = levelData.match(/[^\r\n]+/g);
    var tileCols;
    var tiles;
    var tile;
    var tileSize = 16;
    var tileType;
    for(var y = 0; y < tileRows.length; y++) {
        tileCols = tileRows[y].split('');
        tiles = [];
        for(var x = 0; x < tileCols.length; x++) {
            tile = new Tile(this,
                x * tileSize, y * tileSize, 
                tileSize, tileSize, 
                tileCols[x]*1, tileCols[x]*1
            );
            tiles.push(tile);
        }
        this.tiles.push(tiles);
    }
};

Level.prototype.update = function() {
    this.gameObjectManager.update();
};

Level.prototype.draw = function() {
    var images = this.resourceManager.images;

    // Draw tiles
    for(var y = 0; y < this.tiles.length; y++) {
        for(var x = 0; x < this.tiles[y].length; x++) {
            this.tiles[y][x].draw();
        }
    }

    // Draw game objects
    this.gameObjectManager.draw();
    
    // Draw pause menu
    if(this.isPaused) {
        this.renderManager.drawRectangle(0, 0, this.renderManager.canvas.width, this.renderManager.canvas.height, "transparent", 0, "rgba(0,0,0,0.5)");
        this.renderManager.drawText(this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2, "#ffffff", "20pt sans-serif", "center", "Game Paused");
    }
};