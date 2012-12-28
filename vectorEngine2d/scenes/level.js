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
		length: 300,
		frequency: 0.2,
		wavelength: 48,
		offset: 330
        
	};

	var tile, wavelength, y, y2;
    var gapLength = 0;
    var solidLength = 0;
	for(var i = 0; i < levelDefaults.length; i ++) {
        if(i > 25 && solidLength >= 2 && gapLength == 0 && (Math.random() * 5).toFixed() == 0) {
            gapLength = (Math.random() * 9).toFixed() * 1 + 3;
            solidLength = 0;
        }
        
        if(gapLength < 0) { gapLength = 0; };
        
        if(gapLength > 0) {
            y = 420;
            y2 = 420;
            gapLength--;
        } else {
            wavelength = levelDefaults.wavelength + (Math.sin(0.25 * i + 0.1 *  Math.PI / 3) * 32);
            y = getNextPoint(levelDefaults.frequency, levelDefaults.frequency * Math.PI / 3, i, wavelength, levelDefaults.offset);

            wavelength = levelDefaults.wavelength + (Math.sin(0.25 * (i + 1) + 0.1 *  Math.PI / 3) * 32);
            y2 = getNextPoint(levelDefaults.frequency, levelDefaults.frequency * Math.PI / 3, i + 1, wavelength, levelDefaults.offset);
            solidLength++;
        }
        
		tile = new Tile(i * levelDefaults.width, y, i * levelDefaults.width + levelDefaults.width, y2);
		this.tiles.push(tile);
	}
	
	/*var y = 300 + (Math.random() * 150);
	var y;
	for(var i = levelPrefs.length / 2; i < levelPrefs.length; i ++) {
		if(i % 5 == 0) {
			if((Math.random() * 5) < 1) {
				y = 1000;
			} else {
				y = (300 + (Math.random() * 150)).toFixed(0);
			}
		}
		tile = new Tile(i * levelPrefs.width, y, i * levelPrefs.width + levelPrefs.width, y);
		this.tiles.push(tile);
	}*/
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