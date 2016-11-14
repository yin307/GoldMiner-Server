var vector2 = require("./vector3.js");

function Transform() {
}

Transform.prototype.moveObject = function(basePos,vectorMove) {
	// body...
	basePos.setX(basePos.x + vectorMove.x);
	basePos.setY(basePos.y + vectorMove.y);

	return basePos;	
};

module.exports = Transform;