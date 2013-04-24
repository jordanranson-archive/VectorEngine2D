function Player() {
    this.velocityX = 0;
    this.velocityY = 0;
    this.speedX = 0.35;
    
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
        fixDef.density = 1.5;
        fixDef.friction = 1.0;
        fixDef.restitution = 0;
        fixDef.userData = "player";
     
        var bodyDef = new B2.b2BodyDef;
        bodyDef.allowSleep = false;
        bodyDef.type = B2.b2Body.b2_dynamicBody;
        
        fixDef.shape = new B2.b2CircleShape(0.6);
        
        
        bodyDef.position.x = (game.renderManager.canvas.width / SCALE) / 2;
        bodyDef.position.y = (game.renderManager.canvas.height / SCALE) / 3;
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
        this.velocityY *= 0.95;
        
        // Collide
        var collision = game.scene.world.m_contactList;
        if (collision != null) {
            if (collision.GetFixtureA().GetUserData() == "player" || collision.GetFixtureB().GetUserData() == "player") {
                if ((collision.GetFixtureA().GetUserData() == "ground" || collision.GetFixtureB().GetUserData() == "ground")) {
                    var playerObj = (collision.GetFixtureA().GetUserData() == "player" ? 
                        collision.GetFixtureA().GetBody().GetPosition() : 
                        collision.GetFixtureB().GetBody().GetPosition()
                    );
                    var groundObj = (collision.GetFixtureA().GetUserData() == "ground" ? 
                        collision.GetFixtureA().GetBody().GetPosition() : 
                        collision.GetFixtureB().GetBody().GetPosition()
                    );
                    if (playerObj.y < groundObj.y){
                        this.canJump = true;
                        console.log("TEST");
                    }
                }
            }
        }

        // Get current velocity
        var vel = this.body.GetLinearVelocity();
        
        // Jump
        if (game.isKeyDown(Key.upArrow) && this.canJump) {
            this.velocityY = -10;
            vel.y = this.velocityY;
            this.canJump = false;
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