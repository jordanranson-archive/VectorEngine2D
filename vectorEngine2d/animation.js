var Animation = function(sx, sy, swidth, sheight, frames, duration, loops) {
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
    this.frames = frames;
    this.duration = duration;
    this.loops = loops;
    this.lastTime = new Date().getTime();
    this.currTime = this.lastTime;
    this.timePlaying = 0;
};

Animation.prototype.play = function(renderManager, image, x, y, angle, speed) {
    this.lastTime = this.currTime;
    this.currTime = new Date().getTime();
    
    var frame = (((this.timePlaying) % (this.duration) / (this.duration)) * (this.frames - 1)).toFixed();

    renderManager.drawSprite(image, x, y, this.swidth, this.sheight, this.sx + (this.swidth * frame), this.sy, this.swidth, this.sheight, angle);
    
    this.timePlaying += this.currTime - this.lastTime;
};