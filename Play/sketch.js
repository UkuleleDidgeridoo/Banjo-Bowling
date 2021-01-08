let overhead;
let lightangle = 200;
let mumbo;
let mface;
let kick = 0;
let juju;
let jface;
let banjo;
let bpos;
let brot = 0;
//SCENEPOS
let mpos;
let ground;
let wall;
let fg;
let mvmt;
let grv;
let gw = 400;
let gl = 1200;
let cdepth = 80;
let cheight = -40;
let pincount = 3
let pins = []
let builder = 0
let e = 0
let time;
let edge = 0;
let recovery = 0;
let debug = 0;
let hits = [];
let hitcount = 0;
let win;
let font;
let victory = 1
let hud;
let sky;
let music = 0;
let lt1col;
let lt2col;
let lightlvl = 1
let ep;
let roll = 0
let weewoah = 0;
let buildfx = 0;
let vol = .8;
let st = 0

//SOUNDS
let winsong;
let fxjj;
let fxhit;
let fxroll;
let fxroll2;
let fxwee;
let fxwoah;
let fxmum;
let fxs1;
let fxs2;
let fxe;

function preload() {
  sky = loadImage('libraries/Textures/sky.png')
  mumbo = loadModel('libraries/Mumbo/mumbo.obj')
  mface = loadImage('libraries/Mumbo/image_0003.png')
  juju = loadModel('libraries/Juju/75c8.obj', true)
  jface = loadImage('libraries/Juju/image_0000.png')
  banjo = loadModel('libraries/Banjo/pumpkinbanjo.obj')
  bface = loadImage('libraries/Banjo/image_0000.png')
  ground = loadImage('libraries/Textures/BK-grass2.png')
  wall = loadImage('libraries/Textures/wall0.png')
  fg = loadImage('libraries/Textures/FG.png')
  font = loadFont('LithosPro-Regular.otf');
  winsong = loadSound('libraries/Sounds/HB.mp3')
  fxjj = loadSound('libraries/Sounds/jj.mp3')
  fxhit = loadSound('libraries/Sounds/hit.mp3')
  fxroll = loadSound('libraries/Sounds/roll.mp3')
  fxroll2 = loadSound('libraries/Sounds/roll2.mp3')
  fxwee = loadSound('libraries/Sounds/wee.mp3')
  fxwoah = loadSound('libraries/Sounds/woah.mp3')
  fxmum = loadSound('libraries/Sounds/mum.mp3')
  fxs1 = loadSound('libraries/Sounds/step1.mp3')
  fxs2 = loadSound('libraries/Sounds/step2.mp3')
  fxe = loadSound('libraries/Sounds/e.mp3')

}

function setup() {
  createCanvas(800, 800, WEBGL);
  //WINBOARD
  win = createGraphics(256, 256)
  win.fill(255)
  win.stroke(255, 0, 0)
  win.textFont(font);
  win.textSize(32);
  win.textAlign(CENTER);
  win.text('WINNER', win.width/2, win.height/2)
  //SCOREBOARD
  // hud = createGraphics(256, 256)
  // hud.textFont(font);
  // hud.fill(255)
  // hud.stroke(255, 100, 0)
  // hud.textSize(64)
  // hud.textAlign(RIGHT);

  //END PANEL
  ep = createGraphics(512, 512)
  ep.background(0)
  ep.fill(255, 255, 0)
  ep.stroke(255, 255, 0)
  ep.textFont(font)
  ep.textSize(12)
  ep.textAlign(CENTER);
  ep.text('HAPPY BIRTHDAY \n MIKE', 256, 256)

  winsong.onended(endPanel)
  fxe.onended(buildreset)

  textureWrap(MIRROR)

  overhead = createVector(lightangle, 400, 100)
  mpos = createVector(0, 0, (-gl/2 + 20))
  mvmt = createVector(3, 0, 0)
  bpos = createVector(5, 0, 0)
  for (let i=0; i<pincount; i++) {
    hits.push(0)
  }
  //LIGHT COLORS
  lt1col = createVector(200, 200, 200);
  lt2col = createVector(255, 255, 255);

  //SOUNDS
  fxjj.setVolume(.5)
  fxs1.setVolume(.3)
  fxs2.setVolume(.3)
  fxs1.playMode('untilDone')
  fxs2.playMode('untilDone')
  fxroll.playMode('untilDone')
  fxroll2.playMode('untilDone')
  fxe.playMode('untilDone')


}

