"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

let clicks = {};
let types = {};

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  types = {};
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 32;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];


function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  console.log(i, j);
}


function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    let type = [i, j];
    types[type] = "w"

    let topleft = 10;
    let topright = 10;
    let bottomright = 10;
    let bottomleft = 10;

    if (types[[i, j-1]] == "w") {
      //up
      topleft = 0;
      topright = 0;
    }
    if (types[[i+1, j]] == "w") {
      //right
      topright = 0;
      bottomright = 0;
    }
    if (types[[i, j+1]] == "w") {
      //down
      bottomright = 0;
      bottomleft = 0;
    }
    if (types[[i-1, j]] == "w") {
      //left;
      topleft = 0;
      bottomleft = 0;
    }


    fill("#557d30")
    rect(0, 0, tw, tw)
    fill("blue");
    beginShape();
    square(0, 0, tw, topleft, topright, bottomright, bottomleft)
    endShape(CLOSE);
    pop();
    push();
    riverGeneration(i, j);


    return;
  }
  if (n > 1 && n % 2 == 0) {
    removeRiver(i, j);
  }

  if (noise(i, j) > 0.6) {
    let type = [i, j];
    types[type] = "d"

    let topleft = 10;
    let topright = 10;
    let bottomright = 10;
    let bottomleft = 10;

    if (types[[i, j-1]] == "d") {
      //up
      topleft = 0;
      topright = 0;
    }
    if (types[[i+1, j]] == "d") {
      //right
      topright = 0;
      bottomright = 0;
    }
    if (types[[i, j+1]] == "d") {
      //down
      bottomright = 0;
      bottomleft = 0;
    }
    if (types[[i-1, j]] == "d") {
      //left;
      topleft = 0;
      bottomleft = 0;
    }

    fill("#557d30")
    rect(0, 0, tw, tw)
    fill("#936843")
    beginShape();
    square(0, 0, tw, topleft, topright, bottomright, bottomleft)
    endShape(CLOSE);
    pop();
    push();

  }
  else {
    fill("#557d30")
  }

  push();

  beginShape();
  vertex(0, 0);
  vertex(0, tw);
  vertex(th, tw);
  vertex(th, 0);
  endShape(CLOSE);
  
  pop();
}

function riverGeneration(i, j) {
  if (noise(i, j) > 0.75) {
    //up
    j++;
  }
  else if (noise(i, j) > 0.5) {
    //right
    i++;
  }
  else if (noise(i, j) > 0.25) {
    //down
    j--;
  }
  else {
    //left;
    i--;
  }
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 0) {
    p3_tileClicked(i, j);
  }
}

function removeRiver(i, j) {
  if (noise(i, j) > 0.75) {
    //up
    j++;
  }
  else if (noise(i, j) > 0.5) {
    //right
    i++;
  }
  else if (noise(i, j) > 0.25) {
    //down
    j--;
  }
  else {
    //left;
    i--;
  }
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    p3_tileClicked(i, j);
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(0, 0);
  vertex(0, tw);
  vertex(th, tw);
  vertex(th, 0);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("(" + [i, j] + ")", 0, 0);
}

function p3_drawAfter() {}
