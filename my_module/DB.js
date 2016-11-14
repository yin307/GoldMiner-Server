function DB() {

	this.version = '0.0.1';
	//var conn = null;
	var pool = null;
	var mysql = require('mysql');
	this.conn = mysql.createConnection({
		host : "localhost" ,
		user : 'root',
		password : 'haanh@2016',
		database : 'goldminer',
	});



	this.result = require('./result.js');

	this.connect = function () {
		this.conn.connect();
	}
	this.close = function () {
		this.conn.end();
	}

	this.login = function (user_code, user_name, callBack) {
		var method = require('./login.js');
		method(user_code, user_name, this.result, this.conn, callBack)
	}
	this.getUserInfo = function (user_code, callBack) {
		require('./getUserInfo.js');
		method(user_code, this.result, pool, callBack);
	}
	this.getBag = function (user_code, callBack) {
		require('./bag.js')
	}
}

module.exports = new DB;