function RenderManager(canvas, context) {
    this.canvas = canvas;
    this.context = context;
}

RenderManager.prototype = {
    // Clears the canvas for redrawing
    clear: function(color) {
        this.context.save();

        // Use the identity matrix while clearing the canvas
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if(color) {
            this.drawRectangle(0, 0, this.canvas.width, this.canvas.height, "transparent", 0, color);
        }

        // Restore the transform
        this.context.restore();
    },

    // Draws a line to the canvas
    drawLine: function(x1, y1, x2, y2, strokeColor, strokeWidth) { 
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.stroke();
    },

    // Draws a polyline to the canvas
    drawPolyline: function(points, strokeColor, strokeWidth, fillColor) { 
        this.context.save();

        this.context.beginPath();
        for(var i = 0; i < points.length; i++) {
            if(i === 0) {
                this.context.moveTo(points[i][0], points[i][1]);
            } else {
                this.context.lineTo(points[i][0], points[i][1]);
            }
        }
        //this.context.closePath();
        
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.stroke();
        
        this.context.fillStyle = fillColor;
        this.context.fill();
        
        this.context.restore();
    },
    
    // Draws a rectangle to the canvas
    drawRectangle: function(x, y, width, height, strokeColor, strokeWidth, fillColor) { 
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.fillStyle = fillColor;
        this.context.fill();
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.stroke();
    },

    // Draws text to the canvas
    drawText: function(x, y, fillColor, fontStyle, textAlign, text) { 
        this.context.font = fontStyle;
        this.context.textAlign = textAlign;
        this.context.fillStyle = fillColor;
        this.context.fillText(text, x, y);
    },
    
    // Draws an image
    drawImage: function(image, x, y, width, height) { 
        if(typeof(width) != "undefined") {
            this.context.drawImage(image, x, y, width, height);
        } else {
            this.context.drawImage(image, x, y);
        }
    },

    // Draws a clipped section of an image
    drawSprite: function(image, x, y, width, height, sx, sy, swidth, sheight, angle) { 
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
    }
}