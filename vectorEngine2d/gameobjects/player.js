var Player = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.velocityX = 0;
	this.velocityY = 0;
	this.angle = 0;
	this.maxJumpDist = 12;
	this.jumpDist = 0;
	this.lasty = y;
	this.lastx = 0;
	
	// States
	this.isJumping = false;
	this.isFalling = false;
	this.isAlive = true;
};

// Adds velocity to the player
Player.prototype.addVelocity = function(x, y) {
	this.velocityX += x;
	this.velocityY += y;
};

// Collides with the world
Player.prototype.collideWithTile = function(tile, adjx, adjy) {
	var run = tile.x2 - tile.x1;
	var rise = tile.y2 - tile.y1;
	
	var slope = rise / run;
	var intersect = (tile.y1) - (tile.x1 * slope);
	var col = (slope * adjx) + intersect;
	
	var angle = Util.radToDeg(Math.atan(rise / run));
	this.angle = angle;
	var normal = angle + 90;
	
	// Collide with track
	if(this.lasty + (this.width / 2) < col && adjy > col) {
		this.y = col + (this.y - adjy);
		this.isFalling = false;
		this.jumpDist = 0;
	} else {
		if(!this.isJumping) {
			this.isFalling = true;
		}
	}
};

Player.prototype.update = function(game) {
	if(this.isAlive) {
		// Accelerate
		if(game.inputManager.isKeyDown(KeyAction.forward))
			this.addVelocity(0.65, 0);
		
		// Brake
		if(game.inputManager.isKeyDown(KeyAction.backward))
			this.addVelocity(-0.65, 0);
			
		// Jump
		if(game.inputManager.isKeyDown(KeyAction.jump)) {
			if(!this.isFalling && !this.isJumping) {
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

	this.y += 7.5; // gravity

	this.x += this.velocityX;
	this.y += this.velocityY;
	
	// Decay velocity
	this.velocityX *= 0.93;
	this.velocityY *= 0.90;

	// Collision point
	var adjx = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.x;
	var adjy = ((this.width / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + (this.y + 2); // 2px padding for stroke width
	
	// Finds the line the player is going to collide with
	var playerPos;
	if(game.sceneManager.scene.tiles[0].level === 2) // background track
		playerPos = adjx / /*levelPrefs.width*/30 >> 0;
	else // foreground track
		playerPos = adjx / /*levelPrefs.width*/30 >> 0;
	
	// Loop through the game.sceneManager.scene.tiles and collide with the player
	for(var i = 0; i < game.sceneManager.scene.tiles.length; i++) {
		if(i === playerPos)
			this.collideWithTile(game.sceneManager.scene.tiles[i], adjx, adjy);
	}

	// Find the y direction the player is moving
	var yvel;
	var yfixed = this.y.toFixed(1);
	if(yfixed < this.lasty) yvel = 1;
	if(yfixed > this.lasty) yvel = -1;
	if(yfixed == this.lasty) yvel = 0;
	
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
	}
	
	// Die when falling off the edge of the world
	if(adjy > game.renderManager.canvas.height + this.width) {
		this.isAlive = false;
	}
	
	if(this.x - (this.width / 2) < 0) {
		this.x = this.width / 2;
		this.velocityX = 0;
	}
	
	if(this.x + (this.width / 2) > game.sceneManager.scene.tiles.length * /*levelPrefs.width*/30) {
		this.x = game.sceneManager.scene.tiles.length * /*levelPrefs.width*/30 - (this.width / 2);
		this.velocityX = 0;
	}
	
	// Reset when the player dies
	if(!this.isAlive) {
		this.x = /*levelStart.x*/game.renderManager.canvas.width / 2;
		this.y =  /*levelStart.y*/100;
		this.velocity = {x: 0, y: 0};
		this.isAlive = true;
	}
	
	this.lasty = this.y.toFixed(1); // last known y position
	
	// Update the camera position
	game.sceneManager.scene.camera.x = this.x - (game.renderManager.canvas.width / 2);
};

Player.prototype.draw = function(renderManager, camera) {
	var x = ((this.width / 2) * Math.cos((this.angle + 90) * Math.PI / 180)) + this.x;
	var y = ((this.width / 2) * Math.sin((this.angle + 90) * Math.PI / 180)) + this.y;
	renderManager.drawLine(this.x - camera.x, this.y, x - camera.x, y, "#a7c6e0", 2);
	renderManager.drawCircle(this.x - camera.x, this.y, this.width / 2, "#218ae0", 2, "transparent");
};