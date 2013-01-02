var Animation = function(sx, sy, swidth, sheight, frames, duration, loops) {
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
    this.frames = frames;
	this.frame = 0;
    this.duration = 2.5;
    this.loops = loops;
    this.loop = 0;
    this.timePlaying = 0;
	this.lastTime = 0;
};

Animation.prototype.play = function(renderManager, image, x, y, angle, speed) {
	var curTime = (this.timePlaying % this.duration);
	
    if(curTime < this.lastTime) {
		this.frame++;
	}
	
	if(this.frame >= this.frames) {
		this.frame = 0;
		this.loop++;
	}

    renderManager.drawSprite(image, x, y, this.swidth, this.sheight, this.sx + (this.swidth * this.frame), this.sy, this.swidth, this.sheight, angle);
    
    this.lastTime = curTime;
    this.timePlaying += speed < 0.2 ? 0.2 : speed;
};