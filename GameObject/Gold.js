var CircleColl = require('../my_module/circleCollider.js');
var OnCollisionEnter = require("../my_module/onCollisionEnter.js");
var Timer = require ('../my_module/timer.js');


function Gold(name,value, position, rotation, status, iD) {
	this.name = name;
	this.value = value;
	this.position = position;
	this.rotation = rotation;
	this.status = status;
	this.iD = iD;
	var r = 0;
	if(this.name == "BigestGold"){r = 0.39;}
	if(this.name == "NormalGold"){r = 0.26;}
	if(this.name == "SmallGold"){r = 0.14;}
	if(this.name == "BigStone"){r = 0.31;}
	if(this.name == "SmallStone"){r = 0.3;}
	this.circleColl = new CircleColl(r, this.position.x, this.position.y);
}

Gold.prototype.setPos = function (position) {
	// body...
	this.position = position;
};

Gold.prototype.setRot = function (rotation) {
	// body...
	this.rotation = rotation;
}

Gold.prototype.update = function (hook, io, roomID) {
	//console.log(hook.circleColl.x);
	if(new OnCollisionEnter().isCollidingCC(this.circleColl, hook.circleColl) && this.status == "idle"){
		this.status = "catched";
		//hook.status = "Catched";
		hook.catched = {name:"Gold", ID:this.iD};

		hook.status = "movingUp";	
		hook.moveVec.x = 0 - parseFloat(hook.moveVec.x);
		hook.moveVec.y = Math.abs(hook.moveVec.y);
		if(hook.speedUp == 1){	
			hook.speedUp = 0.5;
		}

		var data = {ID:this.iD, code:hook.id};
		//console.log(data)
		io.to(roomID).emit("Gold:acceptCatch", data);
		//hook.moveUp();

		if(hook.owner == "Player1"){
			i = 1;
		}else{
			i = 2
		}
		//console.log(hook.pos);
		io.to(roomID).emit("updateState", {name:"HookUp",timeStamp:new Timer().SV_TIME(), ID:i, data:{
																	x:hook.moveVec.x,
																	y:hook.moveVec.y,
																	z:0, catched:"Gold"}});
	}
}

Gold.prototype.instantiate = function (io, roomID) {
	io.to(roomID).emit("Gold:instantiate", this);	
}

module.exports = Gold;