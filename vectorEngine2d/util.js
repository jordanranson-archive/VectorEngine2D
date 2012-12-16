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