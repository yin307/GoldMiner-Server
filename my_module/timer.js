function Timer() {
	// body...
}
Timer.prototype.SV_TIME = function(first_argument) {
	var d = new Date();
	var n = d.getTime();
	return String(n);
}; 

module.exports = Timer;