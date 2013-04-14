function Player() {
    this.x;
    this.y;
    this.circleSd;
    this.circleBd;
    this.circleBody;
}

Player.prototype = {
    // Loads all the content needed at run-time
    loadContent: function(resourceManager) {
        var _this = this;
        var timestamp = new Date().getTime();
        
        /* Load content here */
        
    },

    // Bind events and set values
    init: function(game) {
        var _this = this;
        
        this.circleSd = new b2CircleDef();
        this.circleSd.density = 1.0;
        this.circleSd.radius = 20;
        this.circleSd.restitution = 1.0;
        this.circleSd.friction = 0;
        
        this.circleBd = new b2BodyDef();
        this.circleBd.AddShape(this.circleSd);
        this.circleBd.position.Set(this.x, this.y);
        
        this.circleBody = game.scene.world.CreateBody(this.circleBd);
    },

    // Remove events, unload game content, etc
    unload: function() {
        
    },
    
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },

    update: function(game) {
        
    },

    draw: function(game) {
        var camera = game.scene.camera;
        var renderManager = game.renderManager;
        var pos = this.circleBody.GetCenterPosition();
        renderManager.drawCircle(pos.x, pos.y, this.circleSd.radius, game.shades.medium, 2, "transparent");
    }
}