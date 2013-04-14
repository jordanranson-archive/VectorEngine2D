function Shape() {
    this.points;
}

Shape.prototype = {
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
    
    setPoints: function(points) {
        this.points = points;
    },

    update: function(game) {
        
    },

    draw: function(game) {
        var camera = game.scene.camera;
        var renderManager = game.renderManager;
        
        renderManager.drawPolyline(this.points, game.shades.veryDark, 2, "transparent");
    }
}