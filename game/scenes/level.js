Level = function() {
    this.camera;
    this.players = [];
    this.gameObjects = [];
    this.initId = 0;
    this.boundries = { right: 0, bottom: 0, top: 0, left: 0 };
};

Level.prototype = {
    // Loads all the content needed at run-time
    loadContent: function(resourceManager) {
        var _this = this;
        var timestamp = new Date().getTime();
        
        /* Load content here */
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].loadContent();
        }
    },
    
    // Prepare for the level to be run
    init: function(game) {
        var _this = this;

        // Create the physics world
        this.world = Box2dUtil.createWorld();
        this.boundries.right = parseInt(game.canvas.width);
        this.boundries.bottom = parseInt(game.canvas.height);
        this.boundries.top = parseInt(game.canvas.style.top);
        this.boundries.left = parseInt(game.canvas.style.left);

        // Initialize all the game objects
        this.camera = new Camera();
        this.gameObjects.push(this.camera);
        
        this.player = new Player();
        this.gameObjects.push(this.player);
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].init(game);
        }
        
        this.createLevel();
        
        // Update first tick early so everything appears to be in position     
        // before drawing
        this.update(game);
    },

    // Remove events, unload game content, etc
    unload: function(callback) {
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].unload();
        }
        callback();
    },
    
    createLevel: function() {
        // create 2 big platforms	
        Box2dUtil.createBox(this.world, 3, 230, 60, 180, true, 'ground');
        Box2dUtil.createBox(this.world, 560, 360, 50, 50, true, 'ground');
        
        // create small platforms
        for (var i = 0; i < 5; i++){
            Box2dUtil.createBox(this.world, 150+(80*i), 360, 5, 40+(i*15), true, 'ground');	
        }
    },

    update: function(game) {
        if(!game.isPaused) {
            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].update(game);
            }

            this.world.Step(TIME_STEP, 1);
        }
    },

    draw: function(game) {
        if(!game.isPaused) {
            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].draw(game);
            }
            
            Box2dUtil.drawWorld(this.world, game.context);
        }
    }
};