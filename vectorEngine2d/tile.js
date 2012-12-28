var Tile = function(x1, y1, x2, y2, type) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
    this.type = type;
};

Tile.prototype.draw = function(renderManager, camera) {
    if(this.type != TileType.air && this.x1 - camera.x + 30 > 0 && this.x2 - camera.x - 30 < renderManager.canvas.width) {
        if(this.type == TileType.solid) {
            renderManager.drawLine(this.x1 - camera.x, this.y1, this.x1 - camera.x, this.y1 + 500, "#382310", 2);
            renderManager.drawLine(this.x2 - camera.x, this.y2, this.x2 - camera.x, this.y2 + 500, "#382310", 2);
        }
        
        renderManager.drawLine(this.x1 - camera.x, this.y1, this.x2 - camera.x, this.y2, "#734720", 2);
    }
};