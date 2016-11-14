function result(){
	this.errorCode = 0;
	this.msg = "success";
	this.data = null;

	this.setValue = function (errorCode, msg, data){
		this.errorCode = errorCode;
		this.msg = msg;
		this.data = data;
	};

	this.onInvalidParams = function(params){
		this.setValue(1, "Missing or invalid params: " + params, null);
	};
	this.throwErr = function (err, callback){
		this.setValue(1, err, null);
		callback(this);
		throw err;
	};
}
module.exports = result;
