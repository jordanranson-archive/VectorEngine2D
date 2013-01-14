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

Player.prototype.collide = function(adjX, adjY, tileLayer) {
    var tileWidth = this.scene.levelPrefs.tileWidth;
    
    // Finds the line the player is going to collide with
    var playerPos = adjX / tileWidth >> 0;
    
    // Collide with tiles[0]
    var tile0 = this.scene.tiles[tileLayer][playerPos - 1];
    var tile1 = this.scene.tiles[tileLayer][playerPos];
    var tile2 = this.scene.tiles[tileLayer][playerPos + 1];
    
    var run = tile1.x2 - tile1.x1;
    var rise = tile1.y2 - tile1.y1;
    var slope = rise / run;
    var intersect = tile1.y1 - (tile1.x1 * slope);
    var col = (slope * adjX) + intersect;
    
    var angle = Util.radToDeg(Math.atan(rise / run));
    this.angle = angle;
    
    // Collide with current tile's y
    if(adjY > col && tile1.type != TileType.air) {
        if(this.lastY < col) {
            this.tempY = col + (this.tempY - adjY);
            adjY = col;
            this.isFalling = false;
            this.isOnSolidGround = (tile1.type == TileType.solid || tile1.type == TileType.oneway) && this.isOnGround;
        }
    } else {
        if(!this.isJumping) {
            this.isFalling = true;
        }
        
        // Collide with left tile's y
        if(tile0.type != TileType.air
        && adjY >= tile0.y2 
        && adjX - this.width / 2 < tile0.x2) {
            this.tempY = (tile0.y2 * 1) + (this.tempY - adjY);
            adjY = tile0.y2;
            this.isFalling = false;
            this.isOnSolidGround = (tile0.type == TileType.solid || tile0.type == TileType.oneway) && this.isOnGround;
        }
        
        // Collide with right tile's y
        if(tile2.type != TileType.air 
        && adjY >= tile2.y1 
        && adjX + this.width / 2 > tile2.x1) {
            this.tempY = (tile2.y1 * 1) + (this.tempY - adjY);
            adjY = tile2.y1;
            this.isFalling = false;
            this.isOnSolidGround = (tile2.type == TileType.solid || tile2.type == TileType.oneway) && this.isOnGround;
        }
    }
    
    // Collide with left tile's x
    if(tile0.type == TileType.solid && adjX - this.width / 2 < tile0.x2 && adjY > tile0.y2) {
        if(adjY > tile0.y2) {
            this.tempX = tile0.x2 + this.width / 2;
            this.velocityX = 0;
        }
        //this.isAlive = false;
    }
    
    // Collide with right tile's x
    if(tile2.type == TileType.solid && adjX + this.width / 2 > tile2.x1 && adjY > tile2.y1) {
        if(adjY > tile2.y1) {
            this.tempX = tile2.x1 - this.width / 2;
            this.velocityX = 0;
        }
        //this.isAlive = false;
    }
    
    // Die when falling off the edge of the world
    if(adjY > this.scene.renderManager.canvas.height + this.height) {
        this.isAlive = false;
    }
    
    // Collide with left side of level
    if(this.tempX - (this.width / 2) <= tileWidth) {
        this.tempX = this.width / 2 + tileWidth;
        this.velocityX = 0;
    }
    
    // Collide with right side of level
    if(this.tempX + (this.width / 2) >= this.scene.tiles[0].length * tileWidth - tileWidth) {
        this.tempX = this.scene.tiles[0].length * tileWidth - (this.width / 2) - tileWidth;
        this.velocityX = 0;
    }
    
    this.DEBUG.col = col;
    this.DEBUG.adjY = adjY;
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

    // Pull the player down if on a slope
    /*if(this.isOnGround) {
        var pullVel = 0.2;
        if(this.angle > 0 && this.angle <= 45) {
            var vel = this.angle / 45 * pullVel;
            if(vel > pullVel) { vel = pullVel; }
            if(vel < 0) { vel = 0; }
            this.velocityX += vel;
        }
        if(this.angle < 0 && this.angle >= -45) {
            var vel = (this.angle * -1) / 45 * pullVel;
            if(vel > pullVel) { vel = pullVel; }
            if(vel < 0) { vel = 0; }
            this.velocityX -= vel;
        }
    }*/
    
    // Decay velocity
    this.velocityX *= 0.93;
    this.velocityY *= 0.90;
        
    // Add velocity to position
    this.tempX += this.velocityX;
    this.tempY += this.velocityY + 7.5; // gravity
     
    // Find the y direction the player is moving
    var yvel;
    var yfixed = this.tempY.toFixed(1);
    if(yfixed < this.lastY) yvel = 1;
    if(yfixed > this.lastY) yvel = -1;
    if(yfixed == this.lastY) yvel = 0;
    
    // Apply extra gravity to keep player on slope during downward movement
    // This prevents a bug where the player cannot jump while moving quickly
    // downwards due to being in a "falling" state.
    if(this.angle) {
        if(yvel < 0 && (this.angle < -33 || this.angle > 33) && !this.isJumping) 
            this.tempY += 2;
    }
    
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
            this.tempY = this.scene.tiles[0][0].y1 - this.height / 2;
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
    
    // Collision point
    var adjX = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.tempX;
    var adjY = ((this.height / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + this.tempY;

    // Collide with tiles
    for(var i = this.scene.tiles.length - 1; i >= 0; i--) { 
        this.collide(adjX, adjY, i);
    }
    
    this.DEBUG.adjX = adjX;
    //this.DEBUG.adjY = adjY;

    this.x = this.tempX;
    this.y = this.tempY;
    this.lastX = this.x.toFixed(1); // last known x position
    this.lastY = this.y.toFixed(1); // last known y position
    
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
        
        // Angle
        renderManager.drawLine(spriteX, this.y, x - this.scene.camera.x, y, "#a7c6e0", 2);
        
        // Drawing box
        //renderManager.drawRectangle(spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, this.drawingWidth, this.drawingHeight, "#218ae0", 2, "transparent");
        
        // Bounding box
        renderManager.drawRectangle(spriteX - this.width / 2, this.y - this.height / 2, this.width, this.height, "#218ae0", 0.5, "transparent");
        
        // Bounding circle
        renderManager.drawCircle(this.x - this.scene.camera.x, this.y, this.height / 2, "#218ae0", 2, "transparent");

        // Adjusted Y position (collision point)
        renderManager.drawCircle(this.DEBUG.adjX - this.scene.camera.x, this.DEBUG.adjY, 2, "transparent", 0, "magenta");
        renderManager.drawCircle(x - this.scene.camera.x, this.DEBUG.col, 3, "cyan", 1, "transparent");
        
        // True center
        renderManager.drawCircle(this.x - this.scene.camera.x, this.lastY, 2, "transparent", 0, "#218ae0");
        renderManager.drawCircle(this.DEBUG.adjX - this.scene.camera.x, this.lastAdjY, 2, "transparent", 0, "yellow");
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