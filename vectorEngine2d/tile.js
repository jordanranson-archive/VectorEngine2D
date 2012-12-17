var Tile = function(x1, y1, x2, y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
};

Tile.prototype.draw = function(renderManager, camera) {
	renderManager.drawLine(this.x1 - camera.x, this.y1, this.x2 - camera.x, this.y2, "#734720", 2);
};