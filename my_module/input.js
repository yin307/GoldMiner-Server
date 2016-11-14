var Timer = require("./timer.js");

function Input(name, ID, data) {
	this.timeStamp = new Timer().SV_TIME();
	this.ID = ID;
	this.name = name;
	this.data = data;
}

Input.prototype.getName = function() {
	return this.name;
};

Input.prototype.getData = function() {
	return this.data;
};
module.exports = Input;