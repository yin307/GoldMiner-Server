var Item = require('../GameObject/item.js');

function Shop() {
	this.items = [];
}

Shop.prototype.loadItems = function(result, conn, callBack) {
	var res = new result();
	var q = "SELECT * FROM items";
	conn.query(q, function (e, d) {
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
	});
};

Shop.prototype.buyItem = function(player, item_id, conn){
	var i = this.getItem(item_id);	
	if(player.bag.gems >= this.items[i].price){
		player.bag.gems -= this.items[i].price;
		this.items[i].amount = 1;
		player.bag.addItem(this.items[i], player, conn);
		return true;
	}else{return false;}
}

Shop.prototype.getItem = function(item_id){	
	for (var i = this.items.length - 1; i >= 0; i--) {		
		if(this.items[i].id == item_id){
			return i;
		}
	}

}

module.exports = Shop;