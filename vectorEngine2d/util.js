var Util = {};

// Extends options from defaults
Util.extendParams = function(defaultParams, userParams) {
    // Create a copy of the default params
    var newParams = defaultParams;
    
    // Loop through user params and update new params
    for (var key in userParams) {
        newParams[key] = userParams[key];
    }
    return newParams;
};

// Converts radians to degrees
Util.radToDeg = function(rad) {
    return rad * (180 / Math.PI);
};

// Performs an AJAX request
Util.ajax = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
        if(request.readyState == 4) {
            if(request.status == 200 || request.status == 0) {
                callback(request.responseText);
            } else if(request.status == 404) {
                console.warn("Content not found:", request.statusText);
            } else {
                console.warn("Error loading content:", request.statusText);
            }
        }
    };
    request.send(null);
};