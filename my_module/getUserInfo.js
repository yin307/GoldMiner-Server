module.exports = function (user_code, result, pool, callBack) {
	var isEmpty = require('./stringHelper.js').isEmpty;
	if(isEmpty(user_code)){
		res.onInvalidParams("user_code");
		callBack(res);
	}else{
		pool.getConnecttion(function (err, conn){
			if(err){res.throwErr(err, callBack);}
			var sql = "SELECT * FROM user WHERE user_code='" + user_code + "'";
			conn.query(sql, function (err, data) {
				if(err){res.throwErr(err, callBack);}
				res.data = data;
				callBack(res);
			});
			conn.release();
		});
	}
}