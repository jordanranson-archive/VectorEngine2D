console.clear();
console.log(new Date().getTime());

Shades = {
    veryDark: "#332532",
    dark: "#644D52",
    medium: "#F77A52",
    light: "#FF974F",
    veryLight: "#A49A87"
};

function Game(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.scene;

    // Stats
    this.lastTime;
    this.curTime;
    this.tick;
    this.stats;
    
    // Collections
    this.keyEvents = {};
    this.keysPressed = {};
    this.keys = {
        up: Key.upArrow,
        down: Key.downArrow,
        forward: Key.rightArrow,
        backward: Key.leftArrow,
        jump: Key.upArrow,
        action1: Key.z,
        action2: Key.x,
        action3: Key.c,
        action4: Key.a,
        action5: Key.s,
        accept: Key.enter,
        cancel: Key.escape,
        pause: Key.pause,
        func1: Key.numpad1,
        func2: Key.numpad2,
        func3: Key.numpad3,
        func4: Key.numpad4,
        func5: Key.numpad5,
        func6: Key.numpad6
    };
    
    // Managers
    this.resourceManager = new ResourceManager("resources/");
    this.renderManager = new RenderManager(this.canvas, this.context);
    
    // Flags & states
    this.isMobile;
    this.isPaused = false;
    this.isDebug = true;
};

Game.prototype = {

    // Adds pressed keys to an array of keys
    keydown: function(e) {
        this.keysPressed[e.keyCode] = true;
        if(typeof(this.keyEvents[e.keyCode]) == "function") {
            this.keyEvents[e.keyCode]();
        }
    },
    
    // Removes keys not being pressed from the pressed keys array
    keyup: function(e) {
        delete this.keysPressed[e.keyCode];
    },
    
    // Adds a key event
    addKeyEvent: function(keyCode, callback) {
        this.keyEvents[keyCode] = callback;
    },

    // Removes a key event
    removeKeyEvent: function(keyCode) {
        delete this.keyEvents[keyCode];
    },
    
    // Checks if a key is being pressed
    isKeyDown: function(keyCode) {
        return this.keysPressed[keyCode];
    },
    
    // Loads a scene into the game
    loadScene: function(scene) {
        var _this = this;
        this.scene.unload(function() {
            // Load scene content before loading the scene
            scene.loadContent(_this.resourceManager);
            _this.resourceManager.runQueue();
            var timer = setInterval(function() {
                if(!_this.resourceManager.isLoading) {
                    clearInterval(timer);
                    _this.scene = scene;
                    scene.init(_this);
                }
            }, 100);
        });
    },

    // Execute logic
    update: function() {
        this.scene.update(this);
    },

    // Draw to the screen
    draw: function() {
        this.renderManager.clear("#141414");
        
        // Draw pause menu
        if(this.isPaused) {
            this.renderManager.drawRectangle(
                0, 0, this.renderManager.canvas.width, this.renderManager.canvas.height,
                "transparent", 0, "#141414"
            );
            this.renderManager.drawText(
                this.renderManager.canvas.width / 2 + 2, this.renderManager.canvas.height / 2 + 2 - 20,
                "#000", "20pt sans-serif", "center", "Paused"
            );
            this.renderManager.drawText(
                this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2 - 20,
                "#fff", "20pt sans-serif", "center", "Paused"
            );
        }
        
        this.scene.draw(this);
    },

    // Runs every tick
    gameloop: function() {
        this.stats.begin();
        
        this.update();
        this.draw();
        this.lastTime = this.curTime;
        this.curTime = new Date().getTime();
        this.tick++;
        
        this.stats.end();
    },

    // Start the gameloop
    run: function() {
        var _this = this;
       
        // Initialization
        
        // mrdoob stats.js fps counter
        // https://github.com/mrdoob/stats.js
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
        
        // Set the current time;
        this.curTime = new Date().getTime();
        this.lastTime = this.curTime - 1;
        this.ticks = 0;
        
        // Check if is a mobile device
        this.isMobile = (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i));
        
        // Keyboard events
        window.addEventListener("keyup", function(e) { _this.keyup(e); }, false);
        window.addEventListener("keydown", function(e) { _this.keydown(e); }, false);
        
        // Add a key event to pause the game
        this.addKeyEvent(Key.escape, function() { _this.isPaused = !_this.isPaused; });
        this.addKeyEvent(Key.escape, function() { _this.isDebug = !_this.isDebug; });
        
        // Mouse down event
        /*this.canvas.addEventListener("mousedown", function(e) {}, false);
        this.canvas.addEventListener("mousemove", function(e) {}, false);*/
        
        // Load the level
        this.scene = { unload: function(callback) {callback();}, update: function() {}, draw: function() {} };
        this.loadScene(new Level());
        
        // Check for animation frame support
        var animationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;

        if (animationFrame !== null) {
            var recursiveAnim = function() {
                _this.gameloop();
                animationFrame(recursiveAnim);
            };

            // start the gameloop
            animationFrame(recursiveAnim);
        } else {
            // Old browser fall-back
            setInterval(gameloop, 1000.0 / 60.0);
        }
    }
};