var RenderManager = function(canvas) {
	this.canvas = document.getElementById(canvas);
	this.context = this.canvas.getContext("2d");
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