Level = function() {
    this.camera;
    this.players = [];
    this.gameObjects = [];
    this.initId = 0;
    this.boundries = { right: 0, bottom: 0, top: 0, left: 0 };
    this.debugDraw;
};

Level.prototype = {
    // Loads all the content needed at run-time
    loadContent: function(resourceManager) {
        var _this = this;
        var timestamp = new Date().getTime();
        
        /* Load content here */
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].loadContent();
        }
    },
    
    // Prepare for the level to be run
    init: function(game) {
        var _this = this;

        this.createLevel(game);
        
        this.camera = new Camera();
        this.gameObjects.push(this.camera);
        
        this.player = new Player();
        this.gameObjects.push(this.player);
        
        // Initialize all game objects
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].init(game);
        }
        
        // Update first tick early so everything appears to be in position     
        // before drawing
        this.update(game);
    },

    // Remove events, unload game content, etc
    unload: function(callback) {
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].unload();
        }
        callback();
    },
    
    createLevel: function(game) {
        var canvasWidth = game.renderManager.canvas.width;
        var canvasHeight = game.renderManager.canvas.height;
        
        // create 2 big platforms	
        var b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2Fixture = Box2D.Dynamics.b2Fixture
        , b2World = Box2D.Dynamics.b2World
        , b2MassData = Box2D.Collision.Shapes.b2MassData
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

        this.world = new b2World(
             new b2Vec2(0, 30)    //gravity
          ,  true                 //allow sleep
        );

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0;
        fixDef.userData = "ground";

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;

        // positions the center of the object (not upper left!)
        bodyDef.position.x = canvas.width / 2 / SCALE;
        bodyDef.position.y = canvas.height / SCALE;

        fixDef.shape = new b2PolygonShape;

        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox((canvasWidth / SCALE) / 2, (100  / SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //create some objects
        fixDef.restitution = 0.2;
        //fixDef.userData = "doodad";
        bodyDef.type = b2Body.b2_dynamicBody;
        
        for(var i = 0; i < 25; ++i) {
          if(Math.random() > 0.5) {
             fixDef.shape = new b2PolygonShape;
             fixDef.shape.SetAsBox(
                   Math.random() + 0.1 //half width
                ,  Math.random() + 0.1 //half height
             );
          } else {
             fixDef.shape = new b2CircleShape(
                Math.random() + 0.1 //radius
             );
          }
          bodyDef.position.x = Math.random() * 25;
          bodyDef.position.y = Math.random() * 10;
          this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        }

        //setup debug draw
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(game.renderManager.context);
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    },

    update: function(game) {
        if(!game.isPaused) {
            for(var i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].update(game);
            }

            this.world.Step((game.curTime - game.lastTime) / 1000, 10, 10);
            this.world.ClearForces();
        }
    },

    draw: function(game) {
        if(!game.isPaused) {
            if(game.isDebug) {
                this.world.DrawDebugData();
            } 
            else {
                for(var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].draw(game);
                }
            }
        }
    }
};