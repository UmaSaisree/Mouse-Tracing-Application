const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');



var clientx = 0;
var clienty = 0;

//var paths = [];
//var worms = [];

var cicle = 0;

var num_entity = 1;

window.onresize = fixdim;

class Worm{
  constructor(x, y, color){
    this.velx = 0;
    this.vely = 0;
    this.posx = x;
    this.posy = y;
    this.color = getnowcolor(color);
    this.targetX = randomPoint("x");
    this.targetY = randomPoint("y");
  }
  draw(newx, newy){
    this.posx = newx;
    this.posy = newy;
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, 5, 0, 2 * Math.PI); // Circle with radius 5
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}


class Path{
  constructor(color){
    this.paths = [];
    this.color = color;
  }
	update(){
    for(var i = 1; i < this.paths.length; i++){
      	ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(this.paths[i-1].x, this.paths[i-1].y);
        ctx.lineTo(this.paths[i].x, this.paths[i].y);
        ctx.strokeStyle = getnowcolor(this.color, i/150);
        ctx.stroke();
    }
	}
}

function fixdim(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getnowcolor(num, op = 1){
  var color = num;
  return "hsla(" + color +", 70%, 40%," + op + ")";
}

function loop(){
  cicle++;
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  

    goToTarget(worm);    
    worm.draw(worm.posx + worm.velx, worm.posy + worm.vely);
    
    if(Math.abs(worm.posx - worm.targetX) <= 2 && Math.abs(worm.posy - worm.targetY) <= 2){
      worm.targetX = randomPoint("x");
      worm.targetY = randomPoint("y");
      ctx.fillRect(worm.targetX, worm.targetY, 5, 5);
      ctx.fillStyle = worm.color;
    }
    
    if(cicle == 2){
      path.paths.push({x: worm.posx, y: worm.posy});
    }
    
    path.update();
    
    if(path.paths.length > 150){
      path.paths.shift();
    }

  
  if(cicle == 2){
    cicle = 0;
  }
  
  
  
  requestAnimationFrame(loop);
}

function init(){
  fixdim();
  
    var color = Math.floor((Math.random() * 255) + 1);
    var worm = new Worm(Math.floor((Math.random() * window.innerWidth) + 1),Math.floor((Math.random() * window.innerHeight) + 1));
    var path = new Path(color);
}


function goToTarget(worm){
  if(worm.targetX > worm.posx){
    worm.velx = 2;
  }else if(Math.abs(worm.posx - worm.targetX) <= 2){
    worm.velx = 0;
  }else{
    worm.velx = -2;
  }
  
  if(worm.targetY > worm.posy){
    worm.vely = 2;
  }else if(Math.abs(worm.posy - worm.targetY) <= 2){
    worm.vely = 0;
  }else{
    worm.vely = -2;
  }
}

function randomPoint(what){
  var rx = Math.floor((Math.random() * window.innerWidth) + 1);
  var ry = Math.floor((Math.random() * window.innerHeight) + 1);  
  return (what == "x") ? rx : ry;
}

function changeTarget(){
  for(var i = 0; i < num_entity; i++){
    worms[i].targetX = randomPoint("x");
    worms[i].targetY = randomPoint("y");
  }
}

canvas.addEventListener('mousedown', (e) => {
  $("canvas").css("background", "white");
  changeTarget();
  setTimeout(function(){
      $("canvas").css("background", "black");
  }, 100);
});



var gameInterval, scoreInterval;
var score = 0;
var gameDuration = 4 * 60 * 1000; // 4 minutes in milliseconds

function startGame() {
    init();
    loop();
    
    score = 0;
    gameInterval = setTimeout(endGame, gameDuration);
    scoreInterval = setInterval(updateScore, 100); // update score every 100ms
}

function endGame() {
    clearTimeout(gameInterval);
    clearInterval(scoreInterval);
    alert("Game Over! Your score: " + score);
}

function updateScore() {
    var dx = worm.posx - clientx;
    var dy = worm.posy - clienty;
    var distance = Math.sqrt(dx * dx + dy * dy);
    score += Math.max(0, 10 - distance); // Update the score calculation as needed
}

// Update the mouse position
canvas.addEventListener('mousemove', (e) => {
    clientx = e.clientX;
    clienty = e.clientY;
});

document.querySelector('#startButton').addEventListener('click', startGame);
