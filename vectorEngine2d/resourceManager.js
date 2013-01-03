var ResourceManager = function(contentPath) {
    this.contentPath = contentPath;
    this.images = {};
    this.audio = {};
    this.queue = [];
    
    this.isLoading = false;
};

// Add a resource to the load queue
ResourceManager.prototype.load = function(url, resourceName, resourceType) {
    var resource = {url: url, resourceName: resourceName, resourceType: resourceType};
    this.queue.push(resource);
};

ResourceManager.prototype.runQueue = function(num) {
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
};

// Load resource from URL
ResourceManager.prototype.loadResource = function(resourceDefn, num) {
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
        });
        resource.src = this.contentPath + resourceDefn.url;
        resource.load();
    }
};