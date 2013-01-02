var Player = function(scene, x, y, width, height) {
    var _this = this;
    this.scene = scene;
	this.x = x;
	this.y = y;
    this.z = 0;
	this.width = width;
	this.height = height;
	this.velocityX = 0;
	this.velocityY = 0;
	this.angle = 0;
	this.maxJumpDist = 12;
	this.jumpDist = 0;
    this.timeDead = 100;
	this.lastY = y;
	this.lastX = x;
    this.DEBUG = {};
    
    // Animations 
    this.animation = {
        standing: new Animation(this.width * 12, 0, this.width, this.height, 1, 1, 0),
        walking: new Animation(0, 0, this.width, this.height, 12, 10, 0),
        running: new Animation(0, this.height, this.width, this.height, 4, 5, 0),
        jumping: new Animation(this.width * 4, this.height, this.width, this.height, 4, 5, 0)
    };
	
	// States
	this.isJumping = false;
	this.isFalling = false;
    this.isOnGround = false;
    this.isOnSolidGround = false;
	this.isAlive = false;
	this.isFacingForwards = true;
    
    // Start jumping
	this.scene.inputManager.addKeyEvent(KeyAction.jump, function() {
		if(_this.isOnGround) {
            _this.isJumping = true;
        }
	});
};

// Load content
Player.prototype.loadContent = function(resourceManager) {
    resourceManager.load("images/sonic.png?" + (new Date()).getTime(), "player1", ResourceType.image);
};

// Adds velocity to the player
Player.prototype.addVelocity = function(x, y) {
	this.velocityX += x;
	this.velocityY += y;
};

Player.prototype.update = function() {
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
			
		// Jump
        if(this.isJumping) {
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
        }
	}

	this.y += 7.5; // gravity

    // Pull the player down if on a slope
    if(this.isOnGround) {
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
    }
    
    // Add velocity to position
	this.x += this.velocityX;
	this.y += this.velocityY;
	
	// Decay velocity
	this.velocityX *= 0.93;
	this.velocityY *= 0.90;

	// Collision point
	var adjX = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.x;
	var adjY = ((this.width / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + (this.y + 2); // 2px padding for stroke width
    
	// Finds the line the player is going to collide with
	var playerPos = adjX / /*levelPrefs.width*/30 >> 0;
	
	// Collide with tiles
    var tile0 = this.scene.tiles[playerPos - 1];
    var tile1 = this.scene.tiles[playerPos];
    var tile2 = this.scene.tiles[playerPos + 1];
    
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
            if(this.scene.inputManager.isKeyDown(KeyAction.down) && tile1.type == TileType.passthrough) {
                this.isFalling = true;
            } else {
                this.y = col + (this.y - adjY);
                this.isFalling = false;
                this.isOnSolidGround = (tile1.type == TileType.solid || tile1.type == TileType.oneway) && this.isOnGround;
            }
        }
    } else {
        if(!this.isJumping) {
            this.isFalling = true;
        }
        
        // Collide with left tile's y
        if(tile0.type != TileType.air
        && this.lastY < tile0.y2 && adjY > tile0.y2 
        && adjX - this.width / 2 < tile0.x2) {
            if(this.scene.inputManager.isKeyDown(KeyAction.down) && tile0.type == TileType.passthrough) {
                this.isFalling = true;
            } else {
                this.y = (tile0.y2 * 1) + (this.y - adjY);
                this.isFalling = false;
                this.isOnSolidGround = (tile0.type == TileType.solid || tile0.type == TileType.oneway) && this.isOnGround;
            }
        }
        
        // Collide with right tile's y
        if(tile2.type != TileType.air 
        && this.lastY < tile2.y1 && adjY > tile2.y1 
        && adjX + this.width / 2 > tile2.x1) {
            if(this.scene.inputManager.isKeyDown(KeyAction.down) && tile2.type == TileType.passthrough) {
                this.isFalling = true;
            } else {
                this.y = (tile2.y1 * 1) + (this.y - adjY);
                this.isFalling = false;
                this.isOnSolidGround = (tile2.type == TileType.solid || tile2.type == TileType.oneway) && this.isOnGround;
            }
        }
    }
    
    // Collide with left tile's x
    if(tile0.type == TileType.solid && adjX - this.width / 2 < tile0.x2 && adjY > tile0.y2) {
        if(this.lastY > tile0.y2) {
            this.x = tile0.x2 + this.width / 2;
        }
        //this.isAlive = false;
    }
    
    // Collide with right tile's x
    if(tile2.type == TileType.solid && adjX + this.width / 2 > tile2.x1 && adjY > tile2.y1) {
        if(this.lastY > tile2.y1) {
            this.x = tile2.x1 - this.width / 2;
        }
        //this.isAlive = false;
    }
 	
	// Find the y direction the player is moving
	var yvel;
	var yfixed = this.y.toFixed(1);
	if(yfixed < this.lastY) yvel = 1;
	if(yfixed > this.lastY) yvel = -1;
	if(yfixed == this.lastY) yvel = 0;
    
	// Apply extra gravity to keep player on slope during downward movement
	// This prevents a bug where the player cannot jump while moving quickly
	// downwards due to being in a "falling" state.
	if(this.angle) {
		if(yvel < 0 && (this.angle < -33 || this.angle > 33) && !this.isJumping) 
			this.y += 2;
	}
	
	// Jumping logic
	if(this.isJumping) {
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
	
	// Die when falling off the edge of the world
	if(adjY > this.scene.renderManager.canvas.height + this.width) {
		this.isAlive = false;
	}
	
	// Collide with left side of level
	if(this.x - (this.width / 2) <= 30) {
		this.x = this.width / 2 + 30;
		this.velocityX = 0;
	}
	
	// Collide with right side of level
	if(this.x + (this.width / 2) >= this.scene.tiles.length * /*levelPrefs.width*/30 - 30) {
		this.x = this.scene.tiles.length * /*levelPrefs.width*/30 - (this.width / 2) - 30;
		this.velocityX = 0;
	}
	
	// Reset when the player dies
	if(!this.isAlive) {
        if(this.timeDead > 100) {
            this.x = /*levelStart.x*/this.scene.renderManager.canvas.width / 2;
            this.y =  /*levelStart.y*/this.scene.tiles[0].y1 - this.height / 2 - 4;
            this.velocityX = 0;
            this.velocityY = 0;
            this.passiveForwardVel = 0;
            this.jumpDist = 0;
            this.isJumping = false;
            this.isFalling = false;
            this.isOnGround = false;
            if(this.timeDead > 125) {
                this.isAlive = true;
                this.timeDead = 0;
            }
        }
        
        this.timeDead++;
	}
	
	this.lastY = this.y.toFixed(1); // last known y position
	this.lastX = this.x.toFixed(1); // last known y position
	
	// Update the camera position
	this.scene.camera.x = this.x - (this.scene.renderManager.canvas.width / 2);
};

