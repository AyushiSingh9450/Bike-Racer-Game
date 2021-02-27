//gameStates

var PLAY = 1;
var END = 0;
var gameState = PLAY;

//score or distance
var score = 0;

//sprites variables
var road, road_image;
var player, player_image, player_collided;

//opponent variables
var opponent1, opponent1_image, opponent1_collided;
var opponent2, opponent2_image, opponent2_collided;
var opponent3, opponent3_image, opponent3_collided;

//obtacle variables
var obs1, obs1_image;
var obs2, obs2_image;
var obs3, obs3_image;

//gameover variables
var gameover, gameover_image;

//sound variables
var gameoverSound, bellSound;

function preload() {
  
  //loading animations

  player_image = loadAnimation("mainPlayer1.png", "mainPlayer2.png");
  player_collided = loadAnimation("mainPlayer3.png");

  opponent1_image = loadAnimation("opponent1.png", "opponent2.png");
  opponent1_collided = loadAnimation("opponent3.png");

  opponent2_image = loadAnimation("opponent4.png", "opponent5.png");
  opponent2_collided = loadAnimation("opponent6.png");

  opponent3_image = loadAnimation("opponent7.png", "opponent8.png");
  opponent3_collided = loadAnimation("opponent9.png");

  //loading images

  road_image = loadImage("Road.png");

  obs1_image = loadImage("obstacle1.png");
  obs2_image = loadImage("obstacle2.png");
  obs3_image = loadImage("obstacle3.png");

  gameover_image = loadImage("gameOver.png");

  //loading Sounds

  gameoverSound = loadSound("gameover.mp3");

  bellSound = loadSound("sound/bell.mp3");
}

function setup() {

  createCanvas(windowWidth, 300);

  // Moving background
  road = createSprite(100, 150);
  road.addImage(road_image);
  road.velocityX = -5 + (-0.5 + score / 50);

  //creating boy running
  player = createSprite(70, 150, 20, 20);
  player.addAnimation("cycling", player_image);
  player.addAnimation("player collided", player_collided);
  player.scale = 0.07;

  // player.debug = true;
  player.setCollider("aabb", 0, 0, 500, 600);

  //creating gameover sprite
  gameover = createSprite(windowWidth/2, 150);
  gameover.addImage(gameover_image);

  //visibility
  gameover.visible = false;

  //incresing depth
  gameover.depth = player.depth;
  gameover.depth++;


  //creating Groups

  opponent1Group = createGroup();
  opponent2Group = createGroup();
  opponent3Group = createGroup();

  obstacle1Group = createGroup();
  obstacle2Group = createGroup();
  obstacle3Group = createGroup();

}

function draw() {
  background("white");



  if (gameState === PLAY) {

    //gameover visiblility
    gameover.visible = false;

    //distance calculation 
    score = score + Math.round(getFrameRate() / 40);

    // bell sound
    if (score % 100 === 0 && score > 0) {
      bellSound.play();
    }

    // player controled by mouse
    player.y = World.mouseY;

    //edges
    edges = createEdgeSprites();
    player.collide(edges);

    //code to reset the background
    if (road.x < 0) {
      road.x = width / 2;
    }
    //adding the function
    opponents();

    //player reaching END state
    if (player.isTouching(opponent1Group)) {
      
      gameState = END;

      opponent1.changeAnimation("opponent1 collided", opponent1_collided);
      
      // opponent1Group.setVelocityXEach(0);

      opponent1.x = player.x+50;

      player.changeAnimation("player collided", player_collided);

      gameoverSound.play();
    }
    if (player.isTouching(opponent2Group)) {
      gameState = END;

      opponent2.changeAnimation("opponent2 collided", opponent2_collided);

      player.changeAnimation("player collided", player_collided);

      gameoverSound.play();
    }
    if (player.isTouching(opponent3Group)) {
      gameState = END;

      opponent3.changeAnimation("opponent3 collided", opponent3_collided);

      player.changeAnimation("player collided", player_collided);

      gameoverSound.play();
    }

    if (player.isTouching(obstacle1Group) || player.isTouching(obstacle2Group) || player.isTouching(obstacle3Group)) {
      gameState = END;
      player.changeAnimation("player collided", player_collided);
      gameoverSound.play();
    }

    drawSprites();
  } else if (gameState === END) {


    //stoppong the moving background
    road.velocityX = 0;

    //gamover image visibility
    gameover.visible = true;
    
    //setting the lifetime so that the sprites won't dissappear after gameover.
    opponent1Group.setLifetimeEach(-1);
    opponent2Group.setLifetimeEach(-1);
    opponent3Group.setLifetimeEach(-1);

    obstacle1Group.setLifetimeEach(-1);
    obstacle2Group.setLifetimeEach(-1);
    obstacle3Group.setLifetimeEach(-1);

    //setting the velocity to 0 so that they stop moving.
    opponent1Group.setVelocityXEach(0);
    opponent2Group.setVelocityXEach(0);
    opponent3Group.setVelocityXEach(0);

    opponent1Group.setVelocityYEach(0);
    opponent2Group.setVelocityYEach(0);
    opponent3Group.setVelocityYEach(0);

    obstacle1Group.setVelocityXEach(0);
    obstacle2Group.setVelocityXEach(0);
    obstacle3Group.setVelocityXEach(0);
    
    obstacle1Group.setVelocityYEach(0);
    obstacle2Group.setVelocityYEach(0);
    obstacle3Group.setVelocityYEach(0);

    //this will happen after pressing the up arrow key.
    if (keyDown("up")) {
      reset();
      road.velocityX = -5 + (-0.5 + score / 50);

    }

    drawSprites();

    //restart text
    textSize(20);
    fill("white");
    text("Press the up arrow for restart", gameover.x - 150, 210);

  }


  //for making the score or distance visible.
  textSize(20);
  fill(255);
  text("Distance: " + score, windowWidth-(windowWidth/2),30);
}

