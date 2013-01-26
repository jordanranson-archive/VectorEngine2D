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
    if(this.x - this.scene.camera.x + this.width > 0 
    && this.x - this.scene.camera.x - this.width < this.scene.renderManager.canvas.width) {
        if(this.type !== TileType.air) {
            this.scene.renderManager.drawCircle(this.x - this.scene.camera.x, this.y, 2, "transparent", 0, "rgba(255,255,0,0.05)");
        }
        if(this.type === TileType.air) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
        }
        if(this.type === TileType.solid) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#333");
        }
        if(this.type === TileType.platform) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height / 2, "transparent", 0, "#333");
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y + this.height / 2, this.width, this.height / 2, "transparent", 0, "#181818");
        }
        if(this.type === TileType.ladder) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height / 4, "transparent", 0, "#333");
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y + this.height / 4, this.width, this.height / 4, "transparent", 0, "#181818");
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y + this.height / 2, this.width, this.height / 4, "transparent", 0, "#333");
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y + this.height - this.height / 4, this.width, this.height / 4, "transparent", 0, "#181818");
        }
    } 
};