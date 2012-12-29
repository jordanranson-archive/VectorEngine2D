var Tile = function(x1, y1, x2, y2, type) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
    this.z = 0;
    this.type = type;
    this.displayType = TileDisplayType.none;
    this.data;
};

Tile.prototype.draw = function(renderManager, camera) {
    if(renderManager.wireframes) {
        // Is the tile visible on screen
        if(this.displayType != TileDisplayType.none && this.x1 - camera.x + 30 > 0 && this.x2 - camera.x - 30 < renderManager.canvas.width) {
        
            // Ties
            var run = this.x2 - this.x1;
            var rise = this.y2 - this.y1;
            var slope = rise / run;
            var intersect = this.y1 - (this.x1 * slope);
            var y = (slope * (this.x1 + run / 2 + run / 4)) + intersect;
            renderManager.drawCircle((this.x1 + run / 2 + run / 4) - camera.x, y, 3, "transparent", 0, "#382310");
            y = (slope * (this.x1 + run / 2 - run / 4)) + intersect;
            renderManager.drawCircle((this.x1 + run / 2 - run / 4) - camera.x, y, 3, "transparent", 0, "#382310");
        
            // Solid ground
            if(this.displayType == TileDisplayType.solidGround) {

                if(this.data == 1) {
                    renderManager.drawArc(this.x1 - camera.x, this.y2 + 25, 20, -90 * Math.PI / 180, 0, "#333", 6, "transparent");
                    renderManager.drawLine(this.x2 - camera.x - 10, this.y2 + 25, this.x2 - camera.x - 10, this.y2 + 500, "#333", 6);
                } else if(this.data == 2) {
                    renderManager.drawArc(this.x2 - camera.x, this.y1 + 25, 20, -180 * Math.PI / 180, -90 * Math.PI / 180, "#333", 6, "transparent");
                    renderManager.drawLine(this.x1 - camera.x + 10, this.y1 + 25, this.x1 - camera.x + 10, this.y1 + 500, "#333", 6);
                } else {
                    renderManager.drawLine(this.x1 - camera.x, this.y1 + 5, this.x2 - camera.x, this.y2 + 5, "#333", 6);
                }
                
            }
            
            // Wooden bridge
            if(this.displayType == TileDisplayType.scaffold) {
                // Vertical supports
                renderManager.drawLine(this.x1 - camera.x, this.y1 + 6, this.x1 - camera.x, this.y1 + 500, "#382310", 2);
                renderManager.drawLine(this.x2 - camera.x, this.y2 + 6, this.x2 - camera.x, this.y2 + 500, "#382310", 2);
                
                // Crossbeams
                renderManager.drawLine(this.x1 - camera.x, this.y1 + 6, this.x2 - camera.x, this.y2 + 45, "#382310", 2);
                renderManager.drawLine(this.x2 - camera.x, this.y2 + 6, this.x1 - camera.x, this.y1 + 45, "#382310", 2);
            }
            
            // Rail
            if(this.displayType == TileDisplayType.scaffold) {
                renderManager.drawLine(this.x1 - camera.x, this.y1 + 4, this.x2 - camera.x, this.y2 + 4, "#734720", 4);
            }
            
            renderManager.drawLine(this.x1 - camera.x, this.y1 - 2, this.x2 - camera.x, this.y2 - 2, "#555", 2);
        }
    } else {
        // TODO: Normal rendering
    }
};