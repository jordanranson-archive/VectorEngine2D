var Tile = function(scene, x, y, width, height, type, display) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.displayType = display;
    this.data = {};
};

Tile.prototype.draw = function() {
    // Is the tile visible on screen
    if(this.displayType !== TileDisplayType.none 
    && this.x - this.scene.camera.x + this.width > 0 
    && this.x - this.scene.camera.x - this.width < this.scene.renderManager.canvas.width) {
        if(this.displayType === TileDisplayType.normal) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#333");
        }
    } 
};