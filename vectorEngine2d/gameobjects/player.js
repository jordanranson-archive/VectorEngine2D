var Player = function(scene, x, y, width, height, drawingWidth, drawingHeight) {
    // Constants
    this._maxJumpDist = 8;
    this._forwardVelocity = 0.35;
    this._climbSpeed = 1.0;

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
    this.lastX = x - 1;
    this.lastY = y - 1;
    this.tempX = 0;
    this.tempY = 0;
    this.timeJumping = 0;
    this.timeDead = 100;
    this.timeClimbing = 0;
    
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
    this.isOnSolidGround = false;
    this.isAlive = false;
    this.isFacingForwards = true;
    this.isClimbing = false;
};

// Initialization
Player.prototype.init = function() {
    var _this = this;
    
    // Start jumping
    this.scene.inputManager.addKeyEvent(KeyAction.jump, function() {
        if(!_this.isFalling && !_this.isJumping && _this.isAlive && !_this.isClimbing) {
            _this.isJumping = true;
        }
    });
    this.scene.inputManager.addKeyEvent(Key.q, function() {
        _this.isClimbing = false;
    });
    this.scene.inputManager.addKeyEvent(Key.w, function() {
        _this.isClimbing = true;
    });
};

// Load content
Player.prototype.loadContent = function() {
    var timestamp = new Date().getTime();
    //this.scene.resourceManager.load("images/sonic.png?" + timestamp, "player1", ResourceType.image);
};

// Adds velocity to the player
Player.prototype.addVelocity = function(x, y) {
    this.velocityX += x;
    this.velocityY += y;
};

