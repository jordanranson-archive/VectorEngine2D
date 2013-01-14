var Player = function(scene, x, y, width, height, drawingWidth, drawingHeight) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.width = width;
    this.height = height;
    this.drawingWidth = drawingWidth;
    this.drawingHeight = drawingHeight;
    this.velocityX = 0;
    this.velocityY = 0;
    this.angle = 0;
    this.maxJumpDist = 12;
    this.jumpDist = 0;
    this.timeDead = 100;
    this.lastX = x - 1;
    this.lastY = y - 1;
    this.tempX = 0;
    this.tempY = 0;
    this.DEBUG = {};
    
    // Animations 
    this.animation = {
        standing:    new Animation(this.drawingWidth * 12, 0,           this.drawingWidth, this.drawingHeight, 1, 1, 0),
        walking:     new Animation(0,               0,           this.drawingWidth, this.drawingHeight, 12, 10, 0),
        running:     new Animation(0,               this.drawingHeight, this.drawingWidth, this.drawingHeight, 4, 5, 0),
        jumping:     new Animation(this.drawingWidth * 4,  this.drawingHeight, this.drawingWidth, this.drawingHeight, 4, 5, 0)
    };
    
    // States
    this.isJumping = false;
    this.isFalling = false;
    this.isOnGround = false;
    this.isOnSolidGround = false;
    this.isAlive = false;
    this.isFacingForwards = true;
};

// Initialization
Player.prototype.init = function() {
    var _this = this;
    
    // Start jumping
    this.scene.inputManager.addKeyEvent(KeyAction.jump, function() {
        if(_this.isOnGround && _this.isAlive) {
            _this.isJumping = true;
            //_this.scene.resourceManager.audio["jump"].play();
        }
    });
};

// Load content
Player.prototype.loadContent = function() {
    var timestamp = new Date().getTime();
    this.scene.resourceManager.load("images/sonic.png?" + timestamp, "player1", ResourceType.image);
    this.scene.resourceManager.load("sounds/jump.wav?" + timestamp, "jump", ResourceType.audio);
};

// Adds velocity to the player
Player.prototype.addVelocity = function(x, y) {
    this.velocityX += x;
    this.velocityY += y;
};

Player.prototype.collide = function() {

};

Player.prototype.update = function() {
    this.tempX = this.x;
    this.tempY = this.y;

    // Is player on the ground
    this.isOnGround = !this.isFalling && !this.isJumping;
    
    if(this.isAlive) {
        // Accelerate
        if(this.scene.inputManager.isKeyDown(KeyAction.forward)) {
            this.addVelocity(0.65, 0);
            this.isFacingForwards = true;
        }
        
        // Brake
        if(this.scene.inputManager.isKeyDown(KeyAction.backward)) {
            this.addVelocity(-0.65, 0);
            this.isFacingForwards = false;
        }
    }
    
    // Decay velocity
    this.velocityX *= 0.93;
    this.velocityY *= 0.90;
        
    // Add velocity to position
    this.tempX += this.velocityX;
    this.tempY += this.velocityY + 7.5; // gravity
    
    // Jumping logic
    if(this.isJumping && this.isAlive) {
        if(this.scene.inputManager.isKeyDown(KeyAction.jump)) {
            if(!this.isFalling) {
                this.isJumping = true;
            }
        // Stop jumping
        } else {
            if(this.isJumping) {
                this.isJumping = false;
                jumpDist = 0;
            }
        }
        var jumpVel = -18;
        this.jumpDist += 1;
        
        // Finished jumping
        if(this.jumpDist > this.maxJumpDist) {
            this.isJumping = false;
            this.isFalling = true;
            this.jumpDist = 0;
        } else {
            this.velocityY = jumpVel;
        }    
    } else {
        this.jumpDist = 0;
    }
    
    // Reset when the player dies
    if(!this.isAlive) {
        if(this.timeDead > 100) {
            this.tempX = this.scene.renderManager.canvas.width / 2;
            this.tempY = 0;
            this.velocityX = 0;
            this.velocityY = 0;
            this.passiveForwardVel = 0;
            this.jumpDist = 0;
            this.isJumping = false;
            this.isFalling = false;
            this.isOnGround = false;
            this.isFacingForward = true;
            this.isAlive = true;
            this.timeDead = 0;
        }
        
        this.timeDead++;
    }

    this.x = this.tempX;
    this.y = this.tempY;
    this.lastX = this.x; // last known x position
    this.lastY = this.y; // last known y position
    
    // Update the camera position
    this.scene.camera.x = this.x - (this.scene.renderManager.canvas.width / 2);
};

Player.prototype.draw = function() {
    var renderManager = this.scene.renderManager;
    var images = this.scene.resourceManager.images;
    var sounds = this.scene.resourceManager.sounds;
    var spriteX = this.x - this.scene.camera.x;
    var spriteY = this.y - (this.drawingHeight - this.height) / 2 + 3;

    if(renderManager.wireframes) {
        var x = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.x;
        var y = ((this.height / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + this.y;
        
        renderManager.drawRectangle(spriteX - this.width / 2, this.y - this.height / 2, this.width, this.height, "transparent", 0, "#218ae0");
        //renderManager.drawCircle(this.x - this.scene.camera.x, this.y, this.height / 2, "#218ae0", 2, "transparent");
        //renderManager.drawCircle(this.DEBUG.adjX - this.scene.camera.x, this.DEBUG.adjY, 2, "transparent", 0, "magenta");
    } else {
        // Calculate the animation speed
        var speed = 0;
        speed = ((this.velocityX < 0 ? this.velocityX * -1 : this.velocityX) / 9.5);
        if(speed > 1.0) { speed = 1.0; }
        
        if(this.isOnGround && (this.velocityX > 0.1 || this.velocityX < -0.1)) {
            // Walking and running
            if(speed > 0.9) {
                this.animation.running.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, 0, 1.0);
            } else {
                this.animation.walking.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, 0, speed);
            }
        } else if(this.isOnGround) {
            // Standing
            this.animation.standing.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, 0, 1.0);
        } else if (this.isJumping || this.isFalling) {
            // Jumping
            this.animation.jumping.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - 10 - this.drawingHeight / 2, 0, 1.0);
        }
    }
};