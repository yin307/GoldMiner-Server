var Vector3 = require('../my_module/vector3.js');
var Hook = require('./Hook.js');
var Bag = require('./bag.js');
var Timer = require("../my_module/timer.js");

function Player(iD, name, status, pos) {
	// body...
	this.name = name;
	this.code = "";
	this.status = status;
	this.pos = pos;
	this.score = 0;
	this.iD = iD;
	this.roomID = "";
	this.profilePic = "";
	this.hook = null;	
	this.input = null;
	this.bag = new Bag();
	this.usedClover = false;

}
Player.prototype.setHook = function () {
	if(this.pos == 1){
		this.hook = new Hook("Player1", new Vector3(-3.2, 3.1, 0), this.iD);
		//console.log(this.hook);
	}
	if(this.pos == 2){
		this.hook = new Hook("Player2", new Vector3(2.8, 3.1 , 0), this.iD);
		//console.log(this.hook);
	}
}

Player.prototype.update = function (io, id, GG) {
	this.hook.updateHook(io, id, GG, this);
}
Player.prototype.setName = function(name) {
	// body...
	this.name = name;
};

Player.prototype.setStatus = function(status) {
	// body...
	this.status = status;
};

Player.prototype.setPos = function(pos) {
	// body...
	this.pos = pos;
};

Player.prototype.isReady = function () {
	// body...
	return (status == "ready");
}

Player.prototype.setScore = function (value) {
	this.score = value;
}

Player.prototype.receiveNewInput = function (input) {
	this.input.push(input);
}

Player.prototype.startGame = function(io, roomID, conn){
	if(this.bag.useItem(this.code, "CLOVER", conn)){
		this.usedClover = true;
		io.to(roomID).emit("updateState", {name:"UseClover", timeStamp:new Timer().SV_TIME, ID:this.pos});
	}else{
		this.usedClover = false;	
	}
}

Player.prototype.pushHookState = function(state, io){
	this.Hook.pushState(state, io, this.roomID);
}

Player.prototype.useSpinach = function(io, roomID, conn){
	if(this.bag.useItem(this.code, "SPINACH", conn)){
		io.to(roomID).emit("updateState", {name:"UseSpinach", timeStamp:new Timer().SV_TIME(), ID:this.pos});					
		this.hook.speedUp = 2;
		var end = setTimeout(function () {
			this.hook.speedUp = 1;
		}.bind(this), 10000);
	}	
}



Player.prototype.dropBoom = function(io, roomID){
	//console.log(this.hook.status + " " + this.hook.catched);
	if(this.hook.status == "movingUp" && this.hook.catched != null){
		io.to(roomID).emit("updateState", {name:"DropBoom", timeStamp:new Timer().SV_TIME(), ID:this.pos});

		//Drop boom on SV;
		this.hook.speedUp = 1;
		this.hook.catched = null;
	}
}

Player.prototype.dropHook = function(io, curState, roomID){
	//console.log("Do drop " + this.hook.status);
	if(this.hook.status == 'idle'){						
		this.hook.status = "movingDown";
		var y = -0.06;
		var x = Math.abs(y) * Math.tan((curState.data.z/180)*Math.PI);
		x = x.toFixed(2);
		io.to(roomID).emit("updateState", {name:"HookDrop",timeStamp:new Timer().SV_TIME(), ID:this.pos, data:{x:x,y:y,z:curState.data.z}});
		//this.io.to(this.ID).emit("updateState", {name:"HookCancelRot", ID:curState.ID, data:{z:curState.data.z}});					
		this.hook.moveVec = new Vector3(x, y, 0);
		this.hook.rotate.z = curState.data.z;
	}
}

Player.prototype.buyItem = function(item_id, shop, conn, socket){
	if(shop.buyItem(this, item_id, conn)){
		socket.emit("BuyItem",{code:item_id, gem:this.bag.gems});
		//console.log("Buy success " + item_id);
	}
}
module.exports = Player;