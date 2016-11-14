var Gold = require('./Gold.js');
var Vector3 = require('../my_module/vector3.js');
var Fish = require('./Fish.js');


function GoldGroup(Golds, Fishs) {
	this.Golds = Golds;
	this.Fishs = Fishs;
	this.GoldClear = 0;
}



GoldGroup.prototype.instantiate = function (io, roomID) {

	io.to(roomID).emit("Gold:instantiate", {data:this.Golds});

	io.to(roomID).emit("Fish:instantiate", {data:this.Fishs});
}

GoldGroup.prototype.isClear = function () {
	return (this.GoldClear == Object.keys(this.Golds).length);
}
GoldGroup.prototype.increaGoldClear = function (value) {
	this.GoldClear += value;
	console.log(this.GoldClear + "/" + Object.keys(this.Golds).length);
}

GoldGroup.prototype.startFishs = function (io, roomID) {
	this.Fishs.forEach(function (item) {
		if(item != null){
			item.start(io, roomID);
		}
	});
}

GoldGroup.prototype.MoveFish = function (io, roomID) {
		for (var i = Object.keys(this.Fishs).length - 1; i >= 0; i--) {
		this.Fishs[i].Move(io, roomID);
	}

	/*this.Fishs.forEach(function (item) {
		if(item != null){
			item.Move(io, roomID);
		}
	});*/
}

GoldGroup.prototype.OnCollision_Fish = function(io, ID, hook){

	for (var i = Object.keys(this.Fishs).length - 1; i >= 0; i--) {
		this.Fishs[i].OnCollisionEnterHook(io, ID, hook);
	}
	/*this.Fishs.forEach(function (item) {
		if(item != null){
			item.OnCollisionEnterHook(io, ID, hook);
		}
	});*/
}

GoldGroup.prototype.updateGolds = function (hook, io, roomID) {
	for (var i = Object.keys(this.Golds).length - 1; i >= 0; i--) {
		this.Golds[i].update(hook, io, roomID);
	}
}

