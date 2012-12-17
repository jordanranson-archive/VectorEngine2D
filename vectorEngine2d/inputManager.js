var KeyAction = {};

var InputManager = function(keyMap) {
	var defaultKeyMap = {
		up: Key.upArrow,
		down: Key.downArrow,
		forward: Key.rightArrow,
		backward: Key.leftArrow,
		jump: Key.space,
		action1: Key.z,
		action2: Key.x,
		action3: Key.c,
		action4: Key.a,
		action5: Key.s,
		accept: Key.enter,
		cancel: Key.escape,
		pause: Key.pause
	};
	
	var _this = this;
	this.keyEvents = {};
	this.keysPressed = {};
	this.keyAction = Util.extendParams(defaultKeyMap, keyMap);
	KeyAction = this.keyAction;
	
	this.keydown = function(e) {
		this.keysPressed[e.keyCode] = true;
		if(typeof(this.keyEvents[e.keyCode]) == "function") {
			this.keyEvents[e.keyCode]();
		}
	};

	this.keyup = function(e) {
		delete this.keysPressed[e.keyCode];
	};
	
	window.addEventListener('keyup', function(e) { _this.keyup(e); }, false);
	window.addEventListener('keydown', function(e) { _this.keydown(e); }, false);
};

InputManager.prototype.isKeyDown = function(keyCode) {
	return this.keysPressed[keyCode];
};

InputManager.prototype.addKeyEvent = function(keyCode, callback) {
	this.keyEvents[keyCode] = callback;
};

InputManager.prototype.removeKeyEvent = function(keyCode) {
	delete this.keyEvents[keyCode];
};
