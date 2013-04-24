function Player() {
    this.velocityX = 0;
    this.velocityY = 0;
    this.speedX = 1;
    
    this.body;
    
	this.canJump = false;
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
        
        var fixDef = new B2.b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
     
        var bodyDef = new B2.b2BodyDef;
      
        bodyDef.type = B2.b2Body.b2_dynamicBody;
        fixDef.shape = new B2.b2CircleShape(0.6);
        
        bodyDef.position.x = Math.random() * 25;
        bodyDef.position.y = Math.random() * 10;
        this.body = game.scene.world.CreateBody(bodyDef)
        this.body.CreateFixture(fixDef);
    },

    // Remove events, unload game content, etc
    unload: function() {
        
    },
    
    setPosition: function(x, y) {

    },
    
    addVelocity: function(x, y) {
        this.velocityX += x;
        this.velocityY += y;
    },

    update: function(game) {
        // Decay speed
        this.velocityX *= 0.95;
        this.velocityY *= this.velocityY > -100 ? 0.995 : 0.98;
        
        // Collide
        this.canJump = false;
        
        // Get current velocity
        
        // Jump
        if (game.isKeyDown(Key.upArrow) && this.velocityY < -50) {
        }
        else if (this.canJump) {

        }
        
        // Move left and right
        if (game.isKeyDown(Key.leftArrow)) {
            var speed = !this.canJump ? this.speedX * 0.67 : this.speedX;
            this.velocityX -= speed;
        }
        else if (game.isKeyDown(Key.rightArrow)) {
            var speed = !this.canJump ? this.speedX * 0.67 : this.speedX;
            this.velocityX += speed;
        }
        
        var vel = this.body.GetLinearVelocity();
        vel.x = this.velocityX;
        this.body.SetLinearVelocity(vel);
    
        // Kill player
    },

    draw: function(game) {
        var camera = game.scene.camera;
        var renderManager = game.renderManager;
        /*var pos = this.circleBody.GetCenterPosition();
        renderManager.drawCircle(pos.x, pos.y, this.circleSd.radius, game.shades.medium, 2, "transparent");*/
    }
}