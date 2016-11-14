var Item = require('./item.js');

function Bag() {
	this.items = []; //{item_id = BOM_NO, amount=2,item_description:description,item_name=Name}
	this.gems = 0 ;
}

Bag.prototype.loadItems = function (user_code, result, conn, callBack) {
	//console.log(result);
	var res = new result();
	var q = "SELECT bag.item_id, bag.amount, items.item_description, items.item_name FROM bag, items";
	q += " WHERE bag.item_id = items.item_id AND bag.user_code = '" + user_code + "'";
	//console.log(q);
	conn.query(q, function (e, d) {
		if(e)
		{
			//throw e;
			res.setValue(100, e, []); 
			callBack(res);
						//this.items = d;
		}else{						
			res.setValue(0, e, d);
			//this.items = d;
			callBack(res);
		}
	});
}

Bag.prototype.pushItems = function(data){
	var is = this.items;
	data.forEach(function(i){
		var it = new Item();
		it.name = i.item_name;
		it.id = i.item_id;
		it.amount = i.amount;
		it.description = i.item_description;
		is.push(it);
	});
	this.items = is;
}

Bag.prototype.loadGems = function (user_code, result, conn, callBack) {
	var res = new result();
	var q = "SELECT user_gem FROM user WHERE user_code = '" + user_code + "'";
	conn.query(q, function (e, d) {
		if(e)
		{
			res.setValue(100, e, []); 
			callBack(res);
		}else{						
			res.setValue(0, e, d);
			callBack(res);
		}
	});
}

Bag.prototype.useItem = function(user_code, item_id, conn){
	var i = this.getItem(item_id);
	if(i != null){
		if(this.items[i].amount > 0){
			this.items[i].amount --;
			this.syncItemToDBWhenUse(user_code, item_id, conn);
			return true;
		}
	}
	return false;		
}

Bag.prototype.syncItemToDBWhenUse = function (user_code, item_id, conn){
	var i = this.getItem(item_id);
	if(i != null){
		var q = "UPDATE bag SET amount = " + this.items[i].amount + "  WHERE user_code = '" + user_code + "' AND item_id = '" + item_id + "'";
		conn.query(q, function (e, d) {
			if(e){
				return;
			}else{
				//
			}
		});
	}
}

Bag.prototype.syncItemToDBWhenBuy = function (player, item_id, conn) {
	var q = "INSERT INTO bag SET user_code = '"+player.code+"', item_id='"+item_id+"', amount = 1";
	//console.log(q);
	conn.query(q, function (e, d) {
		if(e){
			//console.log(e);
			var u = "UPDATE bag SET amount = amount + 1 WHERE user_code = '"+player.code+"' AND item_id='"+item_id+"'";
			conn.query(u, function (ee, dd){
				//Success
				//console.log("Update");
			});
		}else{
			//succcess
			//console.log("INSERT");
		}
	});
}

Bag.prototype.syncGems = function (user_code, conn){
	var q = "UPDATE user SET user_gem = " + this.gems + " WHERE user_code = '" + user_code + "'";
	conn.query(q, function (e, d){
		//success
	});
}

Bag.prototype.getItem = function(item_id){
	var i = null;
	var is = this.items;
	for (var i = 0; i < is.length; i++) {
		if(is[i].id == item_id){
			return i;
		}
	}
}

Bag.prototype.addItem = function (newItem, player, conn) {
	var i = this.getItem(newItem.id);
	if(i == null){
		this.items.push(newItem);
	}else{
		this.items[i].amount ++;
	}
	//console.log(this);
	this.syncItemToDBWhenBuy(player, newItem.id, conn);
	this.syncGems(player.code, conn);
}

Bag.prototype.buyAItem = function (item_id) {
	// body...
}


module.exports = Bag;