function buildreset() {
  buildfx = 0
}

function keyTyped() {
  if (keyCode === 32 && victory && music == 0 && bpos.z > -5) {
    builder = 1
  }
  if (keyCode === 16) {
    debug = 1
  }
}

function keyReleased() {
  if (keyCode === 32 && victory && music == 0 && bpos.z > -5) {
    builder = 0
  } 
  // if (keyCode = 16) {
  //   debug = 0
  //   cdepth = 80
  // }
}

function endPanel() {
  lt1col.z = gl/2 + 2000
  cheight += 80
  cdepth += 700
  lightlvl = 0
  noLoop();
}

function draw() {

  //DEBUG
  // if (debug) {
  //   cdepth = -mouseX
  //   console.log("mpos ", mpos)
  // }

  //ENDGAME
  hitcount = hits.reduce((a,b) => a+b, 0)
  if (hitcount==pincount) {
    if (victory) {
      done = new winner()
      victory = 0
    }
    if (music == 0) {
      end = millis()
      winsong.play();
      music = 1
    } else {
      done.show(mpos)
      cdepth += 100 / (18 * 60)
    } 

  }

  //SET
  camera(0, cheight, cdepth, 0, -10, mpos.z - gl/2 - edge, 0, 1, 0);
  perspective(PI / 3.0, width / height, 0.1, 50000);
  directionalLight(lt1col.x, lt1col.y, lt1col.z, overhead)
  directionalLight(lt2col.x, lt2col.y, lt2col.z, overhead.x, overhead.y-200, overhead.z-500)
  ambientLight(120*lightlvl)
  noStroke();
  fxwoah.setVolume(vol)
  fxwee.setVolume(vol)
  

  //AIMING
  if (keyIsDown(68) && e==0 && bpos.z == 0 && victory && music == 0) {
    if (mpos.x >= -gw/2 + 20) {
    mpos.sub(mvmt)
    }
  } else if (keyIsDown(65) && e==0 && bpos.z == 0 && victory && music == 0) {
    if (mpos.x <= gw/2 - 20) {
      mpos.add(mvmt)
      }  
    }

  //WINDUP
  if (builder) {
    if (buildfx == 0) {
      fxe.rate(e/100)
      fxe.play()
      buildfx == 1
    }
    e += 1
    push();
    emissiveMaterial(255, 0, 0)
    translate(40, 0, 0)
    plane(5, 3*sqrt(e))
    pop();
  }

  //LAUNCH
  if (e > 0 && builder == 0) {
    weewoah = 0
    fxe.stop();
    if (roll == 0) {
      roll = 1
    }
    kick = -PI/4
    bpos.sub(0, 0, 3*sqrt(e))
    brot += sqrt(e)*PI/12
    bpos.y = -2+sin(PI + brot)
    cheight = -50
    cdepth = bpos.z + 80 + sqrt(3*-bpos.z)
    time = millis()
  } else {roll = 0}

  if (roll==1) {
    fxmum.play();
    fxroll.loop();
    fxroll2.loop();
    roll = 2
  } else if (roll == 0 && bpos.z <= -gl) {
    fxroll.stop();
    fxroll2.stop();
    if (frameCount % 2 === 0 && weewoah == 0) {
      
      fxwee.play();
      weewoah = 1
    } else if (frameCount % 2 !== 0 && weewoah == 0){
      fxwoah.play();
      weewoah = 1
    }
  }


  //RECOVERY
  if (bpos.z <= -gl) {
    vol *= .98
    e = 0
    bpos.sub(0, -5, 5)    
    cdepth += 2
    if (millis() > time + 2500) {
      e = 0
      cdepth = 80
      cheight = -40
      kick = 0
      mpos = createVector(0, 0, -gl/2 + 20)
      bpos = createVector(5, 0, 0)
      console.log(hitcount, "/", pincount)
      weewoah = 0
      vol = .8


    }

  }

  //SKY
  push();
  texture(sky);
  translate(mpos.x, mpos.y, mpos.z-3000);
  plane(5000, 5000);
  pop();

  //GROUND
  push();
  translate(mpos);
  texture(ground);
  rotateX(PI/2);
  plane(gw,gl);
  pop();

  //FOREGROUND
  push();
  translate(mpos.x, mpos.y, mpos.z + gl/2 + 100);
  rotateX(PI/2);
  texture(ground);
  plane(gw, 200);
  pop();
  //FOREGROUND 2
  push();
  translate(mpos.x, mpos.y+1, mpos.z + gl/2 + 199);
  rotateX(PI/2);
  texture(fg);
  plane(gw, 200);
  pop();

  //LEFTWALL
  push();
  texture(wall)
  translate(mpos.x - gw/2, mpos.y - gw/4, mpos.z+50)
  rotateY(PI/2)
  plane(gl + 100, gw/2)
  pop();

  //RIGHTWALL
  push();
  texture(wall);
  translate(mpos.x + gw/2, mpos.y - gw/4, mpos.z+50);
  rotateY(PI/2);
  plane(gl + 100, gw/2);
  pop();

  //CLIFF1
  push();
  texture(wall);
  translate(mpos.x, mpos.y + 2500, mpos.z-gl/2);
  plane(5000, 5000);
  pop();
  
  //GROUNDS
  push();
  texture(ground)
  translate(mpos.x, mpos.y+2, mpos.z - gl/2 + 500)
  rotateX(PI/2)
  plane(10000, 1000)
  pop();



  //MUMBO
  push();
  translate(0, 0, 0)
  rotateX(PI)
  if (music ==  0) {
    rotateY(kick + (sin(mpos.x/10) * PI/64))
    rotateZ(sin(mpos.x/8) * PI/64)
    if (sin(mpos.x/8) > 0 && mpos.x % 18 == 0 && st == 0) {
      st = 1
      fxs1.play();
    } else if (sin(mpos.x/8) < 0 && mpos.x % 18 == 0 && st == 1) {
      fxs2.play();
      st = 0
    }
  } else {
    rotateY(PI/12 * sin(frameCount * 255/360/5))
  }
  texture(mface)
  model(mumbo)
  pop();
  
  //JUJU
  let rowmax = 2
  if (pins.length < pincount) {
    if (pincount <= rowmax) {
      for (let i=0; i<pincount; i++) {
        let pinpos = i*gw/pincount + gw/pincount/2
        pins.push(new jj(-gw/2 + pinpos, 0, -gl/2+20));
      }
    } else {
      let rem = pincount
      let row = 0
      for (let j=0; j<pincount%rowmax + 1; j++) {
        rem -= row
        if (rem==0) {
          break
        } else if (rem >= rowmax) {
          row = rowmax
        } else {
          row = rem
        }
        for (let i=0; i<row; i++) {
          let pinz = j*100
          let pinpos = i*gw/row + gw/row/2
          pins.push(new jj(-gw/2 + pinpos, -40, -gl/2+20 + pinz));
        }
      }
    }
  }
  for (let j of pins) {
    for (let k of pins) {
      if (k.id !== j.id) {
        j.bump(k.pos)
      }
    }
    j.update(mpos)
    j.collide(bpos)
    j.show()
  }
  

  //BANJO
  push();
  //emissiveMaterial(200, 100, 100)
  texture(bface)
  translate(bpos)
  rotateX(PI + brot)
  model(banjo);
  pop();

  //HBM
  push();
  translate(mpos.x, mpos.y, mpos.z + gl/2 + 500)
  texture(ep)
  plane(512, 512)
  pop();
  
} 