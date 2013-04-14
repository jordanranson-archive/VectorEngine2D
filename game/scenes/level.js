Level = function() {
    this.camera;
    this.players = [];
    this.gameObjects = [];
    
    this.worldAABB;
    this.world;
    this.gravity;
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
        this.worldAABB = new b2AABB();
        this.worldAABB.minVertex.Set(0, 0);
        this.worldAABB.maxVertex.Set(game.canvas.width, game.canvas.height);
        this.gravity = new b2Vec2(0, 300);
        this.world = new b2World(this.worldAABB, this.gravity, true); 
        
        // Add the camera
        this.camera = new Camera();
        
        // Add player
        var player = new Player();
        this.gameObjects.push(player);
        this.players.push(player);
        
        // Add ground shape
        var ground = new Shape();
        ground.setPoints([[25, 525], [999, 525], [999, 743], [25, 743], [25, 525]]);
        this.gameObjects.push(ground);
        
        // Initialize all the game objects
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].init(game);
        }
        
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

    update: function(game) {
        if(!game.isPaused) {
            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].update(game);
            }
            this.world.Step(1.0/60, 1);
        }
    },

    draw: function(game) {
        if(!game.isPaused) {
            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].draw(game);
            }
        }
    }
};