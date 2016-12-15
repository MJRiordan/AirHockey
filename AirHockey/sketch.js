var playerBar = new Bar(40, 100, 100, 10, 0, 0, 255, 0, 0, 0, 0, false);
var compBar = new Bar(760, 100, 100, 10, 255, 0, 0, 0, 0, 0, 0, false);
var tripleBar1 = new Bar(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
var tripleBar2 = new Bar(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
var ball = new Ball(400, 300, 20, 255, 255, 0, 0, 0);
var playerScore = 0;
var compScore = 0;
var difficulty = 1;
var reset = true;
  
function setup() {
  createCanvas(800, 600);
  resetGame();
}

function draw() {
  
  background(220, 255, 255);
  drawRink();
  
  drawBar(playerBar);
  if(playerBar.triple == true){
    drawTriple(playerBar);
  }
  drawBar(compBar);
  if(compBar.triple == true){
    drawTriple(compBar);
  }
  drawBall(ball);
  
  movePlayer(playerBar);
  moveComp(compBar);
  moveBall(ball);
  
  bounceBall(ball, playerBar);
  bounceBall(ball, compBar);
  if(playerBar.triple == true || compBar.triple == true){
    bounceBall(ball, tripleBar1);
    bounceBall(ball, tripleBar2);
  }
  
  dispScore();
  
  if(reset == true){
    dispStartText();
  }
  
}

function Bar(xPos, yPos, barHeight, barWidth, redness, greenness, blueness, xSpeed, ySpeed, xAccel, yAccel, triple) {
  
  this.xPos = xPos;
  this.yPos = yPos;
  this.barHeight = barHeight;
  this.barWidth = barWidth;
  this.redness = redness;
  this.greenness = greenness;
  this.blueness = blueness;
  this.xSpeed = xSpeed;
  this.ySpeed = ySpeed;
  this.xAccel = xAccel;
  this.yAccel = yAccel;
  this.triple = triple;
  
}

function Ball(xPos, yPos, ballSize, redness, greenness, blueness, xSpeed, ySpeed) {
  
  this.xPos = xPos;
  this.yPos = yPos;
  this.ballSize = ballSize;
  this.redness = redness;
  this.greenness = greenness;
  this.blueness = blueness;
  this.xSpeed = xSpeed;
  this.ySpeed = ySpeed;
  
  this.barBounce = function(axis, barName){
    
    if(axis == 'x'){
      
      //Reverse x direction of ball, add speed of bar, then increase xSpeed for added difficulty.
      this.xSpeed = (-this.xSpeed * 1.25) + barName.xSpeed;
      this.ySpeed += barName.ySpeed;
      
    }else if(axis == 'y'){
      
      this.ySpeed = -this.ySpeed + barName.ySpeed;
      this.xSpeed += barName.xSpeed;
      
    }
    
  }
  
  this.wallBounce = function(axis, edgePos){
    
    if(axis == 'x'){
      
      this.xSpeed = -this.xSpeed;
      
    }else if(axis == 'y'){
      
      this.ySpeed = -this.ySpeed * 0.85;

    }
    
  }
  
}

function drawBar(name){
  
  //Draws bars.
  strokeWeight(0);
  fill(name.redness, name.greenness, name.blueness);
  rectMode(CENTER);
  rect(name.xPos, name.yPos, name.barWidth, name.barHeight, 4);
  
}

function drawTriple(name){
  
  //Draws extra side bars beside losing bar
  strokeWeight(0);
  fill(name.redness, name.greenness, name.blueness);
  rectMode(CENTER);
  //for loop draws both bars
  for(var i = -1; i<= 1; i += 2){
  rect(name.xPos, name.yPos + (i * (name.barHeight + 20)), name.barWidth, name.barHeight / 2, 4);
  }
  
  tripleBar1.xPos = name.xPos;
  tripleBar1.yPos = name.yPos + name.barHeight + 20;
  tripleBar1.barWidth = name.barWidth;
  tripleBar1.barHeight = name.barHeight / 2;
  
  tripleBar2.xPos = name.xPos;
  tripleBar2.yPos = name.yPos - name.barHeight - 20;
  tripleBar2.barWidth = name.barWidth;
  tripleBar2.barHeight = name.barHeight / 2;
  
}

function drawBall(name){
  
  //Draws ball.
  strokeWeight(2);
  fill(name.redness, name.greenness, name.blueness);
  rectMode(CENTER);
  rect(name.xPos, name.yPos, name.ballSize, name.ballSize);
  
}

function moveBall(name){

  //Moves ball.
  name.xPos += name.xSpeed;
  name.yPos += name.ySpeed;
  
}

function movePlayer(name){
  
  //Moves playerBar based on distance from mouseY, prevents playerBar going outside the canvas.
  if(0 <= (name.yPos - (name.barHeight / 2)) && (name.yPos + (name.barHeight / 2)) <= height){
    name.ySpeed = ((mouseY - name.yPos) / 2);
  }else{
    name.ySpeed = 0;
    if(name.yPos < (height / 2) && mouseY > name.yPos){
      name.ySpeed = ((mouseY - name.yPos) / 2);
    }else if(name.yPos > (height / 2) && mouseY < name.yPos){
      name.ySpeed = ((mouseY - name.yPos) / 2);
    }
  }
  name.yPos += name.ySpeed;
  
}

function moveComp(name){
  
  //compBar follows the y position of the ball, depending on random numbers, difference in y positions of the ball and bar, x position of the ball, and the difficulty setting.
    if(0 <= (name.yPos - (name.barHeight / 2)) && (name.yPos + (name.barHeight / 2)) <= height){
      name.yAccel += random(-1, 1);
      name.ySpeed = (ball.yPos - name.yPos) * ((pow(ball.xPos, 2)) * 0.000001) * 0.1 * difficulty;
    }else{
      name.yAccel = 0;
      name.ySpeed = 0;
      if(name.yPos < (height / 2) && ball.yPos > name.yPos){
        name.yAccel += random(-1, 1);
        name.ySpeed = (ball.yPos - name.yPos) * ((pow(ball.xPos, 2)) * 0.000001) * 0.1 * difficulty;
      }else if(name.yPos > (height / 2) && ball.yPos < name.yPos){
        name.yAccel += random(-1, 1);
        name.ySpeed = (ball.yPos - name.yPos) * ((pow(ball.xPos, 2)) * 0.000001) * 0.1 * difficulty;
    }
  }
  
  name.ySpeed += name.yAccel * 10;
  name.yPos += name.ySpeed / 5;
  
}

function drawRink(){
  
  //Draws ice hockey rink background
  noFill();
  strokeWeight(4);
  rectMode(CENTER);
  ellipseMode(CENTER);
  
  ellipse(width/2, height/2, width/5, width/5);
  rect(width/2, height/2, width - 20, height - 20, 10);
  line(width/2, 10, width/2, height - 10);
  
  //for loop draws red rings in four corners of canvas.
  stroke(255, 72, 66);
  for(var i = 1; i <= 3; i+=2){
    for(var j = 1; j <= 3; j+=2){
      
      fill(163, 244, 255);
      ellipse(i * (width/4), j * (height/4), width/4, width/4);
      fill(255, 72, 66);
      ellipse(i * (width/4), j * (height/4), width/40, width/40);

    }
  }
  
  stroke(0);
  
}

function bounceBall(ballName, barName){
  //Handles collisions between ball and bars/edge of canvas

  
  //If ball is about to overlap with the edge of the canvas.
  
  //If ball is about to cross player's edge.
  if((ballName.xPos - (ballName.ballSize/2)) + ballName.xSpeed <= 0){
    resetBall();
    compScore++;
    playerBar.barHeight = 100 * (compScore + 5) / (playerScore + 5);
    compBar.barHeight = 100 * (playerScore + 5) / (compScore + 5);
    difficulty *= 1 + ((playerScore - compScore)/10);
    println(difficulty);
    
    if(playerScore - compScore >= 3){
      compBar.triple = true;
    }else if(compScore - playerScore >= 3){
      playerBar.triple = true;
    }else{
      playerBar.triple = false;
      compBar.triple = false;
    }
  
  //If ball is about to cross comp's edge.
  }else if(ballName.xPos + (ballName.ballSize/2) + ballName.xSpeed >= width){
    ballName.wallBounce('x', width);
    resetBall();
    playerScore++;
    //Adjust bar sizes according to relative scores.
    playerBar.barHeight = 100 * (compScore + 5) / (playerScore + 5);
    compBar.barHeight = 100 * (playerScore + 5) / (compScore + 5);
    //Adjust speed of compBar depending on how dominant one bar is over the other.
    difficulty *= 1 + ((playerScore - compScore)/10);

    //If one player leads by three points, their opponent get two extra side bars.
    if(playerScore - compScore >= 3){
      compBar.triple = true;
    }else if(compScore - playerScore >= 3){
      playerBar.triple = true;
    }else{
      playerBar.triple = false;
      compBar.triple = false;
    }
    
  //If ball is about to hit top or bottom of canvas.
  }else if(ballName.yPos - (ballName.ballSize/2) + ballName.ySpeed <= 0){
    ballName.wallBounce('y', 0);
  }else if(ballName.yPos + (ballName.ballSize/2) + ballName.ySpeed >= height){
    ballName.wallBounce('y', height);
  }
  
  //If ball is about to overlap with any part of a bar.
  if((ballName.xPos - (ballName.ballSize/2)) + ballName.xSpeed <= (barName.xPos + (barName.barWidth/2)) &&
    (ballName.xPos + (ballName.ballSize/2)) + ballName.xSpeed >= (barName.xPos - (barName.barWidth/2)) &&
    (ballName.yPos - (ballName.ballSize/2)) + ballName.ySpeed <= (barName.yPos + (barName.barHeight/2)) &&
    (ballName.yPos + (ballName.ballSize/2)) + ballName.ySpeed >= (barName.yPos - (barName.barHeight/2))){
      //If ball can only hit one edge of a bar.
      if((ballName.yPos + (ballName.ballSize/2)) >= (barName.yPos - (barName.barHeight/2)) && (ballName.yPos - (ballName.ballSize/2)) <= (barName.yPos + (barName.barHeight/2))){
        ballName.barBounce('x', barName);
      }else if((ballName.xPos + (ballName.ballSize/2)) >= (barName.xPos - (barName.barWidth/2)) && (ballName.xPos - (ballName.ballSize/2)) <= (barName.xPos + (barName.barWidth/2))){
        ballName.barBounce('y', barName);
      }else if((ballName.yPos + (ballName.ballSize/2)) < (barName.yPos - (barName.barHeight/2)) && (ballName.xPos + (ballName.ballSize/2)) < (barName.xPos - (barName.barWidth/2))){
        var xInt = xIntercept(ballName, barName);
        if(xInt <= barName.xPos - (barName.barWidth/2)){
          ballName.barBounce('x', barName);
        }else if(xInt > barName.xPos - (barName.barWidth/2)){
          ballName.barBounce('y', barName);
        }
      //If ball could hit one of two edges.
      }else if((ballName.yPos + (ballName.ballSize/2)) < (barName.yPos - (barName.barHeight/2)) && (ballName.xPos - (ballName.ballSize/2)) > (barName.xPos + (barName.barWidth/2))){
       var xInt = xIntercept(ballName, barName);
        if(xInt >= barName.xPos + (barName.barWidth/2)){
          ballName.barBounce('x', barName);
        }else if(xInt < barName.xPos + (barName.barWidth/2)){
          ballName.barBounce('y', barName);
        }
      }
      else if((ballName.yPos - (ballName.ballSize/2)) > (barName.yPos + (barName.barHeight/2)) && (ballName.xPos - (ballName.ballSize/2)) > (barName.xPos + (barName.barWidth/2))){
        var xInt = xIntercept(ballName, barName);
        if(xInt >= barName.xPos + (barName.barWidth/2)){
          ballName.barBounce('x', barName);
        }else if(xInt < barName.xPos + (barName.barWidth/2)){
          ballName.barBounce('y', barName);
        }
      }else if((ballName.yPos - (ballName.ballSize/2)) > (barName.yPos + (barName.barHeight/2)) && (ballName.xPos + (ballName.ballSize/2)) < (barName.xPos - (barName.barWidth/2))){
        var xInt = xIntercept(ballName, barName);
        if(xInt <= barName.xPos - (barName.barWidth/2)){
          ballName.barBounce('x', barName);
        }else if(xInt > barName.xPos - (barName.barWidth/2)){
          ballName.barBounce('y', barName);
        }
      }
    }
}

function xIntercept(ballName, barName){
  
  //Find x-intercept of ball and bar
  var xInt = ballName.xPos + (ballName.ballSize / 2) + ((ballName.xSpeed/ballName.ySpeed) * (barName.yPos - ((barName.barHeight/2) + ballName.yPos + (ballName.ballSize/2))));
  return xInt;
  
}

function dispScore(){
  
  //Displays scores
  fill(0);
  textAlign(CENTER);
  textFont('Helvetica');
  textSize(96);
  text(playerScore, width/10, height/6);
  text(compScore, width * 9/10, height/6);
  
}

function dispStartText(){
  
  //Display start text
  fill(255);
  textAlign(CENTER);
  textFont('Helvetica');
  textSize(48);
  text('Click to start', width/2, (height/2) - 40);
  text('Press R at any time to reset', width/2, (height/2) + 40);
  
}

function resetBall(){
  
  //Return ball to centre of canvas, at a complete stop.
  ball.xPos = width/2;
  ball.yPos = height/2;
  ball.xSpeed = 0;
  ball.ySpeed = 0;
  
}

function resetGame(){
  
  //Return to initial conditions
  resetBall();
  playerScore = 0;
  compScore = 0;
  playerBar.yPos = height/2;
  compBar.yPos = height/2;
  playerBar.barHeight = 100;
  compBar.barHeight = 100;
  playerBar.triple = false;
  compBar.triple = false;
  dispStartText();
  reset = true;
  
}

function mousePressed(){
  
  //Gives the ball momentum, either to start a round, or if it gets stuck in the middle/is very slow.
  reset = false;
  ball.xSpeed = random(-10,10);
  ball.ySpeed = random(-10,10);
}

function keyPressed(){
  
  //Calls resetGame() when r key is pressed
  if(keyCode == 82){
    resetGame();
  }
}