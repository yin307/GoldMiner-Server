var Vector3 = require('../my_module/vector3.js');
var Transform =  new (require('../my_module/transform.js'))();
var BoxCollider = require('../my_module/boxcollider.js');
var OnCollisionEnter = require("../my_module/onCollisionEnter.js");
var CircleColl = require('../my_module/circleCollider.js');
var Timer = require ('../my_module/timer.js');


function Hook(owner, pos, id) {
	this.id = id;
	this.owner = owner;
	this.status = "idle";
	this.pos = pos;
	this.rotate = new Vector3(0,0,0);
	this.speedUp = 1;
	this.speedDown = 2;	
	this.moveVec = null;
	this.maxX = 8;
	this.maxY = -4;
	this.startPos = this.pos;
	this.update = null;
	this.catched = null;	
	//this.boxColl = new BoxCollider(0.39, 0.2, this.pos.x, this.pos.y);
	this.circleColl = new CircleColl(0.33, this.pos.x, this.pos.y);
}

Hook.prototype.updateHook = function(s, p, r, spu, spd) {
	this.status = s;
	this.pos = p;
	this.rotate = r;
	this.speedUp = spu;
	this.speedDown = spd;
};

Hook.prototype.pushState = function (data, io, roomId) {
	io.to(roomId).emit("HookState", data);
}

Hook.prototype.start = function (argument) {
	//this.update = setInterVal();
}



Hook.prototype.moveDown = function (io, id) {
	this.pos = new Vector3(parseFloat(this.pos.x) + (parseFloat(this.moveVec.x)), parseFloat(this.pos.y) + (parseFloat(this.moveVec.y)), 0);
	this.circleColl.x = this.pos.x;
	this.circleColl.y = this.pos.y;
	if(this.pos.y < this.maxY || Math.abs(this.pos.x) > this.maxX){
		//console.log(this.maxX + "  " + this.maxY);
		this.status = "movingUp";	
		this.moveVec.x = 0 - parseFloat(this.moveVec.x);
		this.moveVec.y = Math.abs(this.moveVec.y);
		//if()
		var i;
		if(this.owner == "Player1"){
			i = 1;
		}else{
			i = 2;
		}
		//console.log(this.pos);
		io.to(id).emit("updateState", {name:"HookUp",timeStamp:new Timer().SV_TIME(), ID:i, data:{
																	x:this.moveVec.x, 
																	y:this.moveVec.y, 
																	z:0,
																	catched:""}});
		console.log("up");
	}	

	var c = this.circleColl;
	var z = this.rotate.z

}

Hook.prototype.moveUp = function (io, id, gg, player) {	
	//console.log(this.speedUp);
	this.pos = new Vector3(parseFloat(this.pos.x) + (parseFloat(this.moveVec.x) * parseFloat(this.speedUp)), parseFloat(this.pos.y) + (parseFloat(this.moveVec.y) * parseFloat(this.speedUp)), 0);
	var i;
	if(this.owner == "Player1"){
		i = 1;
	}else{
		i = 2;
	}

	if(this.pos.y > this.startPos.y){
		if(this.speedUp < 1){		
			this.speedUp = 1;
		}
		this.pos = this.startPos;
		this.status = "idle";		
		if(this.catched != null){
			if(this.catched.name == "Gold"){
				gg.Golds[this.catched.ID].status = "Done";
				gg.increaGoldClear(1);
				var extra = 0;
				if(player.usedClover){
					extra = 100;
				}
				player.score = parseInt(player.score) + parseInt(gg.Golds[this.catched.ID].value) + parseInt(extra);
				this.catched = null;
				console.log("Done");
			}
		}
		console.log("rot");
	}
	this.circleColl.x = this.pos.x;
	this.circleColl.y = this.pos.y;
	//this.pos.log();
	//console.log(this.boxColl.x);
}

Hook.prototype.updateHook = function (io, id, gg, player){

	if(this.status == "movingDown"){
		this.moveDown(io, id);
	}
	if(this.status == "movingUp"){
		this.moveUp(io, id, gg, player);
	}
}
module.exports = Hook;