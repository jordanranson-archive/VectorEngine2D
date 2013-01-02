var Tile = function(scene, x1, y1, x2, y2, drawingX, drawingY, drawingWidth, drawingHeight, type) {
    this.scene = scene;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
    this.drawingX = drawingX;
    this.drawingY = drawingY;
    this.drawingWidth = drawingWidth;
    this.drawingHeight = drawingHeight;
    this.z = 0;
    this.type = type;
    this.displayType = TileDisplayType.none;
    this.data;
};

Tile.prototype.draw = function() {
	var tileWidth = this.scene.levelPrefs.tileWidth;
	
    if(this.displayType != TileDisplayType.none && this.x1 - this.scene.camera.x + tileWidth > 0 && this.x2 - this.scene.camera.x - tileWidth < this.scene.renderManager.canvas.width) {
        // Is the tile visible on screen
        if(this.scene.renderManager.wireframes) {
        
            // Ties
            var run = this.x2 - this.x1;
            var rise = this.y2 - this.y1;
            var slope = rise / run;
            var intersect = this.y1 - (this.x1 * slope);
            var y = (slope * (this.x1 + run / 2 + run / 4)) + intersect;
            //this.scene.renderManager.drawCircle((this.x1 + run / 2 + run / 4) - this.scene.camera.x, y, 2, "transparent", 0, "#382310");
            
            // Drawing box
            //this.scene.renderManager.drawRectangle(this.drawingX - this.scene.camera.x, this.drawingY, this.drawingWidth, this.drawingHeight, "rgba(0,255,255,0.2)", 1, "transparent");
            
            // Solid ground
            if(this.displayType == TileDisplayType.solidGround) {
                // Vertical supports
                this.scene.renderManager.drawLine(this.x1 - this.scene.camera.x, this.y1 + 6, this.x1 - this.scene.camera.x, this.y1 + 500, "#222", 2);
                this.scene.renderManager.drawLine(this.x2 - this.scene.camera.x, this.y2 + 6, this.x2 - this.scene.camera.x, this.y2 + 500, "#222", 2);
                
				this.scene.renderManager.drawLine(this.x1 - this.scene.camera.x, this.y1 + 3, this.x2 - this.scene.camera.x, this.y2 + 3, "#333", 6);
            }
            
            // Wooden bridge
            if(this.displayType == TileDisplayType.scaffold) {
                // Vertical supports
                this.scene.renderManager.drawLine(this.x1 - this.scene.camera.x, this.y1 + 4, this.x1 - this.scene.camera.x, this.y1 + 500, "#382310", 2);
                this.scene.renderManager.drawLine(this.x2 - this.scene.camera.x, this.y2 + 4, this.x2 - this.scene.camera.x, this.y2 + 500, "#382310", 2);
                
                // Crossbeams
                /*this.scene.renderManager.drawLine(this.x1 - this.scene.camera.x, this.y1 + 6, this.x2 - this.scene.camera.x, this.y2 + 45, "#382310", 2);
                this.scene.renderManager.drawLine(this.x2 - this.scene.camera.x, this.y2 + 6, this.x1 - this.scene.camera.x, this.y1 + 45, "#382310", 2);*/
                
                this.scene.renderManager.drawLine(this.x1 - this.scene.camera.x, this.y1 + 2, this.x2 - this.scene.camera.x, this.y2 + 2, "#734720", 4);
            }
            
            // Platforms
            if(this.displayType == TileDisplayType.railOnly) {
                this.scene.renderManager.drawLine(this.x1 - this.scene.camera.x, this.y1 + 1, this.x2 - this.scene.camera.x, this.y2 + 1, "#555", 2);
            }
        } else {
            // TODO: Normal rendering
            
        }
    } 
};