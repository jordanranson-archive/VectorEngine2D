$(document).ready(function() {
    var levelWidth = 100;
    var levelHeight = 50;
    var $level = $("#level");
    $level.css({
        "width": (levelWidth * 30) + "px",
        "height": (levelHeight * 30) + "px"
    });
    
    var x, y, $tile;
    for(x = 0; x < levelWidth; x++) {
        for(y = 0; y < levelHeight; y++) {
            $tile = $(document.createElement("div"));
            $tile.addClass("tile");
            $tile.css({
                "top": (y * 30) + "px",
                "left": (x * 30) + "px",
            });
            $tile.data("x", x);
            $tile.data("y", y);
            $tile.data("t1", -1);
            $tile.data("t2", -1);
            $tile.data("b1", -1);
            $tile.data("b2", -1);
            $tile.data("type", 0);
            $tile.appendTo($level);
        }
    }
});