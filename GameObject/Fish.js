
var Vector3 = require('../my_module/vector3.js');
var Transform =  new (require('../my_module/transform.js'))();
var Timer =  require('../my_module/timer.js');
var BoxCollider = require('../my_module/boxcollider.js');
var OnCollisionEnter = require("../my_module/onCollisionEnter.js");
var Timer = require ('../my_module/timer.js');


function Fish(name, value, position, rotation,moveVec, scale, iD) {
	this.name = name;
	this.value = value;
	this.position = position;
	this.rotation = rotation;
	this.scale = scale;
	this.iD = iD;
	this.moveVec = moveVec;
	this.status = "idle";
	this.startTime = new Timer().SV_TIME();
	this.switchTime = Math.floor((Math.random() * 6) + 1) * 1000;
	this.boxColl = new BoxCollider(0.56, 0.42, this.position.x, this.position.y);
}

Fish.prototype.setPos = function (position) {
	this.position = position;
};

Fish.prototype.setRot = function (rotation) {
	this.rotation = rotation;
};

Fish.prototype.getPos = function () {
	return this.position;
};

Fish.prototype.start = function (io, roomID) {
//	io.to(roomID).emit("Fish:startMove");
	this.status = "swimming";
	this.startTime = new Timer().SV_TIME();
};

Fish.prototype.Move = function (io, roomID) {
	if(this.status == "swimming"){		
		this.position = new Vector3(parseFloat(this.position.x) + parseFloat(this.moveVec.x)
							, parseFloat(this.position.y) + parseFloat(this.moveVec.y), 0);

		this.boxColl.x = this.position.x;
		this.boxColl.y = this.position.y;

		if(this.position.x < -9 || this.position.x > 9){
			//console.log("so far");
			var r = Math.floor((Math.random() * 2) + 0);
			r = 0;
			if(r == 0){
				this.moveVec.x = - this.moveVec.x;
				this.scale.x = - this.scale.x;
				this.rotation.z = 0 - parseFloat(this.rotation.z);
			}

			if(r == 1){
				if(this.position.x < 0){
					this.moveVec.x = Math.abs(this.moveVec.x);
					this.moveVec.y = 0;
					this.rotation = new Vector3(0, 0, 0);
					this.scale.x = -1;
				}
			}
			this.syncFish(io, roomID);
		}

		var passTime = new Timer().SV_TIME() - this.startTime;
		if(passTime >= this.switchTime){
			//console.log("5s passed swith move");
			this.startTime = new Timer().SV_TIME();
			if(this.position.x >= -6 && this.position.x <= 6){
				if(this.moveVec.x < 0){
					var r = Math.floor((Math.random() * 2) + 0);
					if(r == 0){this.swap_LeftUp();}
					if(r == 1){this.swap_LeftDown();}
				}else if(this.moveVec.x > 0){
					var r = Math.floor((Math.random() * 2) + 0);
					if(r == 0){this.swap_RightUp();}
					if(r == 1){this.swap_RightDown();}
				}
			}
			this.syncFish(io, roomID);
			
		}

		if(this.position.y >= 1.5 || this.position.y <= -5 ){

			this.moveVec.y = 0 - parseFloat(this.moveVec.y);
			this.rotation.z = 0 - parseFloat(this.rotation.z);
			//console.log("so hight");
			this.syncFish(io, roomID);
		}
		
	}
	
	
	//this.position.log();
};

Fish.prototype.OnCollisionEnterHook = function(io, ID, hook){
	if(new OnCollisionEnter().isCollidingRC(this.boxColl, hook.circleColl) 
		&& (this.status == "idle" || this.status == "swimming") && hook.status == "movingDown"){
		this.status = "catched";
		
		hook.catched = {name:"Fish", ID:this.iD};

		hook.status = "movingUp";	
		hook.moveVec.x = 0 - parseFloat(hook.moveVec.x);
		hook.moveVec.y = 0 - parseFloat(hook.moveVec.y);

		var data = {ID:this.iD, code:hook.id};
		io.to(ID).emit("Fish:acceptCatch", data);

		if(hook.owner == "Player1"){i = 1;}else{i = 2;}
		io.to(ID).emit("updateState", {name:"HookUp",timeStamp:new Timer().SV_TIME(), ID:i, data:{
																	x:hook.moveVec.x,
																	y:hook.moveVec.y,
																	z:0, catched:"Gold"}});
		//console.log("Cacthed " + this.name + " " + this.iD);
		//console.log("push to gold follow hook");
	}
}

Fish.prototype.swap_LeftUp = function () {
	this.scale = new Vector3 (1, 1, 1);
	this.moveVec = new Vector3 (-Math.abs(this.moveVec.x), Math.abs(this.moveVec.x), 0);
	this.rotation = new Vector3 (0, 0, -45);
	//console.log("swap left up");
};

Fish.prototype.swap_LeftDown = function  () {
	this.scale = new Vector3 (1, 1, 1);
	this.moveVec = new Vector3 (-Math.abs(this.moveVec.x), -Math.abs(this.moveVec.x), 0);
	this.rotation = new Vector3 (0, 0, 45);
	//console.log("swap left down");
};

Fish.prototype.swap_RightUp = function () {
	this.scale = new Vector3 (-1, 1, 1);
	this.moveVec = new Vector3 (Math.abs(this.moveVec.x), Math.abs(this.moveVec.x), 0);
	this.rotation = new Vector3 (0, 0, 45);
	//console.log('swap right up');
};

Fish.prototype.swap_RightDown = function () {
	this.scale = new Vector3 (-1, 1, 1);
	this.moveVec = new Vector3 (Math.abs(this.moveVec.x), -Math.abs(this.moveVec.x), 0);
	this.rotation = new Vector3 (0, 0, -45);
	//console.log('swap right down');
};

Fish.prototype.syncFish = function (io, roomID) {
	io.to(roomID).emit("Fish:updateFish", this);
};

Fish.prototype.instantiate = function (io, roomID) {	
	io.to(roomID).emit("Fish:instantiate", this);
};

module.exports = Fish;