var Level = function(game, levelId) {
    this.renderManager = game.renderManager;
    this.resourceManager = game.resourceManager;
    this.inputManager = game.inputManager;
    this.sceneManager = game.sceneManager;
    this.camera = new Camera(this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2);
    this.tiles = [];
    this.gameObjectManager = new GameObjectManager(this);
    
    // States
    this.isPaused = false;
    
    // Load the tiles for the level
    this.levelPrefs = {
        tileWidth: 16
    };
    
    // Add game objects like the player
    this.gameObjectManager.addObject(new Player(this, 100, -100, 28, 38, 40, 44)); // x, y, width, height, drawingWidth, drawingHeight
};

Level.prototype.init = function() {
    var _this = this;
        
    // Generate the level
    if(window.location.hash == "#sine") {
        this.tiles[0] = this.generateTiles();
    } else {
        this.tiles[0] = this.generateTiles3(250, TileType.solid, TileDisplayType.solidGround);
        this.tiles[1] = this.generateTiles3(110, TileType.platform, TileDisplayType.scaffold);
        this.gameObjectManager.init();
    }
    
    // Pause the game
    this.inputManager.addKeyEvent(KeyAction.cancel, function() {
        _this.isPaused = !_this.isPaused;
    });
    
    /* Debug keys */
    
    // Toggle wireframes
    this.inputManager.addKeyEvent(KeyAction.func1, function() {
        _this.renderManager.wireframes = !_this.renderManager.wireframes;
    });
    
    // BGM
    this.resourceManager.audio["emerald-hill"].volume = 0.5;
    //this.resourceManager.audio["emerald-hill"].play();
    
    // Toggle wireframes
    this.inputManager.addKeyEvent(KeyAction.func3, function() {
        if(_this.resourceManager.audio["emerald-hill"].paused) {
            _this.resourceManager.audio["emerald-hill"].play();
        } else {
            _this.resourceManager.audio["emerald-hill"].pause();
        }
    });    
    
    this.update();
};

Level.prototype.loadContent = function() {
    var timestamp = new Date().getTime();
    this.resourceManager.load("images/test-tile.png?" + timestamp, "test-tile", ResourceType.image);
    this.resourceManager.load("images/background-1.png?" + timestamp, "paralax-1", ResourceType.image);
    this.resourceManager.load("images/background-2.png?" + timestamp, "paralax-2", ResourceType.image);
    this.resourceManager.load("sounds/emerald-hill.mp3", "emerald-hill", ResourceType.audio);
    this.gameObjectManager.loadContent();
};

Level.prototype.unload = function(callback) {
    this.inputManager.removeKeyEvent(this.inputManager.keyAction.cancel);
    callback();
};

Level.prototype.loadTiles = function(levelId) {};

