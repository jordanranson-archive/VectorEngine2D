var Level = function(game, levelId) {
    this.renderManager = game.renderManager;
    this.resourceManager = game.resourceManager;
    this.inputManager = game.inputManager;
    this.sceneManager = game.sceneManager;
    this.camera = new Camera(this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2);
    this.tiles = [];
    this.levelLength = 0;
    this.levelHeight = 0;
    this.gameObjectManager = new GameObjectManager(this);
    
    // States
    this.isRunning = false;
    this.isPaused = false;

    // Add game objects like the player
    this.gameObjectManager.addObject(new Player(this, this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2, 20, 32, 16, 32)); // x, y, width, height, drawingWidth, drawingHeight
};

Level.prototype.init = function() {
    var _this = this;
    //this.loadTilesFromText(this.resourceManager.generic["test-level"]);
    this.loadTilesFromImage(this.resourceManager.images["test-level"]);
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
    this.resourceManager.load("levels/test.png?" + timestamp, "test-level", ResourceType.image);
    this.gameObjectManager.loadContent();
};

Level.prototype.unload = function(callback) {
    this.inputManager.removeKeyEvent(this.inputManager.keyAction.cancel);
    callback();
};

Level.prototype.loadTilesFromText = function(text) {
    var levelData = text.replace(/ /g, "");
    var tileRows = levelData.match(/[^\r\n]+/g);
    var tileCols;
    var tiles;
    var tile;
    var tileSize = 16;
    var tileType;
    
    this.levelLength = tileRows[0].split('').length;
    this.levelHeight = tileRows.length;
    
    for(var y = 0; y < tileRows.length; y++) {
        tileCols = tileRows[y].split('');
        tiles = [];
        for(var x = 0; x < tileCols.length; x++) {
            tile = new Tile(this,
                x * tileSize, y * tileSize, 
                tileSize, tileSize, 
                tileCols[x], tileCols[x] === "A" ? TileDisplayType.none : TileDisplayType.normal
            );
            tiles.push(tile);
        }
        this.tiles.push(tiles);
    }
    
    //console.log(this.tiles);
};

Level.prototype.loadTilesFromImage = function(image) {
    var levelData = Util.getImageData(image).data;
    var numPixels = image.width * image.height;
    var tileSize = 16;
    var row = [];
    var pixelColor, tile, x, y, r, g, b;
    
    this.levelLength = image.width;
    this.levelHeight = image.height;
    
    for(var i = 0; i < numPixels * 4; i += 4) {
        r = levelData[i].toString(16);
        r = r.split("").length < 2 ? "0" + r : r;
        g = levelData[i + 1].toString(16);
        g = g.split("").length < 2 ? "0" + g : g;
        b = levelData[i + 2].toString(16);
        b = b.split("").length < 2 ? "0" + b : b;
        pixelColor = "#" + r + g + b;
        
        x = (i / 4) % image.width;
        y = Math.floor(((i / 4) / image.width) % image.height);
        
        var tileType = ColorMap[pixelColor.toUpperCase()];
        var points = [];
        
        if(tileType === TileType.slope1a) {
            points = [
                {x: x,      y: y},
                {x: x + 16, y: y + 4},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope1b) {
            points = [
                {x: x,      y: y + 4},
                {x: x + 16, y: y + 8},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope1c) {
            points = [
                {x: x,      y: y + 8},
                {x: x + 16, y: y + 12},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope1d) {
            points = [
                {x: x,      y: y + 12},
                {x: x + 16, y: y + 16},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope2a) {
            points = [
                {x: x,      y: y},
                {x: x + 16, y: y + 8},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope2b) {
            points = [
                {x: x,      y: y + 8},
                {x: x + 16, y: y + 16},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope3a) {
            points = [
                {x: x,      y: y + 16},
                {x: x + 16, y: y + 12},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope3b) {
            points = [
                {x: x,      y: y + 12},
                {x: x + 16, y: y + 8},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope3c) {
            points = [
                {x: x,      y: y + 8},
                {x: x + 16, y: y + 4},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope3d) {
            points = [
                {x: x,      y: y + 4},
                {x: x + 16, y: y},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope4a) {
            points = [
                {x: x,      y: y + 16},
                {x: x + 16, y: y + 8},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }
        if(tileType === TileType.slope4b) {
            points = [
                {x: x,      y: y + 8},
                {x: x + 16, y: y},
                {x: x + 16, y: y + 16},
                {x: x,      y: y + 16},
                {x: x,      y: y}
            ];
        }

        tile = new Tile(this,
            x * tileSize, y * tileSize, 
            tileSize, tileSize, 
            tileType, tileType === TileType.air ? TileDisplayType.none : TileDisplayType.normal
        );
        tile.data.points = points;
        row.push(tile);
    
        if((i / 4) % image.width === image.width - 1) {
            this.tiles.push(row);
            row = [];
        }
    }
    
    //console.log(this.tiles);
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