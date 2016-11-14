module.exports = function (user_code, user_name, result, conn, callBack) {
	var isEmpty = require('./stringHelper.js').isEmpty;
	var res = new result();
	if(isEmpty(user_name) || isEmpty(user_code)){
		res.onIvalidParams("user_name, user_code");
		callBack(res);
	}else{
			var queryLogin = "INSERT INTO user SET user_code='" + user_code + "', user_name=N'" + user_name + "', created=NOW()";
			//console.log(queryLogin);
			conn.query(queryLogin, function (err, data) {		
			if(err){
				//console.log(err);
			}
				res.setValue(0, 'success', {user_code:user_code, user_name:user_name});
				callBack(res);
			});			
	}
}