function Vector3 (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype.log = function() {
	console.log("(" + this.x.toFixed(2) + "," + this.y.toFixed(2) + ")");
};

Vector3.prototype.setX = function (x) {
	this.x = x;
}

Vector3.prototype.setY = function (y) {
	this.y = y;
}

Vector3.prototype.setZ = function (z) {
	this.z = z;
}

Vector3.prototype.zero = function () {
	return new Vector3(0, 0, 0);
}
module.exports = Vector3;