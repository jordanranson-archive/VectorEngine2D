var Camera = function(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
};

Camera.prototype.addVelocity = function(x, y) {
    this.velocityX += x;
    this.velocityY += y;
};