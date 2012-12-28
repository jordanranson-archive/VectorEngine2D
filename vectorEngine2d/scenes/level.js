var Level = function(game, levelId) {
	var _this = this;
	this.game = game;
	this.camera = new Camera(this.game.renderManager.canvas.width / 2, 100);
	this.tiles = [];
	this.gameObjectManager = new GameObjectManager(game);
	
	// States
	this.isPaused = false;
	
	// Load the tiles for the level
	this.loadTiles(levelId);
	
	// Add game objects like the player
	this.gameObjectManager.addObject(new Player(game, this.game.renderManager.canvas.width / 2, 100, 40, 40));
	
	// Pause the game
	this.game.inputManager.addKeyEvent(KeyAction.cancel, function() {
		_this.isPaused = _this.isPaused ? false : true;
	});
};

Level.prototype = new Scene();

Level.prototype.unload = function(callback) {
	this.game.inputManager.removeKeyEvent(this.game.inputManager.keyAction.cancel);
	callback();
};

Level.prototype.loadTiles = function(levelId) {
	var getNextPoint = function(frequency, offset, step, width, center) {
		return (Math.sin(frequency * step + offset) * width + center) >> 0;
	}
	
	var levelDefaults = {
		width: 30,
		length: 400,
		frequency: 0.2,
		wavelength: 48,
		offset: 330
	};
    var levelPrefs = {
		frequency: levelDefaults.frequency,
		wavelength: levelDefaults.wavelength,
		offset: levelDefaults.offset
	};

	var tile, wavelength, y, y2, type, tempPassLength;
    var freq1 = ((Math.random() * 0.15) * 1 + 0.1);
    var freq2 = ((Math.random() * 0.15) * 1 + 0.1);
    var gapLength = 0;
    var solidLength = 0;
    var passthroughLength = 0;
	for(var i = 0; i < levelDefaults.length; i ++) {
        type = TileType.solid;
        
        // Gaps         
        if((i > 25 && i < (levelDefaults.length - 25) && solidLength >= 3 && gapLength == 0 && (Math.random() * 20).toFixed() == 0)) {
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
                tempPassLength--;
                
            // End edge of rail
            } else {
                if(gapLength <= passthroughLength) {
                    type = TileType.passthrough;
                } else {
                    type = TileType.air;
                }
                gapLength--;
            }
        } else {
            //type = (i % 4 == 0 || i % 4 == 1) ? TileType.solid : TileType.passthrough;
            type = TileType.solid;
            solidLength++;
        }
        
        // Start of level
        if(i <= 25) {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * 26 + freq2 *  Math.PI / 3) * 32);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, 26, wavelength, levelPrefs.offset);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, 26, wavelength, levelPrefs.offset);
            
        // End of level
        } else if(i >= levelDefaults.length - 25) {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (levelDefaults.length - 25) + freq2 *  Math.PI / 3) * 32);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (levelDefaults.length - 25), wavelength, levelPrefs.offset);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, (levelDefaults.length - 25), wavelength, levelPrefs.offset);
            
        // Rest of level
        } else {
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * i + freq2 *  Math.PI / 3) * 32);
            y = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, i, wavelength, levelPrefs.offset);
            wavelength = levelPrefs.wavelength + (Math.sin(freq1 * (i + 1) + freq2 *  Math.PI / 3) * 32);
            y2 = getNextPoint(levelPrefs.frequency, levelPrefs.frequency * Math.PI / 3, i + 1, wavelength, levelPrefs.offset);
        }
        
		tile = new Tile(i * levelDefaults.width, y, i * levelDefaults.width + levelDefaults.width, y2, type);
		this.tiles.push(tile);
	}
};

Level.prototype.update = function() {
	this.gameObjectManager.update(this.game);
};

Level.prototype.draw = function() {
	for(var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].draw(this.game.renderManager, this.camera);
	}
	this.gameObjectManager.draw();
	
	if(this.isPaused) {
		this.game.renderManager.drawRectangle(0, 0, this.game.renderManager.canvas.width, this.game.renderManager.canvas.height, "transparent", 0, "rgba(0,0,0,0.5)");
		this.game.renderManager.drawText(this.game.renderManager.canvas.width / 2, this.game.renderManager.canvas.height / 2, "#ffffff", "20pt sans-serif", "center", "Game Paused");
	}
};