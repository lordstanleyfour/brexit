//COMPLETED BUILD
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; //declares variables which let the script know what the html has drawn the canvas at
canvas.height = 500;

var playerX = canvas.width/2;
var playerY = canvas.height/2;
var playerSpeed = 5;
const keys = [];

var continueAnimating = true;

//sprites and images
//background images - these will change based on the x coordinate of the crosshairs
const background1 = new Image ();
background1.src = "../html/brexitassets/background gun left.png";
const background2 = new Image ();
background2.src = "../html/brexitassets/background gun straight.png";
const background3 = new Image ();
background3.src = "../html/brexitassets/background gun right.png";
const backgroundImages = [background1, background2, background3];

//npc images
const boat = new Image ();
boat.src = "../html/brexitassets/boat.png";
const plane = new Image ();
plane.src = "../html/brexitassets/plane.png";
const npcs = [];

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

//boat object
class Boat {
    constructor(){
        this.x = canvas.width/2;//placeholder
        this.y = canvas.height/2;//placeholder
        this.width = 65;
        this.height = 45;
        this.sprite = boat;
        this.flag = flags[(Math.random() * (flags.length - 0) + 0)];
        this.speed = 5;//placeholder
        this.destX = this.x-canvas.width;//placeholder, randomise
        this.destY = this.y;//placeholder, randomise
        this.visa = false;
        this.spooked = false; //if shot at and missed by a certain margin increase speed or change dest Y
        this.arrived = false;
        this.dead = false;
        //what about adding a couple of RNG "waypoints" so that it creates a dodging effect
    }
    draw(){
        ctx.drawImage(boat, this.x, this.y);
        ctx.drawImage(this.flag, this.x+34, this.y+1);
    }
    update(){
        //move to destination
        //if dead or arrived then splice from array and adjust score
        //maybe if shot at and missed increase speed
    }
}

//plane object
class Plane {
    constructor(){
        this.x = null;
        this.y = null;
        this.width = null;
        this.height = null;
        this.sprite = null;
        this.flag = null;
        this.speed = null;
        this.destX = null;
        this.destY = null;
        this.visa = null;
        this.arrived = null;
        this.dead = null;
    }
    draw(){
        ctx.drawImage(plane, this.x, this.y);
        ctx.drawImage(this.flag, this.x+69, this.y+5);
    }
    update(){
        //move to destination
        //if dead or arrived then splice from array and adjust score

    }
}

//scorekeeping
drawScore = function() {
  ctx.font = "normal bolder 16px verdana";
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillText ("Rescued refugees: "+score, canvas.width-210, 20);
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
      ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);
      
      drawPlayer(20);
      movePlayer();
      console.log(playerY);  
    }
  }
}
if (continueAnimating) startAnimating(15); //starts the animation and condition prevents this from restarting the animation once the game has ended

//generate a random number within boundries //Math.random() * (max-min) + min

//TO DO LIST
//make plane explosion sprite sheet
//make missed shot splash sprite sheet

