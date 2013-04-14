function Player() {
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
        this.ballSd.density = 0.1;
        this.ballSd.radius = 20;
        this.ballSd.restitution = 0.1;
        this.ballSd.friction = 2;
        this.ballSd.userData = 'player';
        
        this.ballBd = new b2BodyDef();
        this.ballBd.linearDamping = .03;
        this.ballBd.allowSleep = false;
        this.ballBd.AddShape(this.ballSd);
        this.ballBd.position.Set(20, 20);
        
        this.object = game.scene.world.CreateBody(this.ballBd);
    },

    // Remove events, unload game content, etc
    unload: function() {
        
    },
    
    setPosition: function(x, y) {

    },

    update: function(game) {
        // up
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
        var vel = this.object.GetLinearVelocity();
        if (game.isKeyDown(Key.upArrow) && this.canJump) {
            vel.y = -300;	
        }
        
        // left/right
        if (game.isKeyDown(Key.leftArrow)) {
            vel.x = -120;
        }
        else if (game.isKeyDown(Key.rightArrow)) {
            vel.x = 120;
        }
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