Player.prototype.draw = function() {
    if(this.scene.renderManager.wireframes) {
        var x = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.x;
        var y = ((this.width / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + this.y;
        this.scene.renderManager.drawLine(this.x - this.scene.camera.x, this.y, x - this.scene.camera.x, y, "#a7c6e0", 2);
        //renderManager.drawRectangle((this.x - this.width / 2) - camera.x, this.y - this.height / 2, this.width, this.height, "#114A93", 2, "transparent");
        this.scene.renderManager.drawCircle(this.x - this.scene.camera.x, this.y, this.width / 2, this.isFalling ? "red" : "#218ae0", 2, "transparent");
    } else {
		// Calculate the animation speed
        var speed = 0;
		speed = ((this.velocityX < 0 ? this.velocityX * -1 : this.velocityX) / 8);
		if(speed > 1.0) { speed = 1.0; }
		
        if(this.isOnGround && (this.velocityX > 0.1 || this.velocityX < -0.1)) {
			// Walking and running
			if(speed > 10) {
				this.animation.running.play(this.scene.renderManager, this.scene.resourceManager.images["player1"], this.x - this.scene.camera.x - this.width / 2, this.y - this.height / 2, 0, 1.0);
			} else {
				this.animation.walking.play(this.scene.renderManager, this.scene.resourceManager.images["player1"], this.x - this.scene.camera.x - this.width / 2, this.y - this.height / 2, 0, speed);
			}
        } else if(this.isOnGround) {
			// Standing
            this.animation.standing.play(this.scene.renderManager, this.scene.resourceManager.images["player1"], this.x - this.scene.camera.x - this.width / 2, this.y - this.height / 2, 0, 1.0);
        } else if (this.isJumping || this.isFalling) {
			// Jumping
            this.animation.jumping.play(this.scene.renderManager, this.scene.resourceManager.images["player1"], this.x - this.scene.camera.x - this.width / 2, this.y - this.height / 2, 0, 1.0);
        }
    }
};