Player.prototype.collide = function() {
    var posX = Number((this.x / 16).toFixed());
    var posY = Number((this.y / 16).toFixed());
    var tile = [];
    
    // Bottom of level boundry
    if(this.tempY >= this.scene.levelHeight * 16) {
        this.isAlive = false;
        this.isFalling = true;
        console.log("WHY");
    }
    
    // Tiles exist
    if(this.scene.tiles[posY] && this.scene.tiles[posY][posX]) {
        /*
        Tile Layout
        6 5 4
        7   3
        8   2
        9 0 1
        */
        
        tile[0] = this.scene.tiles[posY][posX];
        tile[1] = this.scene.tiles[posY][posX+1];
        tile[2] = this.scene.tiles[posY-1][posX+1];
        tile[3] = this.scene.tiles[posY-2][posX+1];
        tile[4] = this.scene.tiles[posY-3][posX+1];
        tile[5] = this.scene.tiles[posY-3][posX];
        tile[6] = this.scene.tiles[posY-3][posX-1];
        tile[7] = this.scene.tiles[posY-2][posX-1];
        tile[8] = this.scene.tiles[posY-1][posX-1];
        tile[9] = this.scene.tiles[posY][posX-1];
        tile[10] = this.scene.tiles[posY-1][posX];
        this.DEBUG.tile = tile;
        this.scene.tiles[posY][posX].data.isColliding = true;

        if(tile[0].data.points.length > 0) {
            var adjX = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.tempX + (this.width / 2);
            var adjY = ((this.height / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + this.tempY;
            this.DEBUG.adjX = adjX;
            this.DEBUG.adjY = adjY;
            
            var run = tile[0].data.points[1].x - tile[0].data.points[0].x;
            var rise = tile[0].data.points[1].y - tile[0].data.points[0].y;
            var slope = rise / run;
            var intersect = tile[0].data.points[0].y - (tile[0].data.points[0].x * slope);
            var col = (slope * adjX) + intersect;
            
            var angle = Util.radToDeg(Math.atan(rise / run));
            this.angle = angle;
            
            console.log(tile[0].data);
        }
        
        // Collide right
        if(this.lastX < this.tempX) {
            if((this.tempX + this.width > tile[2].x && tile[2].type === TileType.solid)
            || (this.tempX + this.width > tile[3].x && tile[3].type === TileType.solid)
            || (!this.isClimbing && this.tempY - 6               > tile[1].y                  && this.tempX + this.width > tile[1].x && tile[1].type === TileType.solid)
            || (this.isClimbing  && this.tempY - 2               > tile[1].y                  && this.tempX + this.width > tile[1].x && tile[1].type === TileType.solid)
            || (!this.isClimbing && this.tempY - this.height + 6 < tile[4].y + tile[4].height && this.tempX + this.width > tile[4].x && tile[4].type === TileType.solid)
            || (this.isClimbing  && this.tempY - this.height + 2 < tile[4].y + tile[4].height && this.tempX + this.width > tile[4].x && tile[4].type === TileType.solid)) {
                this.tempX = tile[2].x - this.width;
                this.velocityX = 0;
                this.velocityY *= 0.97;
            }
        }
        
        // Collide left
        if(this.lastX > this.tempX) {
            if((this.tempX < tile[8].x + this.width && tile[8].type === TileType.solid)
            || (this.tempX < tile[7].x + this.width && tile[7].type === TileType.solid)
            || (!this.isClimbing && this.tempY - 6               > tile[9].y                  && this.tempX < tile[9].x + tile[9].width && tile[9].type === TileType.solid)
            || (this.isClimbing  && this.tempY - 2               > tile[9].y                  && this.tempX < tile[9].x + tile[9].width && tile[9].type === TileType.solid)
            || (!this.isClimbing && this.tempY - this.height + 6 < tile[6].y + tile[6].height && this.tempX < tile[6].x + tile[6].width && tile[6].type === TileType.solid)
            || (this.isClimbing  && this.tempY - this.height + 2 < tile[6].y + tile[6].height && this.tempX < tile[6].x + tile[6].width && tile[6].type === TileType.solid)) {
                this.tempX = tile[8].x + this.width;
                this.velocityX = 0;
                this.velocityY *= 0.97;
            }
        }
        
        // Collide with right level boundry
        if(this.lastX < this.tempX && this.tempX + this.width + tile[0].width > this.scene.levelLength * tile[0].width) {
            this.tempX = this.scene.levelLength * tile[0].width - tile[0].width - this.width;
            this.velocityX = 0;
        }
        
        // Collide with left level boundry
        if(this.lastX > this.tempX && this.tempX - tile[0].width < 0) {
            this.tempX = tile[0].width;
            this.velocityX = 0;
        }
        
        // Collide down
        if(this.lastY <= this.tempY) {
            // Normal downwards collision
            if(this.tempY >= tile[0].y && tile[0].type === TileType.solid) {
                this.tempY = tile[0].y;
                this.isFalling = false;
            } else if(this.lastY <= tile[0].y && this.tempY >= tile[0].y && (tile[0].type === TileType.platform || tile[0].type === TileType.ladder)) {
                // Platforms
                if(tile[0].type === TileType.platform) {
                    this.tempY = tile[0].y;
                    this.isFalling = false;
                }
                // Ladders
                if(tile[0].type === TileType.ladder && tile[10].type === TileType.air) {
                    if(!this.isClimbing && this.scene.inputManager.isKeyDown(KeyAction.down) 
                    && (this.tempX + this.width < tile[1].x || (tile[1].type === TileType.air || tile[1].type === TileType.ladder)) // right tile
                    && (this.tempX > tile[0].x || (tile[9].type === TileType.air || tile[9].type === TileType.ladder))) { // left tile
                        this.isClimbing = true;
                        this.velocityX = 0;
                        this.velocityY = 0;
                        this.tempY = tile[0].y;
                    } else {
                        if(!this.isClimbing) {
                            this.tempY = tile[0].y;
                            this.isFalling = false;
                        }
                    }
                }
            
            // Collide with the bottom right tile when moving left
            } else if(this.tempY >= tile[1].y && this.tempX > tile[0].x && this.lastX > this.tempX && tile[1].type === TileType.solid) {
                this.tempY = tile[1].y;
                this.isFalling = false;
            } else if(this.lastY <= tile[1].y && this.tempY >= tile[1].y && this.tempX > tile[0].x && this.lastX > this.tempX 
            && (tile[1].type === TileType.platform || tile[1].type === TileType.ladder)) {
                // Platforms
                if(tile[1].type === TileType.platform) {
                    this.tempY = tile[1].y;
                    this.isFalling = false;
                }
                // Ladders
                if(tile[1].type === TileType.ladder && tile[10].type === TileType.air) {
                    if(!this.isClimbing && this.scene.inputManager.isKeyDown(KeyAction.down) 
                    && ((tile[0].type === TileType.air || tile[0].type === TileType.ladder))) {
                        this.isClimbing = true;
                        this.velocityX = 0;
                        this.velocityY = 0;
                        this.tempY = tile[1].y;
                    } else {
                        if(!this.isClimbing) {
                            this.tempY = tile[1].y;
                            this.isFalling = false;
                        }
                    }
                }
            
            // Collide with the bottom left tile when moving right            
            } else if(this.tempY >= tile[9].y && this.tempX < tile[0].x && this.lastX < this.tempX && tile[9].type === TileType.solid) {
                this.tempY = tile[9].y;
                this.isFalling = false;
            } else if(this.lastY <= tile[9].y && this.tempY >= tile[9].y && this.tempX < tile[0].x && this.lastX < this.tempX 
            && (tile[9].type === TileType.platform || tile[9].type === TileType.ladder)) {
                // Platforms
                if(tile[9].type === TileType.platform) {
                    this.tempY = tile[9].y;
                    this.isFalling = false;
                }
                // Ladders
                if(tile[9].type === TileType.ladder && tile[10].type === TileType.air) {
                    if(!this.isClimbing && this.scene.inputManager.isKeyDown(KeyAction.down) 
                    && (tile[0].type === TileType.air || tile[0].type === TileType.ladder)) {
                        this.isClimbing = true;
                        this.velocityX = 0;
                        this.velocityY = 0;
                        this.tempY = tile[9].y;
                    } else {
                        if(!this.isClimbing) {
                            this.tempY = tile[9].y;
                            this.isFalling = false;
                        }
                    }
                }
                
            // Collide with the bottom right tile when moving right           
            } else if(this.tempY >= tile[1].y && this.tempX > tile[0].x && this.lastX < this.tempX && tile[1].type === TileType.solid) {
                this.tempY = tile[1].y;
                this.isFalling = false;  
            } else if(this.lastY <= tile[1].y && this.tempY >= tile[1].y && this.tempX > tile[0].x && this.lastX < this.tempX 
            && (tile[1].type === TileType.platform || tile[1].type === TileType.ladder)) {
                // Platforms
                if(tile[1].type === TileType.platform) {
                    this.tempY = tile[1].y;
                    this.isFalling = false;
                }
                // Ladders
                if(tile[1].type === TileType.ladder && tile[10].type === TileType.air) {
                    if(!this.isClimbing && this.scene.inputManager.isKeyDown(KeyAction.down) 
                    && (tile[0].type === TileType.air || tile[0].type === TileType.ladder)) {
                        this.isClimbing = true;
                        this.velocityX = 0;
                        this.velocityY = 0;
                        this.tempY = tile[1].y;
                    } else {
                        if(!this.isClimbing) {
                            this.tempY = tile[1].y;
                            this.isFalling = false;
                        }
                    }
                }
                
            // Collide with the bottom left tile when moving left           
            } else if(this.tempY >= tile[9].y && this.tempX < tile[0].x && this.lastX > this.tempX && tile[9].type === TileType.solid) {
                this.tempY = tile[9].y;
                this.isFalling = false;
            } else if(this.lastY <= tile[9].y && this.tempY >= tile[9].y && this.tempX < tile[0].x && this.lastX > this.tempX 
            && (tile[9].type === TileType.platform || tile[9].type === TileType.ladder)) {
                // Platforms
                if(tile[9].type === TileType.platform) {
                    this.tempY = tile[9].y;
                    this.isFalling = false;
                }
                // Ladders
                if(tile[9].type === TileType.ladder && tile[10].type === TileType.air) {
                    if(!this.isClimbing && this.scene.inputManager.isKeyDown(KeyAction.down) 
                    && (tile[0].type === TileType.air || tile[0].type === TileType.ladder)) {
                        this.isClimbing = true;
                        this.velocityX = 0;
                        this.velocityY = 0;
                        this.tempY = tile[9].y;
                    } else {
                        if(!this.isClimbing) {
                            this.tempY = tile[9].y;
                            this.isFalling = false;
                        }
                    }
                }
            
            // Fall
            } else {
                if(!this.isClimbing) { 
                    this.isFalling = true;
                }
            }
        }

        // Try to fall if climbing a ladder
        if(this.isClimbing) {
            var shouldFall = true;
            for(var i = 0; i < tile.length; i++) {
                if(tile[i].type === TileType.ladder) {
                    var left1 = this.tempX;
                    var right1 = this.tempX + this.width;
                    var top1 = this.tempY - this.height;
                    var bottom1 = this.tempY;
                    var left2 = tile[i].x;
                    var right2 = tile[i].x + tile[i].width;
                    var top2 = tile[i].y;
                    var bottom2 = tile[i].y + tile[i].height;
                    if(!(left1 >= right2 || left2 >= right1 || top1 >= bottom2 || top2 >= bottom1)) {
                        shouldFall = false;
                    }
                }
            }
            if(shouldFall && this.timeClimbing > 0) { 
                this.isClimbing = false;
                this.velocityX = 0;
                this.velocityY = 0;
            }
        }
        
        // Collide up
        if(this.lastY > this.tempY) {
            // Top of level boundry
            if(this.tempY - this.height - tile[0].height < 0) {
                this.tempY = this.height + tile[0].height;
                this.isFalling = true;
                this.isJumping = false;
            
            // Normal upwards collision
            } else if(this.tempY - this.height < tile[5].y + tile[5].height && tile[5].type === TileType.solid) {
                this.tempY = tile[5].y + tile[5].height + this.height;
                this.isFalling = true;
                this.isJumping = false;
            
            // Collide with the top right tile when moving left
            } else if(this.tempY - this.height < tile[4].y + tile[4].height 
            && this.tempX > tile[5].x && this.lastX > this.tempX && tile[4].type === TileType.solid) {
                this.tempY = tile[4].y + tile[4].height + this.height;
                this.isFalling = true;
                this.isJumping = false;
            
            // Collide with the top left tile when moving right            
            } else if(this.tempY - this.height < tile[6].y + tile[6].height 
            && this.tempX < tile[5].x && this.lastX < this.tempX && tile[6].type === TileType.solid) {
                this.tempY = tile[6].y + tile[6].height + this.height;
                this.isFalling = true;
                this.isJumping = false;
                
            // Collide with the top right tile when moving right           
            } else if(this.tempY - this.height < tile[4].y + tile[4].height 
            && this.tempX > tile[5].x && this.lastX < this.tempX && tile[4].type === TileType.solid) {
                this.tempY = tile[4].y + tile[4].height + this.height;
                this.isFalling = true;
                this.isJumping = false;    
                
            // Collide with the top left tile when moving left           
            } else if(this.tempY - this.height < tile[6].y + tile[6].height 
            && this.tempX < tile[5].x && this.lastX > this.tempX && tile[6].type === TileType.solid) {
                this.tempY = tile[6].y + tile[6].height + this.height;
                this.isFalling = true;
                this.isJumping = false;
            }
        }
    }
};

Player.prototype.update = function() {
    this.tempX = this.x;
    this.tempY = this.y;
    
    if(this.isAlive) {
        if(this.isClimbing) {
            if(this.scene.inputManager.isKeyDown(KeyAction.forward)) {
                this.addVelocity(this._climbSpeed, 0);
                this.isFacingForwards = true;
            }
            if(this.scene.inputManager.isKeyDown(KeyAction.backward)) {
                this.addVelocity(-this._climbSpeed, 0);
                this.isFacingForwards = false;
            }
            if(this.scene.inputManager.isKeyDown(KeyAction.up)) {
                this.addVelocity(0, -this._climbSpeed);
            }
            if(this.scene.inputManager.isKeyDown(KeyAction.down)) {
                this.addVelocity(0, this._climbSpeed);
            }
        } else {
            if(this.scene.inputManager.isKeyDown(KeyAction.forward)) {
                this.addVelocity(this._forwardVelocity, 0);
                this.isFacingForwards = true;
            }
            if(this.scene.inputManager.isKeyDown(KeyAction.backward)) {
                this.addVelocity(-this._forwardVelocity, 0);
                this.isFacingForwards = false;
            }
        }
    }
    
    // Decay velocity
    if(this.isClimbing) {
        this.velocityX *= 0.65;
        this.velocityY *= 0.65;
    } else {
        this.velocityX *= 0.945;
        this.velocityY *= 0.90;
    }
        
    // Add velocity to position
    this.tempX += this.velocityX;
    this.tempY += this.velocityY + (this.isClimbing ? 0 : 6); // gravity
    
    // Jumping logic
    if(this.isJumping && this.isAlive && !this.isClimbing) {
        if(this.scene.inputManager.isKeyDown(KeyAction.jump)) {
            if(!this.isFalling) {
                this.isJumping = true;
            }
        // Stop jumping
        } else {
            if(this.isJumping) {
                this.isJumping = false;
                this.isFalling = true;
            }
        }
        var jumpVel = -15;
        this.timeJumping++;
        
        // Finished jumping
        if(this.timeJumping > this._maxJumpDist) {
            this.isJumping = false;
            this.isFalling = true;
        } else {
            this.velocityY = jumpVel;
        }    
    } else {
        this.timeJumping = 0;
    }
    
    this.collide();
    
    // Reset when the player dies
    if(!this.isAlive) {
        if(this.timeDead > 100) {
            this.tempX = this.scene.renderManager.canvas.width / 2;
            this.tempY = this.scene.renderManager.canvas.height / 2;
            this.velocityX = 0;
            this.velocityY = 0;
            this.passiveForwardVel = 0;
            this.timeJumping = 0;
            this.isJumping = false;
            this.isFalling = false;
            this.isFacingForward = true;
            this.isAlive = true;
            this.isClimbing = false;
            this.timeDead = 0;
        }
        
        this.timeDead++;
    }
    
    if(this.isClimbing) { this.timeClimbing++; }
    else { this.timeClimbing = 0; }

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
    var spriteY = this.y;

    if(renderManager.wireframes) {
        var x = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.x;
        var y = ((this.height / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + this.y;
        
        //renderManager.drawRectangle(this.x - this.scene.camera.x, this.y - this.height, this.width, this.height, "transparent", 0, this.isJumping ? "lime" : (this.isFalling ? "red" : "#218ae0"));
        renderManager.drawRectangle(this.x - this.scene.camera.x, this.y - this.height, this.width, this.height, "transparent", 0, "#218ae0");
        renderManager.drawCircle(this.x - this.scene.camera.x, this.y, 2, "transparent", 0, "rgba(255,0,255,0.15)");
        renderManager.drawCircle(this.DEBUG.adjX - this.scene.camera.x, this.DEBUG.adjY, 2, "transparent", 0, "rgba(0,255,0,0.15)");
        
        for(var i = 0; i < this.DEBUG.tile.length; i++) {
            renderManager.drawText(this.DEBUG.tile[i].x - this.scene.camera.x + 8, this.DEBUG.tile[i].y + 12, "rgba(255,255,255,0.05)", "7pt sans-serif", "center", i);
            renderManager.drawRectangle(this.DEBUG.tile[i].x - this.scene.camera.x, this.DEBUG.tile[i].y, 16, 16, "rgba(255,255,255,0.05)", 1, "transparent");
        }
        if(this.isClimbing) { renderManager.drawText(0, 10, "red", "14px monospace", "left", "climbing") };
        if(this.isJumping) { renderManager.drawText(0, 20, "red", "14px monospace", "left", "jumping") };
        if(this.isFalling) { renderManager.drawText(0, 30, "red", "14px monospace", "left", "falling") };
        renderManager.drawText(0, 40, "red", "14px monospace", "left", this.tempY);
    } else {
        // Calculate the animation speed
        var speed = 0;
        speed = ((this.velocityX < 0 ? this.velocityX * -1 : this.velocityX) / 9.5);
        if(speed > 1.0) { speed = 1.0; }
        
        if((!this.isFalling && !this.isJumping) && (this.velocityX > 0.1 || this.velocityX < -0.1)) {
            // Walking and running
            if(speed > 0.9) {
                this.animation.running.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, 0, 1.0);
            } else {
                this.animation.walking.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, 0, speed);
            }
        } else if((!this.isFalling && !this.isJumping)) {
            // Standing
            this.animation.standing.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - this.drawingHeight / 2, 0, 1.0);
        } else if (this.isJumping || this.isFalling) {
            // Jumping
            this.animation.jumping.play(renderManager, images["player1"], spriteX - this.drawingWidth / 2, spriteY - 10 - this.drawingHeight / 2, 0, 1.0);
        }
    }
};