function reset() {
  //resetting the score and gamestate
  score = 0;
  gameState = PLAY;

  frameCount = 0;
  //clearing the obstacles and opponents
  opponent1Group.destroyEach();
  opponent2Group.destroyEach();
  opponent3Group.destroyEach();

  obstacle1Group.destroyEach();
  obstacle2Group.destroyEach();
  obstacle3Group.destroyEach();

  // player back to cycling 
  player.changeAnimation("cycling", player_image);
}

function opponents() {

  if (frameCount % 107 === 0) {
    opponent1 = createSprite(windowWidth, Math.round(random(50, 280)));
    opponent1.addAnimation("racer1", opponent1_image);
    opponent1.addAnimation("opponent1 collided", opponent1_collided);

    // opponent1.debug = true;
    opponent1.setCollider("aabb", 0, 0, 700, 500);

    opponent1.scale = 0.07;
    opponent1.lifetime = windowWidth/2;

    opponent1.velocityX = -5 + (-0.5 * score / 50);

    opponent1Group.add(opponent1);
    opponent1.depth = gameover.depth;
    opponent1.depth = opponent1.depth - 1;
    
    // console.log(opponent1.x, opponent1.y)

  }
  if (frameCount % 257 === 0) {
    obs1 = createSprite(windowWidth, Math.round(random(50, 280)));
    obs1.addImage(obs1_image);
    obs1.velocityX = -5 + (-0.5 * score / 50);

    obs1.lifetime = windowWidth/2;

    // obs1.debug = true;
    obs1.setCollider("aabb", 0, 10, 300, 450);

    obs1.scale = 0.07;
    obstacle1Group.add(obs1);

    obs1.depth = gameover.depth;
    obs1.depth = obs1.depth - 1;

  }
  if (frameCount % 197 === 0) {
    opponent2 = createSprite(windowWidth, Math.round(random(50, 280)));
    opponent2.addAnimation("racer2", opponent2_image);
    opponent2.addAnimation("opponent2 collided",
      opponent2_collided);
    opponent2.velocityX = -5 + (-0.5 * score / 50);

    opponent2.lifetime = windowWidth/2;

    // opponent2.debug = true;
    opponent2.setCollider("aabb", 0, 0, 700, 500);

    opponent2.scale = 0.07;
    opponent2Group.add(opponent2);

    opponent2.depth = gameover.depth;
    opponent2.depth = opponent2.depth - 1;
  }

  if (frameCount % 209 === 0) {
    obs2 = createSprite(windowWidth, Math.round(random(50, 280)));
    obs2.addImage(obs2_image);
    obs2.velocityX = -5 + (-0.5 * score / 50);

    obs2.lifetime = windowWidth/2;
    obs2.depth = player.depth;
    player.depth++;

    // obs2.debug = true;
    obs2.setCollider("aabb", 0, 0, 600, 200);

    obs2.scale = 0.09;
    obstacle2Group.add(obs2);

    obs2.depth = gameover.depth;
    obs2.depth = obs2.depth - 1;

  }
  if (frameCount % 300 === 0) {
    opponent3 = createSprite(windowWidth, Math.round(random(50, 280)));
    opponent3.addAnimation("racer3", opponent3_image);
    opponent3.addAnimation("opponent3 collided", opponent3_collided);
    opponent3.velocityX = -5 + (-0.5 * score / 50);

    opponent3.lifetime = windowWidth/2;

    // opponent3.debug = true;
    opponent3.setCollider("aabb", 0, 0, 500, 600);

    opponent3.scale = 0.07;
    opponent3Group.add(opponent3);

    opponent3.depth = gameover.depth;
    opponent3.depth = opponent3.depth - 1;

  }
  if (frameCount % 357 === 0) {
    obs3 = createSprite(windowWidth, Math.round(random(50, 280)));
    obs3.addImage(obs3_image);
    obs3.velocityX = -5 + (-0.5 * score / 50);

    // obs3.debug = true;
    obs3.setCollider("aabb", 0, 0, 400, 200);
    obs3.scale = 0.07;
    obs3.lifetime = windowWidth/2;

    obstacle3Group.add(obs3);

    obs3.depth = gameover.depth;
    obs3.depth = obs3.depth - 1;
  }
}