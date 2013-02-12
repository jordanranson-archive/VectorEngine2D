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
    this.sensors = {};
    this.animations = {};
    
    this.DEBUG = {};
    
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
    
    // Collision detection sensors
    this.updateSensors();
    
    // Animations 
    this.animations = {
        standing:    new Animation(this.drawingWidth * 12, 0,           this.drawingWidth, this.drawingHeight, 1, 1, 0),
        walking:     new Animation(0,               0,           this.drawingWidth, this.drawingHeight, 12, 10, 0),
        running:     new Animation(0,               this.drawingHeight, this.drawingWidth, this.drawingHeight, 4, 5, 0),
        jumping:     new Animation(this.drawingWidth * 4,  this.drawingHeight, this.drawingWidth, this.drawingHeight, 4, 5, 0)
    };
    
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
    var tileSize = 16;
            
    // Collision detection sensors
    this.updateSensors();
    
    // Bottom of level boundry
    if(this.tempY >= this.scene.levelHeight * tileSize) {
        this.isAlive = false;
        this.isFalling = true;
    }
    
    var topLeft = {
        x: Number((this.sensors.topLeft.x / tileSize).toFixed()),
        y: Number((this.sensors.topLeft.y / tileSize).toFixed())
    };
    var topRight = {
        x: Number((this.sensors.topRight.x / tileSize).toFixed()),
        y: Number((this.sensors.topRight.y / tileSize).toFixed())
    };
    var bottomLeft = {
        x: Number(((this.sensors.bottomLeft.x - 8) / tileSize).toFixed()),
        y: Number((this.sensors.bottomLeft.y / tileSize).toFixed())
    };
    var bottomRight = {
        x: Number((this.sensors.bottomRight.x / tileSize).toFixed()),
        y: Number((this.sensors.bottomRight.y / tileSize).toFixed())
    };
    var sidesLeftBottom = {
        x: Number((this.sensors.sidesLeftBottom.x / tileSize).toFixed()),
        y: Number((this.sensors.sidesLeftBottom.y / tileSize).toFixed())
    };
    var sidesRightBottom = {
        x: Number((this.sensors.sidesRightBottom.x / tileSize).toFixed()),
        y: Number((this.sensors.sidesRightBottom.y / tileSize).toFixed())
    };
    var playerPos = {
        x: Number((this.tempX / tileSize).toFixed()),
        y: Number((this.tempY / tileSize).toFixed())
    }
    this.DEBUG.bottomLeft = bottomLeft;
    var tile;
    
    // Collide downwards
    if(this.scene.tiles[bottomLeft.y] && this.scene.tiles[bottomLeft.y][bottomLeft.x]) {
        tile = this.scene.tiles[bottomLeft.y][bottomLeft.x];
        tile.data.hilight = true;
        if(tile.type !== TileType.air && this.sensors.bottomLeft.y >= tile.y) {
            this.tempY = tile.y;
        }
    }
    
    
    /*if(this.scene.tiles[bottomLeft.y] && this.scene.tiles[bottomLeft.y][bottomLeft.x]) {
        tile1 = this.scene.tiles[bottomLeft.y][bottomLeft.x];
    }*/
};

// Updates the players collision sensor positions
Player.prototype.updateSensors = function() {
    this.sensors = {
        topLeft: {
            x: this.x - 9,
            y: this.y - this.height - 1
        },
        topRight: {
            x: this.x + 9,
            y: this.y - this.height - 1
        },
        bottomLeft: {
            x: this.x - 9,
            y: this.y + 1
        },
        bottomRight: {
            x: this.x + 9,
            y: this.y + 1
        },
        sidesLeftBottom: {
            x: this.x + 10,
            y: this.y - 12
        },
        sidesRightBottom: {
            x: this.x - 10,
            y: this.y - 12
        }
    };
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
    this.tempY += this.velocityY + (this.isClimbing ? 0 : 1); // gravity
    
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
    
    this.updateSensors();
    
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

        renderManager.drawRectangle((this.DEBUG.bottomLeft.x * 16) - this.scene.camera.x, this.DEBUG.bottomLeft.y * 16, 16, 16, "transparent", 0, "rgba(255,255,0,0.15)");
        
        renderManager.drawRectangle(this.x - (this.width / 2) - this.scene.camera.x, this.y - this.height, this.width, this.height, "transparent", 0, "#218ae0");
        renderManager.drawCircle(this.x - this.scene.camera.x, this.y, 2, "transparent", 0, "rgba(255,0,255,1)");

        renderManager.drawCircle(this.sensors.bottomLeft.x - this.scene.camera.x, this.sensors.bottomLeft.y, 1, "transparent", 0, "yellow");
        renderManager.drawCircle(this.sensors.bottomRight.x - this.scene.camera.x, this.sensors.bottomRight.y, 1, "transparent", 0, "yellow");
        renderManager.drawCircle(this.sensors.sidesLeftBottom.x - this.scene.camera.x, this.sensors.sidesLeftBottom.y, 1, "transparent", 0, "yellow");
        renderManager.drawCircle(this.sensors.sidesRightBottom.x - this.scene.camera.x, this.sensors.sidesRightBottom.y, 1, "transparent", 0, "yellow");

        if(this.isClimbing) { renderManager.drawText(0, 10, "red", "14px monospace", "left", "climbing") };
        if(this.isJumping) { renderManager.drawText(0, 20, "red", "14px monospace", "left", "jumping") };
        if(this.isFalling) { renderManager.drawText(0, 30, "red", "14px monospace", "left", "falling") };
    }
};