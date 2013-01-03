var ResourceManager = function(contentPath) {
    this.contentPath = contentPath;
    this.images = {};
    this.audio = {};
};

// Load resource from URL
ResourceManager.prototype.load = function(url, resourceName, resourceType) {
    var resource;
    
    // Image file
    if(resourceType == ResourceType.image) {
        // Check to see if resource has already been loaded
        var resources = this.images;
        for (var prop in resources) {
            if(prop == resourceName) { return; }
        }
        
        // Create, load and store resource
        resource = new Image();
        resource.addEventListener("load", function() {
            resources[resourceName] = resource;
        });
        resource.src = this.contentPath + url;
    }
    
    // Audio file
    if(resourceType == ResourceType.audio) {
        // Check to see if resource has already been loaded
        var resources = this.audio;
        for (var prop in resources) {
            if(prop == resourceName) { return; }
        }
        
        // Create, load and store resource
        resource = new Audio();
        resource.addEventListener("canplaythrough", function() {
            resources[resourceName] = resource;
        });
        resource.src = this.contentPath + url;
        resource.load();
    }
};