Level.prototype.generateTiles = function() {
    var tiles = [];
    
    var getNextPoint = function(frequency, offset, step, width, center) {
        return (Math.sin(frequency * step + offset) * width + center) >> 0;
    }
    
    var levelDefaults = {
        width: this.levelPrefs.tileWidth,
        length: 500,
        frequency: 0.1,
        wavelength: 24,
        offset: this.renderManager.canvas.height - (this.renderManager.canvas.height * 0.4)
    };
    var levelPrefs = {
        frequency: levelDefaults.frequency,
        wavelength: levelDefaults.wavelength,
        offset: levelDefaults.offset
    };

    var tile, wavelength, y, y2, y3, y4, type, displayType, data, tempPassLength, startPos, endPos;
    var freq1 = ((Math.random() * 0.15) * 1 + 0.1);
    var freq2 = ((Math.random() * 0.15) * 1 + 0.1);
    var gapLength = 0;
    var solidLength = 0;
    var platformLength = 0;
    
    // Find a smooth slope to start on
    var startLength = 25;
    var endLength = 50;
    var endBuffer = 15;
    count = startLength;
    while(true) {
        wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 1) + freq2 *  Math.PI / 3) * 24);
        y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 1), wavelength, levelPrefs.offset);
        wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 2) + freq2 *  Math.PI / 3) * 24);
        y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 2), wavelength, levelPrefs.offset);
        wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count) + freq2 *  Math.PI / 3) * 24);
        y3 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count), wavelength, levelPrefs.offset);
        
        // If next tile has no more than +/- 10px difference in height
        if(y == y3 && y2 - y > -10 && y2 - y < 10) {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 2) + freq2 *  Math.PI / 3) * 24);
            y3 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 2), wavelength, levelPrefs.offset);
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 3) + freq2 *  Math.PI / 3) * 24);
            y4 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 3), wavelength, levelPrefs.offset);
            
            // If 2nd next tile has the same slope direction as 1st
            if((y2 - y < 0 && y4 - y3 < 0) || (y2 - y > 0 && y4 - y3 > 0)) {
                startPos = count;
                break;
            }
        }
        
        count++;
    }
    levelDefaults.length += startPos - startLength;

    // Tile creation loop
    for(var i = startPos - startLength; i < levelDefaults.length; i++) {
        type = TileType.solid;
        displayType = TileDisplayType.solidGround;
        data = false;

        // Gaps         
        if((i > startPos && i < (levelDefaults.length - endLength - endBuffer) // 25: flat end surface, 10: number of tiles before end to keep solid
        && solidLength >= 3 && gapLength == 0 
        && (Math.random() * 20).toFixed() == 0)) {
            platformLength = (Math.random() * 2).toFixed() * 1 + 1;
            tempPassLength = platformLength;
            gapLength = (Math.random() * 7).toFixed() * 1 + 4 + platformLength;
            solidLength = 0;
        }
        if(gapLength < 0) { 
            gapLength = 0; 
        }
        if(platformLength < 0) {
            platformLength = 0;
        }
        if(tempPassLength < 0) {
            tempPassLength = 0;
        }
        
        // Choose gap or rail
        if(gapLength > 0) {
            // Randomize track
            if(gapLength == platformLength + 1) {
                levelPrefs = {
                    frequency: levelDefaults.frequency + ((Math.random() * 0.2) * 1 - 0.1),
                    wavelength: levelDefaults.wavelength + ((Math.random() * 24).toFixed() * 1 - 12),
                    offset: levelDefaults.offset + ((Math.random() * 50).toFixed() * 1)
                };
                freq1 = ((Math.random() * 0.15) * 1 + 0.1);
                freq2 = ((Math.random() * 0.15) * 1 + 0.1);
            }
            
            // Beginning edge of rail
            if(tempPassLength > 0) {
                type = TileType.platform;
                displayType = TileDisplayType.scaffold;
                tempPassLength--;
                
            // End edge of rail
            } else {
                if(gapLength <= platformLength) {
                    type = TileType.platform;
                    displayType = TileDisplayType.scaffold;
                } else {
                    type = TileType.air;
                    displayType = TileDisplayType.none;
                }
                gapLength--;
            }
        } else {
            //type = (i % 4 == 0 || i % 4 == 1) ? TileType.solid : TileType.solid;
            type = TileType.solid;
            displayType = TileDisplayType.solidGround;
            solidLength++;
        }
        
        // Start of level
        if(i <= startPos) {     
            if(i <= startPos - 1) {     
                type = TileType.solid;
                displayType = TileDisplayType.solidGround;
            }
            if(i == startPos - 1) {
                data = 1;
            }
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * startPos + freq2 *  Math.PI / 3) * 24);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, startPos, wavelength, levelPrefs.offset);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, startPos, wavelength, levelPrefs.offset);

        // Rest of level
        } else {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * i + freq2 *  Math.PI / 3) * 24);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, i, wavelength, levelPrefs.offset);
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (i + 1) + freq2 *  Math.PI / 3) * 24);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, i + 1, wavelength, levelPrefs.offset);
        }
        
        // End of level
        if(i >= levelDefaults.length - endLength - 2) {
            if(i < levelDefaults.length - endLength) {
                type = TileType.solid;
                displayType = TileDisplayType.solidGround;
            }
            
            // Flat surface
            if(i >= levelDefaults.length - endLength) {
                y = this.renderManager.canvas.height / 2;
                y2 = this.renderManager.canvas.height / 2;
                
                if(i <= levelDefaults.length - endLength + 6) {
                    type = TileType.air;
                    displayType = TileDisplayType.none;
                } else if(i > levelDefaults.length - endLength + 6) {
                    type = TileType.solid;
                    displayType = TileDisplayType.solidGround;
                    if(i == levelDefaults.length - endLength + 7) {
                        data = 2;
                    }
                }
                
            }
        }
        
        tile = new Tile(
            this, 
            (i - (startPos - startLength)) * levelDefaults.width, y, // x1, y1
            (i - (startPos - startLength)) * levelDefaults.width + levelDefaults.width, y2, // x2, y2
            (i - (startPos - startLength)) * levelDefaults.width, y < y2 ? y : y2, // drawing x, drawing y
            levelDefaults.width, 500, // drawing width, drawing height
            type
        );
        tile.displayType = displayType;
        if(data !== false) {
            tile.data = data;
        }
        tiles.push(tile);
    }
    
    return tiles;
};

