//COMPLETED BUILD
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; //declares variables which let the script know what the html has drawn the canvas at
canvas.height = 500;

var playerX = canvas.width/2;
var playerY = canvas.height/2;
var playerSpeed = 10;
const keys = [];
var score = 0;
var visa1 = null;
var visa2 = null;
var visa3 = null;
var visa4 = null;
var visa5 = null;
var visaCheck = null;

var continueAnimating = true;

//sprites and images
//background images - these will change based on the x coordinate of the crosshairs
const background1 = new Image ();
background1.src = "../html/brexitassets/background gun left.png";
const background2 = new Image ();
background2.src = "../html/brexitassets/background gun straight.png";
const background3 = new Image ();
background3.src = "../html/brexitassets/background gun right.png";
var background = background2;

//npc images
const boat = new Image ();
boat.src = "../html/brexitassets/boat.png";
const plane = new Image ();
plane.src = "../html/brexitassets/plane.png";
const npcs = [];
const npcsOnScreen = 10;//10
const npcsSpawnLimiter = 50;
var npcsSpawnCounter = 0;

//flags
const flagUK = new Image ();
flagUK.src = "../html/brexitassets/flaguk.png";
const flagEU = new Image ();
flagEU.src = "../html/brexitassets/flageu.png";
const flagIreland = new Image ();
flagIreland.src = "../html/brexitassets/flagireland.png";
const flagItaly = new Image ();
flagItaly.src = "../html/brexitassets/flagitaly.png";
const flagGermany = new Image ();
flagGermany.src = "../html/brexitassets/flaggermany.png";
const flagPoland = new Image ();
flagPoland.src = "../html/brexitassets/flagpoland.png";
const flagSpain = new Image ();
flagSpain.src = "../html/brexitassets/flagspain.png";
const flagPortugal = new Image ();
flagPortugal.src = "../html/brexitassets/flagportugal.png";
const flagFrance = new Image ();
flagFrance.src = "../html/brexitassets/flagfrance.png";
const flagNetherlands = new Image ();
flagNetherlands.src = "../html/brexitassets/flagnetherlands.png";
const flagHungary = new Image ();
flagHungary.src = "../html/brexitassets/flaghungary.png";
const flagCzechia = new Image ();
flagCzechia.src = "../html/brexitassets/flagczechia.png";
const flags = [];
flags.push(flagIreland, flagItaly, flagGermany, flagPoland, flagSpain, flagPortugal, flagFrance, flagNetherlands, flagHungary, flagCzechia);

//effects
const seaExplosion = new Image ();
seaExplosion.src = "../html/brexitassets/explosionsprite(390by45).png"
const plop = new Image ();
plop.src = "../html/brexitassets/plopsprite.png"
const plops = [];

//audio

//simplifies code to assign a sprite to an object by creating a function
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

