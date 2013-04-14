function Camera() {
    this.x;
    this.y;
}

Camera.prototype = {
    // Loads all the content needed at run-time
    loadContent: function(resourceManager) {
        var _this = this;
        var timestamp = new Date().getTime();
        
        /* Load content here */
        
    },

    // Bind events and set values
    init: function() {
        var _this = this;
        
    },

    // Remove events, unload game content, etc
    unload: function() {
        
    },
    
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },

    update: function(game) {
        
    },

    draw: function(game) {
        
    }
}