Level.prototype.generateTiles2 = function() {
    var tiles = [];
    for(var i = 0; i < 500; i++) {
        tile = new Tile(
            this, 
            i * this.levelPrefs.tileWidth, this.renderManager.canvas.height / 2, 
            i * this.levelPrefs.tileWidth + this.levelPrefs.tileWidth, this.renderManager.canvas.height / 2,
            i * this.levelPrefs.tileWidth, this.renderManager.canvas.height / 2,
            this.levelPrefs.tileWidth, 500,
            TileType.solid
        );
        tile.displayType = TileDisplayType.solidGround;
        tiles.push(tile);
    }
    return tiles;
};

Level.prototype.generateTiles3 = function(height, type, displayType) {
    var tiles = [];
    var tile;
    var adjHeight = height;
    var distance = 25 + (Math.random() * 6 - 3 >> 0);
    for(var i = 0; i < 500; i++) {
        if(i % distance === 0) {
            distance = 25 + (Math.random() * 6 - 3 >> 0);
            adjHeight = height + (Math.random() * 60 - 30 >> 0);
        }
        tile = new Tile(
            this, 
            i * this.levelPrefs.tileWidth, adjHeight, 
            i * this.levelPrefs.tileWidth + this.levelPrefs.tileWidth, adjHeight,
            i * this.levelPrefs.tileWidth, adjHeight,
            this.levelPrefs.tileWidth, 500,
            type
        );
        tile.displayType = displayType;
        tiles.push(tile);
    }
    return tiles;
};

Level.prototype.update = function() {
    this.gameObjectManager.update();
};

Level.prototype.draw = function() {
    var images = this.resourceManager.images;

        // Draw background
        if(!this.renderManager.wireframes) {
            this.renderManager.drawRectangle(0, 0, this.renderManager.canvas.width, this.renderManager.canvas.height, "transparent", 0, "#0020C0");
            
            this.renderManager.drawImage(images["paralax-1"], this.camera.x / 8 * -1 - images["paralax-1"].width, 0, images["paralax-1"].width, images["paralax-1"].height);
            this.renderManager.drawImage(images["paralax-1"], this.camera.x / 8 * -1, 0, images["paralax-1"].width, images["paralax-1"].height);
            this.renderManager.drawImage(images["paralax-1"], images["paralax-1"].width + this.camera.x / 8 * -1, 0, images["paralax-1"].width, images["paralax-1"].height);
            this.renderManager.drawImage(images["paralax-1"], images["paralax-1"].width * 2 + this.camera.x / 8 * -1, 0, images["paralax-1"].width, images["paralax-1"].height);
            this.renderManager.drawImage(images["paralax-1"], images["paralax-1"].width * 3 + this.camera.x / 8 * -1, 0, images["paralax-1"].width, images["paralax-1"].height);
            
            this.renderManager.drawImage(images["paralax-2"], this.camera.x / 4 * -1 - images["paralax-2"].width, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 2 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 3 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 4 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 5 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 6 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 7 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 8 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
            this.renderManager.drawImage(images["paralax-2"], images["paralax-2"].width * 9 + this.camera.x / 4 * -1, this.renderManager.canvas.height - images["paralax-2"].height, images["paralax-2"].width, images["paralax-2"].height);
    }

    // Draw tiles
    for(var x = this.tiles.length - 1; x >= 0; x--) { 
        for(var y = 0; y < this.tiles[x].length; y++) { 
            this.tiles[x][y].draw(); 
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