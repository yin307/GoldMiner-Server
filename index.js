var io 				= require('socket.io')(2558);
//var shortId 		= require('shortid');
//var app = require('express')();
//var server = require('http').Server(app);
//var io = require('socket.io')(server);

//server.listen(3000);

//app.get('/', function (req, res) {
//  res.send('Hello World!');
//});


var Room = require('./GameObject/Room.js');
var Fish = require('./GameObject/Fish.js');
var Vector3 = require('./my_module/vector3.js');
var GoldGroup = require('./GameObject/GoldGroup.js');
var db = require('./my_module/DB.js');
var Input = require('./my_module/input');
var Shop = require('./GameObject/shop.js');
var Item = require('./GameObject/item.js');



db.connect();


var rooms = [];
//rooms[0] = new Room("Room 01", 0, null, null, "idle", "static");

var playerQueue = [];

//SHOP
var SHOP = new Shop();
SHOP.loadItems(db.result, db.conn, function (res) {
  //console.log(res.data);
  res.data.forEach(function(item){
    var i = new Item();
    i.name = item.item_name;
    i.id = item.item_id;
    i.description = item.item_description;
    i.price = item.item_price;
    SHOP.items.push(i);
  });
  //SHOP.items = res.data;
  //console.log(SHOP.items);
});

//UPDATE GAME
var u = setInterval(function(){
//  console.log(rooms.length);
  for (var i = rooms.length - 1; i >= 0; i--) {
    if(rooms[i] != null){
      rooms[i].updateGame(db.conn);
    }
  }  
}, 1000/60);


io.on('connection', function (socket) {



  socket.emit("news", {data:"hello"});

  var Player = require('./GameObject/Player.js')
  var player = new Player(socket.id,"", "", "");



  console.log("new connection");
  socket.emit('user:connection', { msg: 'Well come game' });

  socket.on("ping", function (data) {
    socket.emit("pong");
  });


  socket.on('user:login', function (data){

    player.name = data.name;
    player.profilePic = data.profilePic;
    player.code = data.code;


    // /console.log(data);

    //socket.emit("user:loginSuccess");
    //PUSH ACCOUNT TO DB
    db.login(data.code, data.name, function(loginData){
      //console.log(loginData);
          socket.emit("user:loginSuccess");
      if(loginData.errorCode == 0){
          console.log("login success");       

          // LOAD ITEMS TO BAG
          player.bag.loadItems(player.code, db.result,db.conn,function (res) {
            player.bag.pushItems(res.data);
            
            player.bag.loadGems(player.code, db.result, db.conn,function (res) {
              if(res.data[0] != null)
              player.bag.gems = parseInt(res.data[0].user_gem);              
              socket.emit("user:loadBagSuccess", {data:player.bag.items, gem:player.bag.gems});          
            });
            //console.log(player.bag.items[0].item_id);
          });         
      }
    });

  });

  socket.on('my other event', function (data) {
   console.log(data);
 });

  socket.on('user:requestBag', function (data){    
    // LOAD ITEMS TO BAG
    player.bag.loadItems(player.code, db.result,db.conn,function (res) {
      player.bag.pushItems(res.data);
              
      player.bag.loadGems(player.code, db.result, db.conn,function (res) {
        if(res.data[0] != null){        
          player.bag.gems = parseInt(res.data[0].user_gem);                     
          socket.emit("user:loadBagShopSuccess", {data:player.bag.items, gem:player.bag.gems});
        }
      });    
    });
  });

  socket.on('user:joinroom', function (data){
    console.log(socket.id + " request join room " + data.roomID);  		
    var position = rooms[0].joinRoom(player);
    player.pos = position;
    if( position != 0)
    {
     socket.join(data.roomID);	
     player.roomID = data.roomID;
     console.log(player.iD);
     socket.emit("user:joinRoom", {result: 'success', pos : position, iD:player.iD});	  			

     if(position == 2)
     {
      socket.broadcast.to(rooms[player.roomID].ID).emit("user:genEnemy", player);
      socket.emit("user:genEnemy", rooms[data.roomID].Player1);
    }
    io.to(data.roomID).emit('user:notifi', {msg : "new user joined room"});
  }
});

  socket.on('user:getRoom', function(data){
    console.log("request room");
    socket.emit("user:getRoomInfor", {roomInfor : rooms[player.roomID].getRoomInfor()});
  });

  socket.on('user:ready', function (data){
    player.status = "ready";
    rooms[player.roomID].playerReady(player.pos);
    socket.broadcast.to(rooms[player.roomID].ID).emit("user:enemyReady");    
    
    if(rooms[player.roomID].isReady()){ 

      //var i =  Math.floor((Math.random() * maxGroupGold) + 0);
      io.to(rooms[player.roomID].ID).emit("user:gameReady");
      rooms[player.roomID].instantiateResource(io);      

       rooms[player.roomID].startGame(db.conn);

      rooms[player.roomID].GoldGroups.startFishs(io, rooms[player.roomID].ID);
      console.log("Game ready");                
    }

    socket.on('user:cancelReady', function (data) {
      rooms[player.roomID].playerCancelReady(player.pos);
      socket.broadcast.to(rooms[player.roomID].ID).emit("user:enemyCancelReady");
    });


  });


  socket.on('Player:pushScore', function (data){
    rooms[player.roomID].checkGameEnd(io);
    if(rooms[player.roomID].GoldGroups.isClear()){
      player.score =  0;
      removeRoom();
    }
  });

  socket.on('Player:dropHook', function (data){
    console.log("enemy dropHook");
    //console.log(player.roomID);
    socket.broadcast.to(rooms[player.roomID].ID).emit("Enemy:dropHook", data);
  });

  socket.on('BuyItem', function (data){
    player.buyItem(data.code, SHOP, db.conn, socket);
  });

  socket.on('User:findMatch', function (data) {
    
    // LOAD ITEMS TO BAG
    player.bag.loadItems(player.code, db.result,db.conn,function (res) {
      player.bag.pushItems(res.data);
            
      player.bag.loadGems(player.code, db.result, db.conn,function (res) {
        if(res.data[0] != null)
          player.bag.gems = parseInt(res.data[0].user_gem);              
          socket.emit("user:loadBagSuccess", {data:player.bag.items, gem:player.bag.gems});          
      });
            //console.log(player.bag.items[0].item_id);
    });      


    player.status = "find";
    playerQueue.push(player);
    createRoomFromQueue(player, socket);
  })

  socket.on('User:cancelFind', function (data){
    player.status = "idle";
    playerQueue.splice(getPlayerQueue(player.iD),1);
  });

  socket.on('User:quitRoom', function (data) {
    player.status = "idle";

    console.log("Quit room");
    if(rooms[player.roomID] != null){
      socket.broadcast.to(rooms[player.roomID].ID).emit("user:quitRoom", player);
      rooms[player.roomID].quitRoom(io, player);
    }
    removeRoom();
  })

  socket.on('disconnect', function (data){
    if(player.status == "find"){
      playerQueue.splice(getPlayerQueue(player.iD),1);
    }
    
    console.log(player.name + " has disconnect");
    if(rooms[player.roomID] != null){

      socket.broadcast.to(rooms[player.roomID].ID).emit("user:enemyDisconnect");
      socket.broadcast.to(rooms[player.roomID].ID).emit("user:quitRoom", player);
      rooms[player.roomID].quitRoom(io, player);
      removeRoom();
      /*if(player.pos == 1){
      rooms[player.roomID].Player1 = null;
      }else{
      rooms[player.roomID].Player2 = null;
    }*/
  }
});


  socket.on("getTime", function (data) {
    //console.log("get time");
    socket.emit("syncTime", {time:getSVTime()});
  });

  socket.on("pushTime", function (data) {
    socket.emit("printReply", {svTime:getSVTime(), clTime:data.time});
  });

  socket.on("pushInput", function (data) {   
    //console.log(player.roomID);
    if(rooms[player.roomID] != null){     
      rooms[player.roomID].receiveInput(new Input(data.name,data.ID, data.data));
    }

  });

});