GoldGroup.prototype.initGolds = function(type) {
	var golds = [];
	if(type == 0){
		golds[0] = new Gold("BigestGold",200, new Vector3(-0.5, -1.64, 0), Vector3.zero, "idle", 0);
		golds[1] = new Gold("NormalGold",100, new Vector3(1.8, -1.64, 0), Vector3.zero, "idle", 1);
		golds[2] = new Gold("SmallGold",50, new Vector3(-6.3, -2.8, 0), Vector3.zero, "idle", 2);
		golds[3] = new Gold("SmallGold",50, new Vector3(3.1, -0.97, 0), Vector3.zero, "idle", 3);		
		golds[4] = new Gold("NormalGold",100, new Vector3(-6, -0.57, 0), Vector3.zero, "idle", 4);
		golds[5] = new Gold("BigestGold",200, new Vector3(4.56, -3.37, 0), Vector3.zero, "idle", 5);
		golds[6] = new Gold("BigStone",50, new Vector3(-3.41, -0.25, 0), Vector3.zero, "idle", 6);
		golds[7] = new Gold("SmallStone",20, new Vector3(0.72, -0.91, 0), Vector3.zero, "idle", 7);
		golds[8] = new Gold("SmallStone",20, new Vector3(5.12, -1.73, 0), Vector3.zero, "idle", 8);
		golds[9] = new Gold("SmallGold",50, new Vector3(6.05, 0.65, 0), Vector3.zero, "idle", 9);
		golds[10] = new Gold("NormalGold",100, new Vector3(-3.52, -3.79, 0), Vector3.zero, "idle", 10);
		golds[11] = new Gold("BigStone",50, new Vector3(2.22, -3.12, 0), Vector3.zero, "idle", 11);
		golds[12] = new Gold("SmallGold",50, new Vector3(3.5, -1.74, 0), Vector3.zero, "idle", 12);
	}
	if(type == 1){
		golds[0] = new Gold("NormalGold",100, new Vector3(3.1, -3.2, 0), Vector3.zero, "idle", 0);
		golds[1] = new Gold("NormalGold",100, new Vector3(-4, -3.2, 0), Vector3.zero, "idle", 1);
		golds[2] = new Gold("SmallStone",20, new Vector3(5.8, -0.32, 0), Vector3.zero, "idle", 2);
		golds[3] = new Gold("SmallStone",20, new Vector3(-6, -0.56, 0), Vector3.zero, "idle", 3);
		golds[4] = new Gold("NormalGold",100, new Vector3(-0.4, -1.34, 0), Vector3.zero, "idle", 4);
		golds[5] = new Gold("SmallGold",50, new Vector3(1.3, 0.76, 0), Vector3.zero, "idle", 5);
		golds[6] = new Gold("SmallGold",50, new Vector3(-1.76, 0.76, 0), Vector3.zero, "idle", 6);
		golds[7] = new Gold("SmallGold",50, new Vector3(-5.35, 0.83, 0), Vector3.zero, "idle", 7);
		golds[8] = new Gold("BigStone",50, new Vector3(2.7, -1, 0), Vector3.zero, "idle", 8);
		golds[9] = new Gold("BigestGold",200, new Vector3(6, -2.4, 0), Vector3.zero, "idle", 9);
		golds[10] = new Gold("BigestGold",200, new Vector3(-0.39, -3.7, 0), Vector3.zero, "idle", 10);
		golds[11] = new Gold("SmallGold",200, new Vector3(4.5, 0.73, 0), Vector3.zero, "idle", 11);
		golds[12] = new Gold("BigStone",50, new Vector3(-2.9, -1, 0), Vector3.zero, "idle", 12);
		golds[13] = new Gold("BigestGold",200, new Vector3(-6.4, -2.44, 0), Vector3.zero, "idle", 13);
	}
	if(type == 3){
		gold[0] = new Gold('NormalGold',100, new Vector3(4.38,-1.13,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('BigestGold',200, new Vector3(-6.62,-3.13,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('SmallGold',50, new Vector3(-5.62,0.87,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(3.38,0.87,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallStone',20, new Vector3(2.38,-0.13,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(-0.62,-1.13,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('NormalGold',100, new Vector3(-4.62,-1.13,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('BigStone',50, new Vector3(-1.62,-0.13,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('BigestGold',200, new Vector3(1.38,-2.13,0), Vector3.zero,'idle', 8);
	}
	if(type == 4){
		gold[0] = new Gold('SmallStone',20, new Vector3(-0.221848,-0.7141676,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('BigestGold',200, new Vector3(4.35,-3.72,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('NormalGold',100, new Vector3(-4.99,-0.94,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('BigestGold',200, new Vector3(-6.62,-3.13,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallGold',50, new Vector3(-5.62,0.87,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(6.45,-0.01,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallStone',20, new Vector3(3.88,-1.44,0), Vector3.zero,'idle', 6);        
		gold[7] = new Gold('SmallGold',50, new Vector3(3.14,-0.5,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(-2.46,-2.96,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigStone',50, new Vector3(-2.97,-1.24,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('BigestGold',200, new Vector3(1.38,-2.13,0), Vector3.zero,'idle', 10);    
	}
	if(type = 5){
		gold[0] = new Gold('BigestGold',200, new Vector3(5.39,-2.69,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('BigStone',50, new Vector3(-2.97,-1.24,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('NormalGold',100, new Vector3(-2.46,-2.96,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(3.14,-0.5,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallStone',20, new Vector3(3.88,-1.44,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(6.45,-0.01,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallGold',50, new Vector3(-5.62,0.87,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('BigestGold',200, new Vector3(-4.68,-2.57,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(-4.99,-0.94,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigestGold',200, new Vector3(0.41,-3.59,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('SmallStone',20, new Vector3(-0.221848,-0.7141676,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('NormalGold',100, new Vector3(6.73,-1.66,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('NormalGold',100, new Vector3(-6.42,-1.72,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('SmallStone',20, new Vector3(-3.86,0.12,0), Vector3.zero,'idle', 13);         
		gold[14] = new Gold('BigStone',50, new Vector3(5.160658,-0.526406,0), Vector3.zero,'idle', 14);              
	}
	if(type == 6){
		gold[0] = new Gold('BigestGold',200, new Vector3(4.7,-3.5,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('BigStone',50, new Vector3(-0.15,-1.06,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('NormalGold',100, new Vector3(2.93,-2.9,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(0.88,-1.63,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallStone',20, new Vector3(4.13,-2.19,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(2.32,-0.64,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallGold',50, new Vector3(-7.37,-2.64,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('BigestGold',200, new Vector3(-1.54,-3.95,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(-2.73,-2.63,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigestGold',200, new Vector3(-5.1,0.11,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('SmallStone',20, new Vector3(0.34,-2.84,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('NormalGold',100, new Vector3(-5.81,-3.73,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('NormalGold',100, new Vector3(5.93,-1.34,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('SmallStone',20, new Vector3(-5.74,-1.76,0), Vector3.zero,'idle', 13);         
		gold[14] = new Gold('BigStone',50, new Vector3(5.22,-0.03,0), Vector3.zero,'idle', 14);         
		gold[15] = new Gold('SmallStone',20, new Vector3(-2.49,-0.98,0), Vector3.zero,'idle', 15);         
	}
	if(type == 7){
		gold[0] = new Gold('BigestGold',200, new Vector3(6.67,-2.56,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('BigStone',50, new Vector3(-4.79,0.12,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('NormalGold',100, new Vector3(2.93,-2.9,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(-1.98,-0.5,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallStone',20, new Vector3(4.13,-2.19,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(3.55,-1.13,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallGold',50, new Vector3(-4.36,-3.73,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('BigestGold',200, new Vector3(-5.19,-1.73,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(-2.73,-2.63,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('SmallStone',20, new Vector3(0.34,-2.84,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('NormalGold',100, new Vector3(0.6,-2,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('NormalGold',100, new Vector3(5.93,-1.34,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('SmallStone',20, new Vector3(-0.02,-1.22,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('BigStone',50, new Vector3(5.57,0.02,0), Vector3.zero,'idle', 13);         
		gold[14] = new Gold('SmallStone',20, new Vector3(-1.36,-1.33,0), Vector3.zero,'idle', 14);         
		gold[15] = new Gold('BigStone',50, new Vector3(2.190486,-0.4866217,0), Vector3.zero,'idle', 15);   
	}
	if(type == 8){
		gold[0] = new Gold('BigestGold',200, new Vector3(-1.805548,-2.805309,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('SmallGold',50, new Vector3(-1.854883,-0.7826242,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('SmallStone',20, new Vector3(0.5131391,-1.078627,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('NormalGold',100, new Vector3(1.943819,-2.262637,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallStone',20, new Vector3(6.531858,-1.670632,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('BigStone',50, new Vector3(-4.321571,-1.670632,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallStone',20, new Vector3(-6.245588,-1.719966,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('SmallStone',20, new Vector3(-0.8682074,-1.670632,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(-4.124236,-3.397314,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('SmallGold',50, new Vector3(3.571832,-1.177294,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('SmallGold',50, new Vector3(6.679859,-0.04261798,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('SmallGold',50, new Vector3(2.23982,-1.029293,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('SmallGold',50, new Vector3(-0.0295338,-2.805309,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('SmallGold',50, new Vector3(-2.693556,-1.473297,0), Vector3.zero,'idle', 13);         
		gold[14] = new Gold('BigestGold',200, new Vector3(4.311838,-3.249313,0), Vector3.zero,'idle', 14);         
		gold[15] = new Gold('BigStone',50, new Vector3(3.8185,-0.2399529,0), Vector3.zero,'idle', 15);         
		gold[16] = new Gold('BigestGold',200, new Vector3(-4.222903,0.006715894,0), Vector3.zero,'idle', 16);         
	}
	if(type == 9){
		gold[0] = new Gold('SmallGold',50, new Vector3(0.7557612,-2.068022,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('NormalGold',100, new Vector3(-0.1975819,-2.774202,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('SmallGold',50, new Vector3(3.439249,-1.432459,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(2.203432,-0.9734415,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallGold',50, new Vector3(-5.07023,-2.774202,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(-5.034921,-1.891477,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallStone',20, new Vector3(-4.258122,-0.8675143,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('SmallStone',20, new Vector3(4.004194,-1.891477,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('SmallStone',20, new Vector3(0.5439077,-0.549733,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigStone',50, new Vector3(-1.115618,-0.1613335,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('BigStone',50, new Vector3(5.24001,-1.079369,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('BigestGold',200, new Vector3(2.415287,-2.103331,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('BigestGold',200, new Vector3(-3.763795,-2.350494,0), Vector3.zero,'idle', 12); 
	}
	if(type == 10){
		gold[0] = new Gold('BigStone',50, new Vector3(0.08488935,0.0152117,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('SmallGold',50, new Vector3(-3.97565,-2.738894,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('SmallGold',50, new Vector3(3.015541,-2.950747,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(5.063465,-0.9381323,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallGold',50, new Vector3(-4.540595,-0.8675143,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(2.026887,-0.1966426,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallGold',50, new Vector3(-1.786489,-0.3731878,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('NormalGold',100, new Vector3(0.7557611,-1.255914,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(-0.7625271,-1.255914,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigestGold',200, new Vector3(-0.30351,-2.986057,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('SmallStone',20, new Vector3(6.405208,-0.7968962,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('SmallStone',20, new Vector3(-5.599866,-0.5144239,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('BigStone',50, new Vector3(3.121467,-1.149987,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('BigStone',50, new Vector3(-3.057615,-1.220605,0), Vector3.zero,'idle', 13);         
		gold[14] = new Gold('BigestGold',200, new Vector3(5.628409,-2.527039,0), Vector3.zero,'idle', 14);         
		gold[15] = new Gold('BigestGold',200, new Vector3(-5.423321,-1.856167,0), Vector3.zero,'idle', 15);                 
	}
	if(type == 11){
		gold[0] = new Gold('SmallStone',20, new Vector3(1.179471,0.1917569,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('SmallStone',20, new Vector3(-0.9390723,0.08582997,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('SmallGold',50, new Vector3(3.02,0.2976838,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(-2.7,0.08582997,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallStone',20, new Vector3(4.533829,0.4036112,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallStone',20, new Vector3(-4.823067,-0.09071523,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('NormalGold',100, new Vector3(-6.482592,-1.04406,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('NormalGold',100, new Vector3(6.228663,-0.7262782,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('NormalGold',100, new Vector3(0.332053,-1.008751,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigStone',50, new Vector3(3.545176,-1.64,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('BigStone',50, new Vector3(-2.669215,-1.79,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('BigestGold',200, new Vector3(5.663718,-3.37,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('BigestGold',200, new Vector3(0.5439077,-3.34,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('BigestGold',200, new Vector3(-6.058883,-3.37,0), Vector3.zero,'idle', 13);         
	}
	if(type == 12){
		gold[0] = new Gold('BigestGold',200, new Vector3(3.304622,-4.032836,0), Vector3.zero,'idle', 0);         
		gold[1] = new Gold('BigestGold',200, new Vector3(-2.014117,-3.831368,0), Vector3.zero,'idle', 1);         
		gold[2] = new Gold('SmallGold',50, new Vector3(7.374263,0.9232624,0), Vector3.zero,'idle', 2);         
		gold[3] = new Gold('SmallGold',50, new Vector3(7.374263,-0.6481833,0), Vector3.zero,'idle', 3);         
		gold[4] = new Gold('SmallGold',50, new Vector3(7.454852,-2.34051,0), Vector3.zero,'idle', 4);         
		gold[5] = new Gold('SmallGold',50, new Vector3(-7.050803,0.4397404,0), Vector3.zero,'idle', 5);         
		gold[6] = new Gold('SmallGold',50, new Vector3(-7.091096,-0.8093574,0), Vector3.zero,'idle', 6);         
		gold[7] = new Gold('SmallGold',50, new Vector3(-7.091096,-2.34051,0), Vector3.zero,'idle', 7);         
		gold[8] = new Gold('BigestGold',200, new Vector3(3.304622,0,0), Vector3.zero,'idle', 8);         
		gold[9] = new Gold('BigestGold',200, new Vector3(-1.93353,-0.08,0), Vector3.zero,'idle', 9);         
		gold[10] = new Gold('BigestGold',200, new Vector3(-2.014117,-1.94,0), Vector3.zero,'idle', 10);         
		gold[11] = new Gold('BigestGold',200, new Vector3(3.224036,-2.02,0), Vector3.zero,'idle', 11);         
		gold[12] = new Gold('SmallStone',20, new Vector3(5.41,-3.833474,0), Vector3.zero,'idle', 12);         
		gold[13] = new Gold('SmallStone',20, new Vector3(5.48,-1.609004,0), Vector3.zero,'idle', 13);         
		gold[14] = new Gold('SmallStone',20, new Vector3(5.55,0.5448474,0), Vector3.zero,'idle', 14);         
		gold[15] = new Gold('SmallStone',20, new Vector3(-4.5,-3.762856,0), Vector3.zero,'idle', 15);         
		gold[16] = new Gold('SmallStone',20, new Vector3(-4.6,-1.609004,0), Vector3.zero,'idle', 16);         
		gold[17] = new Gold('SmallStone',20, new Vector3(-4.57,0.2976838,0), Vector3.zero,'idle', 17);         
		gold[18] = new Gold('BigStone',50, new Vector3(0.6498345,-3.868783,0), Vector3.zero,'idle', 18);         
		gold[19] = new Gold('BigStone',50, new Vector3(0.7557612,-1.644313,0), Vector3.zero,'idle', 19);         
		gold[20] = new Gold('BigStone',50, new Vector3(0.7204522,0.4389204,0), Vector3.zero,'idle', 20);   
	}
	this.Golds = golds;
};

GoldGroup.prototype.initFishs = function () {
	var fishs = [];
	fishs[0] = new Fish("blueFish",100, new Vector3(6, 0, 0), new Vector3(0, 0, 0),new Vector3(-0.01, 0, 0), new Vector3(1, 1, 1), 0);
	fishs[1] = new Fish("orangeFish",100, new Vector3(6, -3, 0), new Vector3(0, 0, 0),new Vector3(-0.01, 0, 0), new Vector3(1, 1, 1), 1);;

	this.Fishs = fishs;

};

module.exports = GoldGroup;