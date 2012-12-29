var ResourceManager = function() {
	this.images = {};
	this.audio = {};
};

// Load resource from URL
ResourceManager.prototype.load = function(url, resourceName, resourceType) {
    if(resourceType == ResourceType.image) {
        resources = this.images;
    }
    
    // Check to see if resource has already been loaded
    for (var prop in resources) {
        if(prop == resourceName) { return; }
    }
    
    var resource;
    if(resourceType == ResourceType.image) {
        resource = new Image();
        resource.onload = function() {
            resources[resourceName] = resource;
        };
        resource.src = "content/images/" + url;
    }
};