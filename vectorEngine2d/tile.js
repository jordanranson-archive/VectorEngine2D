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
        if(this.type === TileType.slope1a) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y},
                {x: baseX + 16, y: this.y + 4},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope1b) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 4},
                {x: baseX + 16, y: this.y + 8},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope1c) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 8},
                {x: baseX + 16, y: this.y + 12},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope1d) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 12},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope2a) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y},
                {x: baseX + 16, y: this.y + 8},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope2b) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 8},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope3a) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 16},
                {x: baseX + 16, y: this.y + 12},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope3b) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 12},
                {x: baseX + 16, y: this.y + 8},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope3c) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 8},
                {x: baseX + 16, y: this.y + 4},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope3d) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 4},
                {x: baseX + 16, y: this.y},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope4a) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 16},
                {x: baseX + 16, y: this.y + 8},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type === TileType.slope4b) {
            this.scene.renderManager.drawRectangle(this.x - Math.round(this.scene.camera.x), this.y, this.width, this.height, "transparent", 0, "#181818");
            var baseX = this.x - Math.round(this.scene.camera.x);
            var points = [
                {x: baseX,      y: this.y + 8},
                {x: baseX + 16, y: this.y},
                {x: baseX + 16, y: this.y + 16},
                {x: baseX,      y: this.y + 16},
                {x: baseX,      y: this.y}
            ];
            this.scene.renderManager.drawPolysprite(points, "transparent", 0, "#333");
        }
        if(this.type !== TileType.air) {
            this.scene.renderManager.drawRectangle(this.x - this.scene.camera.x, this.y, 1, 1, "transparent", 0, "rgba(255,255,0,0.15)");
            if(this.data.hilight) {
                this.scene.renderManager.drawRectangle(this.x - this.scene.camera.x, this.y, 16, 16, "rgba(255,255,0,0.15)", 1, "transparent");
            }
        }
    } 
};