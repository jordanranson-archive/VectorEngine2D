var RenderManager = function(canvas) {
    this.canvas = document.createElement("canvas");
    this.canvas.height = 320;
    this.canvas.width = 480;
    this.context = this.canvas.getContext("2d");
    this.drawingCanvas = document.getElementById(canvas);
    this.drawingCanvasContext = this.drawingCanvas.getContext("2d");
    this.wireframes = true;
};

RenderManager.prototype.smoothImageScaling = function(smoothing) {
    this.context.imageSmoothingEnabled = smoothing;
    this.context.webkitImageSmoothingEnabled = smoothing;
    this.context.mozImageSmoothingEnabled = smoothing;
    this.drawingCanvasContext.imageSmoothingEnabled = smoothing;
    this.drawingCanvasContext.webkitImageSmoothingEnabled = smoothing;
    this.drawingCanvasContext.mozImageSmoothingEnabled = smoothing;
};

RenderManager.prototype.clear = function(color) {
    this.context.save();

    // Use the identity matrix while clearing the canvas
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if(color) {
        this.drawRectangle(0, 0, this.canvas.width, this.canvas.height, "transparent", 0, color);
    }

    // Restore the transform
    this.context.restore();
};

RenderManager.prototype.drawLine = function(x1, y1, x2, y2, strokeColor, strokeWidth) { 
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.lineWidth = strokeWidth;
    this.context.strokeStyle = strokeColor;
    this.context.stroke();
};

RenderManager.prototype.drawCircle = function(cx, cy, r, strokeColor, strokeWidth, fillColor) { 
    this.context.beginPath();
    this.context.arc(cx, cy, r, 0, 2 * Math.PI, false);
    this.context.fillStyle = fillColor;
    this.context.fill();
    this.context.lineWidth = strokeWidth;
    this.context.strokeStyle = strokeColor;
    this.context.stroke();
};

RenderManager.prototype.drawArc = function(cx, cy, r, angleStart, distance, strokeColor, strokeWidth, fillColor) { 
    this.context.beginPath();
    this.context.arc(cx, cy, r, angleStart, distance, false);
    this.context.fillStyle = fillColor;
    this.context.fill();
    this.context.lineWidth = strokeWidth;
    this.context.strokeStyle = strokeColor;
    this.context.stroke();
};

RenderManager.prototype.drawRectangle = function(x, y, width, height, strokeColor, strokeWidth, fillColor) { 
    this.context.beginPath();
    this.context.rect(x, y, width, height);
    this.context.fillStyle = fillColor;
    this.context.fill();
    this.context.lineWidth = strokeWidth;
    this.context.strokeStyle = strokeColor;
    this.context.stroke();
};

RenderManager.prototype.drawText = function(x, y, fillColor, fontStyle, textAlign, text) { 
    this.context.font = fontStyle;
    this.context.textAlign = textAlign;
    this.context.fillStyle = fillColor;
    this.context.fillText(text, x, y);
};

RenderManager.prototype.drawBackground = function(image, x, y, width, height) { 
    this.context.fillStyle = this.context.createPattern(image, "repeat");
    this.context.fillRect(x, y, width, height);
};

RenderManager.prototype.drawImage = function(image, x, y, width, height) { 
    if(typeof(width) != "undefined") {
        this.context.drawImage(image, x, y, width, height);
    } else {
        this.context.drawImage(image, x, y);
    }
};

RenderManager.prototype.drawSprite = function(image, x, y, width, height, sx, sy, swidth, sheight, angle) { 
    if(typeof(angle) != "undefined") {
        this.context.save();
        this.context.rotate(angle);
    }

    if(typeof(sx) != "undefined") {
        this.context.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);
    } else if(typeof(width) != "undefined") {
        this.context.drawImage(image, x, y, width, height);
    } else {
        this.context.drawImage(image, x, y);
    }
    
    if(typeof(angle) != "undefined") {
        this.context.restore();
    }
};

RenderManager.prototype.drawPolysprite = function(points, resource) { 
    /*this.context.save();
    
    this.context.rect(x, y, width, height);
    this.context.clip();
    
    this.context.rect(x, y, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "red";
    this.context.fill();
    
    this.context.restore();*/
};