function createRoomFromQueue(player, socket){
  console.log("Findding ");
  for (var i = playerQueue.length - 1; i >= 0; i--) {
    if(playerQueue[i].iD == player.iD){
      continue;
    }else{
      if(player.status = 'find' && playerQueue[i].status == 'find'){
        player.status = 'inRoom';
        playerQueue[i].status = 'inRoom';

        var newRoomId = player.iD+"|"+playerQueue[i].iD;
        console.log(newRoomId);
        var newRoom = new Room("Room 01", newRoomId, null, null, "idle", "find", io);
        rooms.push(newRoom);
        var index = getRoomByID(newRoomId);

        var position1 = rooms[index].joinRoom(player);
        var position2 = rooms[index].joinRoom(playerQueue[i]);

        player.pos = position1;
        playerQueue[i].pos = position2;

        player.setHook();
        playerQueue[i].setHook();

        player.roomID = index;
        playerQueue[i].roomID = index;

        socket.join(newRoomId);
        io.sockets.sockets[playerQueue[i].iD].join(newRoomId)

        io.to(newRoomId).emit("user:findSuccess");

        var bg = Math.floor((Math.random() * 4) + 0);
        io.to(newRoomId).emit("user:genBG", {index:bg});

        var joinEmit = setTimeout(function () {

          socket.emit("user:joinRoom", {result: 'success', pos : position1, iD:player.iD});         
          io.sockets.sockets[playerQueue[i].iD].emit("user:joinRoom", {result: 'success', pos : position2, iD:playerQueue[i].iD});         

          socket.emit("user:genEnemy", playerQueue[i]);
          io.sockets.sockets[playerQueue[i].iD].emit("user:genEnemy", player);
          playerQueue.splice(i, 1);
          playerQueue.splice(getPlayerQueue(player.iD), 1);
        }, 0);

        break;

      }
    }      
  }
}

function removeRoom() {
  for (var i = rooms.length - 1; i >= 0; i--) {
    if(rooms[i].type == "find"){
      rooms.splice(i, 1);
    }
  }
}

function getRoomByID(iD) {
  for (var i = rooms.length - 1; i >= 0; i--) {
    if(rooms[i].ID == iD){
      return i;
      break;
    }
  }
}

function getPlayerQueue(iD) {
  for (var i = playerQueue.length - 1; i >= 0; i--) {
    if(playerQueue[i].iD == iD){
      return i;
      break;
    }
  }
}

function getSVTime(){
  var d = new Date();
  var n = d.getTime();
  return String(n);
}
console.log("Server is starting.........");