function Player() {
    this.velocityX = 0;
    this.velocityY = 0;
    this.speedX = 20;
    
    this.ballSd;
    this.ballBd;
    this.object = null;
    
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

        this.ballSd = new b2CircleDef();
        this.ballSd.density = 0.5;
        this.ballSd.radius = 30;
        this.ballSd.restitution = 0.1;
        this.ballSd.friction = 5;
        this.ballSd.userData = 'player';
        
        this.ballBd = new b2BodyDef();
        this.ballBd.linearDamping = .03;
        this.ballBd.allowSleep = false;
        this.ballBd.AddShape(this.ballSd);
        this.ballBd.position.Set(512, 384);
        
        this.object = game.scene.world.CreateBody(this.ballBd);
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
        this.velocityY *= this.velocityY > -100 ? 0.99 : 0.98;
        
        // Collide
        var collision = game.scene.world.m_contactList;
        this.canJump = false;
        if (collision != null) {
            if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player') {
                if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')) {
                    var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
                    var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
                    if (playerObj.y < groundObj.y){
                        this.canJump = true;
                    }
                }
            }
        }
        
        // Get current velocity
        var vel = this.object.GetLinearVelocity();
        
        // Jump
        if (game.isKeyDown(Key.upArrow)) {
            //if(this.velocityY > -100) { this.velocityY = -100; }
            vel.y = this.velocityY;
        }
        else if (this.canJump) {
            this.velocityY = -500;
        }
        
        // Move left and right
        if (game.isKeyDown(Key.leftArrow)) {
            var speed = !this.canJump ? this.speedX / 2 : this.speedX;
            this.velocityX -= speed;
        }
        else if (game.isKeyDown(Key.rightArrow)) {
            var speed = !this.canJump ? this.speedX / 2 : this.speedX;
            this.velocityX += speed;
        }
        
        vel.x = this.velocityX;
        this.object.SetLinearVelocity(vel);
    
        // Kill player
        if (this.object.GetCenterPosition().y > game.canvas.height) {
            this.object.SetCenterPosition(new b2Vec2(20, 20), 0);
        }
    },

    draw: function(game) {
        var camera = game.scene.camera;
        var renderManager = game.renderManager;
        /*var pos = this.circleBody.GetCenterPosition();
        renderManager.drawCircle(pos.x, pos.y, this.circleSd.radius, game.shades.medium, 2, "transparent");*/
    }
}