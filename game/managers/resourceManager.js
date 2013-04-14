var ResourceType = {
    image: 0,
    audio: 1,
    text: 2,
    json: 3
};

function ResourceManager(contentPath) {
    this.contentPath = contentPath;
    this.images = {};
    this.audio = {};
    this.generic = {};
    this.queue = [];
    
    this.isLoading = false;
};

ResourceManager.prototype = {
    // Add a resource to the load queue
    load : function(url, resourceName, resourceType, callback) {
        var resource = {url: url, resourceName: resourceName, resourceType: resourceType, callback: callback};
        this.queue.push(resource);
    },

    runQueue: function(num) {
        // First call
        if(typeof(num) === "undefined") { num = 0; };
        
        // Finished loading
        if(num == this.queue.length) {
            this.isLoading = false;
            this.queue = [];
            return;
        }

        // If has resource to load
        if(this.queue.length > 0) {
            this.isLoading = true;
            this.loadResource(this.queue[num], num);
        } else {
            this.isLoading = false;
        }
    },

    // Load resource from URL
    loadResource: function(resourceDefn, num) {
        var resource;
        var _this = this;
        
        // Image file
        if(resourceDefn.resourceType === ResourceType.image) {
            // Check to see if resource has already been loaded
            var resources = this.images;
            for (var prop in resources) {
                if(prop == resourceDefn.resourceName) { return; }
            }
            
            // Create, load and store resource
            resource = new Image();
            resource.addEventListener("load", function() {
                resources[resourceDefn.resourceName] = resource;
                _this.runQueue(num + 1);
                if(resourceDefn.callback) { resourceDefn.callback(resource); };
            });
            resource.src = this.contentPath + resourceDefn.url;
        }
        
        // Audio file
        if(resourceDefn.resourceType === ResourceType.audio) {
            // Check to see if resource has already been loaded
            var resources = this.audio;
            for (var prop in resources) {
                if(prop == resourceDefn.resourceName) { return; }
            }
            
            // Create, load and store resource
            resource = new Audio();
            resource.addEventListener("canplaythrough", function() {
                resources[resourceDefn.resourceName] = resource;
                _this.runQueue(num + 1);
                if(resourceDefn.callback) { resourceDefn.callback(resource); };
            });
            resource.src = this.contentPath + resourceDefn.url;
            resource.load();
        }
        
        // Plain text
        if(resourceDefn.resourceType === ResourceType.text) {
            // Check to see if resource has already been loaded
            var resources = this.generic;
            for (var prop in resources) {
                if(prop == resourceDefn.resourceName) { return; }
            }
            
            // Create, load and store resource
            Util.ajax(this.contentPath + resourceDefn.url, function(responseText) {
                resources[resourceDefn.resourceName] = responseText;
                _this.runQueue(num + 1);
                if(resourceDefn.callback) { resourceDefn.callback(resource); };
            });
        }
        
        // JSON
        if(resourceDefn.resourceType === ResourceType.json) {
            // Check to see if resource has already been loaded
            var resources = this.generic;
            for (var prop in resources) {
                if(prop == resourceDefn.resourceName) { return; }
            }
            
            // Create, load and store resource
            Util.ajax(this.contentPath + resourceDefn.url, function(responseText) {
                resources[resourceDefn.resourceName] = JSON.parse(responseText);
                _this.runQueue(num + 1);
                if(resourceDefn.callback) { resourceDefn.callback(resource); };
            });
        }
    }
};