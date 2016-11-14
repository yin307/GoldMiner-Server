var GoldGroup = require('./GoldGroup.js');
var Vector3 = require('../my_module/vector3.js');
var Timer = require("../my_module/timer.js");
var OnCollisionEnter = require("../my_module/onCollisionEnter.js");


function Room(name,ID, Player1, Player2, status, type, io) {
	// body...
	this.maxGroupGold = 12;
	this.name = name;
	this.ID = ID;
	this.Player1 = Player1;
	this.Player2 = Player2;
	this.status = status;
	this.type = type;

	this.goldGroupIndex = Math.floor((Math.random() * this.maxGroupGold) + 0);
	//console.log("==" + goldGroupIndex);
	this.GoldGroups = new GoldGroup(null, null);
	this.GoldGroups.initGolds(this.goldGroupIndex);
	this.GoldGroups.initFishs();
	this.start = null;
	this.curState = null;
	this.stateStatus = "";
	this.input = [];
	this.io = io;
	this.update = null;
}
Room.prototype.setStatus = function (status) {
	this.status = status;
	//console.log(status);
}
Room.prototype.receiveInput = function (input) {
	this.input.push(input);
	// /console.log(this.input.name);
}



Room.prototype.startGame = function (conn) {
	//this.GoldGroups.Fishs[0].start(this.io, this.ID);
	this.io.to(this.ID).emit("Fish:startMove");
	this.Player1.startGame(this.io, this.ID, conn);
	this.Player2.startGame(this.io, this.ID, conn);
	console.log("start rooms");
}

Room.prototype.updateGame = function(conn) {
	//console.log("aaaaaaaaa");
	var curState = null;
	var i = 0;		
	for(var i = 0; i < Object.keys(this.input).length; i ++){
		curState = this.input[i];
		if(curState != null){
			//HANDLE DROP HOOK INPUT										
			if(curState.getName() == "HookDrop"){
				//console.log(curState);
				if(curState.ID == 1){					
					this.Player1.dropHook(this.io, curState, this.ID);
				}else{		
					this.Player2.dropHook(this.io, curState, this.ID);
				}
			}

			//HANDLE DROP BOOM INPUT
			if(curState.getName() == "DropBoom"){
				//console.log(curState);
				if(curState.ID == 1){
					this.Player1.dropBoom(this.io, this.ID);					
				}else{
					this.Player2.dropBoom(this.io, this.ID);
				}
			}

			//HANDLE USE SPINACH INPUT
			if(curState.getName() == "UseSpinach"){
				if(curState.ID == 1){
					this.Player1.useSpinach(this.io, this.ID, conn);
				}
				else{
					this.Player2.useSpinach(this.io, this.ID, conn);
				}
			}		
		this.input.splice(i, 1);
		}
	}
	//input = [];
	this.input = [];

	this.GoldGroups.MoveFish(this.io, this.ID);
	if(this.Player1 != null && this.Player2 != null && this.GoldGroups != null){	
		this.Player1.update(this.io, this.ID, this.GoldGroups);
		this.Player2.update(this.io, this.ID, this.GoldGroups);
		if(this.Player1.hook.status == "movingDown")
		{			
			this.GoldGroups.OnCollision_Fish(this.io, this.ID, this.Player1.hook);
			//this.GoldGroups.OnCollision_Fish(this.io, this.ID, this.Player2.hook);
			
			this.GoldGroups.updateGolds(this.Player1.hook, this.io, this.ID);
			//this.GoldGroups.updateGolds(this.Player2.hook, this.io, this.ID);
		}
		if(this.Player2.hook.status == "movingDown")
		{			
			this.GoldGroups.OnCollision_Fish(this.io, this.ID, this.Player2.hook);
			//this.GoldGroups.OnCollision_Fish(this.io, this.ID, this.Player2.hook);
			
			this.GoldGroups.updateGolds(this.Player2.hook, this.io, this.ID);
			//this.GoldGroups.updateGolds(this.Player2.hook, this.io, this.ID);
		}
	}
}

function test() {
	for (var i = 0; i < 10; i++) {
		console.log(i);
		}
}
function sortInput(input) {
	for (var i = 0; i < input.lenght - 1; i++){
		nput[i] = input[i + 1];
	}	
}
function pushState (data) {
	this.io.to(this.ID).emit("updateState", data);
}

Room.prototype.joinRoom = function(player) {
	// body...
	if(this.status == "idle"){
		if(this.Player1 == null){
			this.Player1 = player;
			return 1;
		}else if(this.Player2 == null){
			this.Player2 = player;
			return 2;
		}else{
			return 0;
		}
	}else
	{
		return 3;
	}
}

Room.prototype.getRoomInfor = function () {
	// body...
	var count = 0;
	if(this.Player1 != null){
		count ++;
	}
	if(this.Player2 != null){
		count ++;
	}

	return count;
}

Room.prototype.isReady  = function () {
	// body...
	return (this.Player1 != null && this.Player2 != null && this.Player1.status == "ready" && this.Player2.status == "ready")
}

Room.prototype.playerReady = function (pos) {
	// body...
	if(pos == 1){
		this.Player1.status = "ready";
	}

	if(pos == 2){
		this.Player2.status = "ready";
	}
	if(this.Player1.status == "ready" && this.Player2.status == "ready"){
		this.status = "ready";
	}
}

Room.prototype.playerCancelReady = function (pos) {
	// body...
	if(pos == 1){
		this.Player1.status = "inRoom";
	}

	if(pos == 2){
		this.Player2.status = "inRoom";
	}
}

Room.prototype.setGoldGroups = function (value){
	this.GoldGroups = value;
}
Room.prototype.instantiateResource = function (io){
	//console.log(this.GoldGroups[0]);
	this.GoldGroups.instantiate(io, this.ID);
}

Room.prototype.getResult = function (type) {
	if(type == "normal"){
		if(this.Player1.score > this.Player2.score){
			this.Player1.status = "win";
			this.Player2.status = "lose";
		}else{
			this.Player1.status = "lose";
			this.Player2.status = "win";
		}
	}else if(type == "quit"){
		if(this.Player1.status == "quit"){
			this.Player2.status = "win";
		}else if(this.Player2.status == "quit"){
			this.Player1.status = "win";
		}
	}

	var result = {
		Player1 : this.Player1,
		Player2 : this.Player2
	}	

	this.status = "postGame";
	return result;
	
}
Room.prototype.quitRoom = function (io, player) {
	if(this.status == "ready"){
      if(player.pos == 1){
        this.Player1.status = "quit";
        this.Player2.status = "win";
      }else{
        this.Player1.status = "win";
        this.Player2.status = "quit";
      }
      io.to(this.ID).emit("Game:end", this.getResult());  
    }else {
      //this.Player1 = null;
      //this.Player2 = null;
    }
}

Room.prototype.isClear = function () {
	return (this.Player1 == null && this.Player2 == null);
}

Room.prototype.checkGameEnd = function (io) {
	if(this.GoldGroups.isClear()){
		//this.Player1.status = "postGame";
		//this.Player2.status = "postGame";
		this.status = "postGame";
		io.to(this.ID).emit("Game:end", this.getResult("normal"));
		//this.Player1 = null;
		//this.Player2 = null;
		//console.log(this);
	}
}

module.exports = Room;