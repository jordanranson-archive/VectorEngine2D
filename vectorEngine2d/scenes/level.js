var Level = function(game, levelId) {
	var _this = this;
	this.game = game;
	this.renderManager = this.game.renderManager;
	this.resourceManager = this.game.resourceManager;
	this.inputManager = this.game.inputManager;
	this.sceneManager = this.game.sceneManager;
	this.camera = new Camera(this.renderManager.canvas.width / 2, 100);
	this.tiles = [];
	this.gameObjectManager = new GameObjectManager(this);
	
	// States
	this.isPaused = false;
	
	// Load the tiles for the level
	this.loadTiles(levelId);
	
	// Add game objects like the player
	this.gameObjectManager.addObject(new Player(this, 100, -100, 36, 32));
	
	// Pause the game
	this.inputManager.addKeyEvent(KeyAction.cancel, function() {
		_this.isPaused = !_this.isPaused;
	});
    
    /* Debug keys */
    
	// Toggle wireframes
	this.inputManager.addKeyEvent(KeyAction.func1, function() {
		_this.renderManager.wireframes = !_this.renderManager.wireframes;
	});
};

Level.prototype.loadContent = function(resourceManager) {
    this.gameObjectManager.loadContent(resourceManager);
};

Level.prototype.unload = function(callback) {
	this.inputManager.removeKeyEvent(this.inputManager.keyAction.cancel);
	callback();
};

Level.prototype.loadTiles = function(levelId) {
	var getNextPoint = function(frequency, offset, step, width, center) {
		return (Math.sin(frequency * step + offset) * width + center) >> 0;
	}
	
	var levelDefaults = {
		width: 30,
		length: 500,
		frequency: 0.2,
		wavelength: 48,
		offset: 330
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
    var passthroughLength = 0;
    
    // Find a smooth slope to start on
    var startLength = 25;
    var endLength = 50;
    var endBuffer = 15;
    count = startLength;
    while(true) {
        wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 1) + freq2 *  Math.PI / 3) * 32);
        y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 1), wavelength, levelPrefs.offset);
        wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 2) + freq2 *  Math.PI / 3) * 32);
        y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 2), wavelength, levelPrefs.offset);
        wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count) + freq2 *  Math.PI / 3) * 32);
        y3 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count), wavelength, levelPrefs.offset);
        
        // If next tile has no more than +/- 10px difference in height
        if(y == y3 && y2 - y > -10 && y2 - y < 10) {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 2) + freq2 *  Math.PI / 3) * 32);
            y3 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (count + 2), wavelength, levelPrefs.offset);
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (count + 3) + freq2 *  Math.PI / 3) * 32);
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
            passthroughLength = (Math.random() * 2).toFixed() * 1 + 1;
            tempPassLength = passthroughLength;
            gapLength = (Math.random() * 7).toFixed() * 1 + 4 + passthroughLength;
            solidLength = 0;
        }
        if(gapLength < 0) { 
            gapLength = 0; 
        }
        if(passthroughLength < 0) {
            passthroughLength = 0;
        }
        if(tempPassLength < 0) {
            tempPassLength = 0;
        }
        
        // Choose gap or rail
        if(gapLength > 0) {
            // Randomize track
            if(gapLength == passthroughLength + 1) {
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
                type = TileType.passthrough;
                displayType = TileDisplayType.railOnly;
                tempPassLength--;
                
            // End edge of rail
            } else {
                if(gapLength <= passthroughLength) {
                    type = TileType.passthrough;
                    displayType = TileDisplayType.railOnly;
                } else {
                    type = TileType.air;
                    displayType = TileDisplayType.none;
                }
                gapLength--;
            }
        } else {
            //type = (i % 4 == 0 || i % 4 == 1) ? TileType.solid : TileType.passthrough;
            type = TileType.oneway;
            displayType = TileDisplayType.scaffold;
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
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * startPos + freq2 *  Math.PI / 3) * 32);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, startPos, wavelength, levelPrefs.offset);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, startPos, wavelength, levelPrefs.offset);

        // Rest of level
        } else {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * i + freq2 *  Math.PI / 3) * 32);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, i, wavelength, levelPrefs.offset);
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (i + 1) + freq2 *  Math.PI / 3) * 32);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, i + 1, wavelength, levelPrefs.offset);
        }
        
        // End of level
        if(i >= levelDefaults.length - endLength - 2) {
            if(i < levelDefaults.length - endLength) {
                type = TileType.passthrough;
                displayType = TileDisplayType.railOnly;
            }
            
            // Flat surface
            if(i >= levelDefaults.length - endLength) {
                y = 420;
                y2 = 420;
                
                if(i <= levelDefaults.length - endLength + 5) {
                    type = TileType.air;
                    displayType = TileDisplayType.none;
                } else if(i <= levelDefaults.length - endLength + 6) {
                    type = TileType.passthrough;
                    displayType = TileDisplayType.railOnly;
                    y -= 7;
                } else if(i > levelDefaults.length - endLength + 6) {
                    type = TileType.solid;
                    displayType = TileDisplayType.solidGround;
                    if(i == levelDefaults.length - endLength + 7) {
                        data = 2;
                    }
                }
                
            }
        }
        
        tile = new Tile(this, (i - (startPos - startLength)) * levelDefaults.width, y, (i - (startPos - startLength)) * levelDefaults.width + levelDefaults.width, y2, type);
        tile.displayType = displayType;
        if(data !== false) {
            tile.data = data;
        }
        this.tiles.push(tile);
	}
};

Level.prototype.update = function() {
	this.gameObjectManager.update();
};

Level.prototype.draw = function() {
    // Draw tiles
	for(var i = 0; i < this.tiles.length; i++) { this.tiles[i].draw(); }
    
    // Draw game objects
	this.gameObjectManager.draw();
	
    // Draw pause menu
	if(this.isPaused) {
		this.renderManager.drawRectangle(0, 0, this.renderManager.canvas.width, this.renderManager.canvas.height, "transparent", 0, "rgba(0,0,0,0.5)");
		this.renderManager.drawText(this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2, "#ffffff", "20pt sans-serif", "center", "Game Paused");
	}
};