//player object (crosshairs)
drawPlayer = function (size){
    //horizontal line
    ctx.beginPath();
    ctx.rect ((playerX - (size/2)), playerY-1, size, 3);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    //vertical line
    ctx.beginPath();
    ctx.rect (playerX-1, (playerY - (size/2)), 3, size);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    //enclosing circle
    ctx.beginPath();
    ctx.arc (playerX, playerY, size, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}

backgroundUpdate = function (){
    if (playerX > 0 && playerX < (canvas.width/3)) background = background1;
    else if (playerX > (canvas.width/3) && playerX < ((canvas.width/3)*2)) background = background2;
    else if (playerX > ((canvas.width/3)*2) && playerX < canvas.width) background = background3;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

}
//boat object
class Boat {
    constructor(){
        this.x = Math.floor(Math.random() * (3000 - 800) + 800);
        this.y = Math.floor(Math.random() * (380 - 117) + 117);
        this.width = 65;
        this.height = 45;
        this.frameX = 0;
        this.frameY = 0;
        this.sprite = boat;
        this.flag = flags[Math.floor(Math.random() * (flags.length - 0) + 0)];
        this.speed = Math.floor(Math.random() * (8 - 3) + 3);
        this.spookSpeed = (this.speed*2);
        this.vertSpeed = 1;//has to be one otherwse will cause jittering if destY isn't a multiple of this.speed
        this.destX = -100;
        this.destY = Math.floor(Math.random() * (380 - 117) + 117);
        this.toDangerX = null;
        this.toDangerY = null;
        this.toDangerLength = null;
        this.visa = false;
        this.spooked = false;
        this.arrived = false;
        this.dead = false;
        //what about adding a couple of RNG "waypoints" so that it creates a dodging effect
    }
    draw(){
        if (this.dead === false){
            ctx.drawImage(this.sprite, this.x, this.y);
            ctx.drawImage(this.flag, this.x+34, this.y+1);
        } else {
            drawSprite(seaExplosion, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
            this.frameX++;
        }
    }
    update(){
        if (this.x > this.destX){
            this.x -= this.speed;
        }
        if (this.x < (0-this.width)) this.arrived = true;
        if (this.y !== this.destY){
            if (this.y < this.destY){
                this.y += this.vertSpeed;
            } else if (this.y > this.destY){
                this.y -= this.vertSpeed;
            }
        }
        if (plops.length != 0 && plops[0].frameX === 0){
            this.toDangerX = playerX - (this.x+32);
            this.toDangerY = playerY - (this.y+22);
            this.toDangerLength = Math.sqrt((this.toDangerX * this.toDangerX) + (this.toDangerY * this.toDangerY));
            if (this.toDangerLength < 75) this.spooked = true;
        }
        if (this.spooked) this.speed = this.spookSpeed;
        if (plops.length != 0 && plops[0].frameX < 2){
            if (playerX > this.x && playerX < (this.x+this.width) && playerY > this.y && playerY < (this.y+this.height)) this.dead = true;
        }
        if (this.flag === visa1 || this.flag === visa2 || this.flag === visa3 || this.flag === visa4 || this.flag === visa5) this.visa = true;
        
        //if dead or arrived then splice from array and adjust score
    }
    remove(){
        let i = npcs.indexOf(this);
        if (this.frameX > 6 && this.visa === false) {
            npcs.splice(i,1);
            score++;
        }
        else if (this.frameX > 6 && this.visa === true) {
            npcs.splice(i,1);
            score -= 3;
        }
        if (this.arrived && this.visa === false) {
            npcs.splice(i,1);
            score-2;
        }
        else if (this.arrived && this.visa === true) {
            npcs.splice(i,1);
            score += 3;
        }
    }
}

//plane object
class Plane {
    constructor(){
        this.x = canvas.width;
        this.y = 5;
        this.width = 100;
        this.height = 35;
        this.frameX = 0;
        this.frameY = 0;
        this.sprite = plane;
        this.flag = flags[Math.floor(Math.random() * (flags.length - 0) + 0)];
        this.speed = 3;//placeholder
        this.destX = 0 - this.width;
        this.destY = null;
        this.visa = false;
        this.arrived = false;
        this.dead = false; //maybe use this for custom plane death animation?
    }
    draw(){
        if (this.dead === false){
        ctx.drawImage(this.sprite, this.x, this.y);
        ctx.drawImage(this.flag, this.x+69, this.y+5);
        } else {
        drawSprite(seaExplosion, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        this.frameX++;
        }
    }
    update(){
        if (this.x > this.destX){
            this.x -= this.speed;
        }
        if (this.x < (0-this.width)) this.arrived = true;
        if (plops.length != 0 && plops[0].frameX < 2){
            if (playerX > this.x && playerX < (this.x+this.width) && playerY > this.y && playerY < (this.y+this.height)) this.dead = true;
        }
        if (this.flag === visa1 || this.flag === visa2 || this.flag === visa3 || this.flag === visa4 || this.flag === visa5) this.visa = true;
    }
    remove(){
        let i = npcs.indexOf(this);
        if (this.frameX > 6 && this.visa === false) {
            npcs.splice(i,1);
            score++;
        }
        else if (this.frameX > 6 && this.visa === true) {
            npcs.splice(i,1);
            score -= 3;
        }
        if (this.arrived && this.visa === false) {
            npcs.splice(i,1);
            score-2;
        }
        else if (this.arrived && this.visa === true) {
            npcs.splice(i,1);
            score += 3;
        }
    }
}

npcSpawner = function() {
    if (npcsSpawnCounter < npcsSpawnLimiter && npcs.length < npcsOnScreen){
        for (i=0; i < npcsOnScreen; i++){
            let chance = Math.floor(Math.random() * 100);
            if (chance < 95) npcs.push(new Boat());
            else npcs.push(new Plane());
            console.log(chance);
            //80% chance to spawn a boat rather than a plane
        }
    }
}

//shell
class Shell {
    constructor (){
        this.x = (playerX-12.5);
        this.y = (playerY-40);
        this.width = 25;
        this.height = 50;
        this.frameX = 0;
        this.frameY = 0;
    }
    draw(){
        if (playerY > 100){
            drawSprite(plop, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
            this.frameX++
        }
        if (playerY < 100 && this.frameX < 2){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 7, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
        if (playerY < 100 && this.frameX < 2){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
        if (playerY < 100 && this.frameX >= 2 && this.frameX < 4){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 3, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
        if (playerY < 100 && this.frameX >= 4 && this.frameX < 7){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
    }
    remove(){
        let i = plops.indexOf(this);
        if (this.frameX > 6) plops.splice(i, 1);
    }
}

visaHandler = function (){
    let rng = Math.floor(Math.random() * 10);
    
    if (visa1 === null){
        visa1 = flags[rng];
    }
    else if (visa2 === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa2 = visaCheck;
    }
    else if (visa3 === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1 || visaCheck === visa2){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa3 = visaCheck;
    }
    else if (visa4 === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1 || visaCheck === visa2 || visaCheck === visa3){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa4 = visaCheck;
    }
    else if (visa5 === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1 || visaCheck === visa2 || visaCheck === visa3 || visaCheck === visa4){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa5 = visaCheck;
    }
}

//scorekeeping
drawScore = function() {
  ctx.font = "normal bolder 16px verdana";
  ctx.fillStyle = "yellow";
  ctx.fillText ("SCORE: "+score, canvas.width-150, canvas.height-35);
}

drawVisa = function() {
    ctx.font = "normal bolder 14px verdana";
    ctx.fillStyle = "yellow";
    ctx.fillText ("Open Border Treaty Agreed With:", 33, 440);
    ctx.beginPath();
    ctx.rect(40, 450, 250, 40)
    ctx.lineWidth = 3;
    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.closePath();
    if (visa1 !== null) ctx.drawImage(visa1, 50, 460);    
    if (visa2 !== null) ctx.drawImage(visa2, 100, 460);
    if (visa3 !== null) ctx.drawImage(visa3, 150, 460);
    if (visa4 !== null) ctx.drawImage(visa4, 200, 460);
    if (visa5 !== null) ctx.drawImage(visa5, 250, 460);
}

//event listeners for keypresses. keycode used as keys wasn't working properly with the version of chrome the programme was tested on
window.addEventListener("keydown", function (e){
  keys[e.keyCode] = true;//when a key is pressed that key is added to the keys array
});
window.addEventListener("keyup", function (e){
  delete keys[e.keyCode]; //when a key is released that key is deleted from the keys array.  This method prevents event listeners from interfering with one another and makes control more responsive.
});

//player movement and shooting logic
movePlayer = function (){
    if ((keys[87] || keys[38]) && playerY > 20){//up
        playerY -= playerSpeed;
    }
    if ((keys[65] || keys[37]) && playerX > 0){//left
        playerX -= playerSpeed;
    }
    if ((keys[83] || keys[40]) && playerY < 380){//down
        playerY += playerSpeed;
    }
    if ((keys[68] || keys[39]) && playerX < canvas.width){//right
        playerX += playerSpeed;
    }
    if (keys[32] && plops.length < 1) plops.push(new Shell());
    if (keys[86]) visaHandler();
}

//animate the player sprite. Required as player was not built using a constructor
function handlePlayerFrame(){
  if (player.frameX < 3 && player.moving) player.frameX++
  else player.frameX = 0;
}

//animation logic. lifted wholesale from a tutorial
let fps, fpsInterval, startTime, now, then, elapsed; //declare empty variables

function startAnimating(fps){ //function needed to kick off the animation by getting system time and tying fps to system time.
  fpsInterval = 1000/fps; //how much time passes before the next frame is served
  then = Date.now(); //Date.now is no. of ms elapsed since 1.1.1970
  startTime = then;
  animate();
}

//where the magic happens
function animate(){
  if (continueAnimating === true) {
    requestAnimationFrame(animate); //pass the parent function to RAF to cause it to call itself recursively
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //check to see if it's time to draw the next frame
      then = now - (elapsed % fpsInterval); //resets the clock to keep frame rate consistent
      ctx.clearRect (0, 0, canvas.width, canvas.height); //gets rid of everything and draws fresh

      backgroundUpdate();
      npcSpawner();
      for (i=0; i < npcs.length; i++){
        npcs[i].draw();
        npcs[i].update();
        npcs[i].remove();
        }
      
        if (plops.length != 0){
            for (i=0; i < plops.length; i++){
                plops[i].draw();
                plops[i].remove();
            }
        }

      drawPlayer(20);
      movePlayer();
      drawScore();
      drawVisa();
      console.log("visa1");
      console.log(visa1);
      console.log("visa2");
      console.log(visa2);
      console.log("visaCheck");
      console.log(visaCheck);
      console.log("---------------------");

    }
  }
}
if (continueAnimating) startAnimating(15); //starts the animation and condition prevents this from restarting the animation once the game has ended

//generate a random number within boundries //Math.random() * (max-min) + min

//TO DO LIST
//make plane explosion sprite sheet
//tweak npc spawn logic
//visa handler function to add/remove flags from approved list
//? animation to make it obvious when countries added to visa list?


