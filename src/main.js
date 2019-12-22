const WIDTH = 720;
const HEIGHT = 480;
const APP_FPS = 30;

// init
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
let canvas = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
const fpsDelta = 60 / APP_FPS;

let elapsedTime = 0;
let bg;
let isCatDragging = false;

let particleList = [];
let particleMax = 20;
let friction_coe = 0.95;

let container = new PIXI.Container();
container.width = 480;
container.height = 480;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
container.interactiveChildren = true;
app.stage.addChild(container);

// asset property
const ASSET_BG = "images/pic_bg.jpg";
const ASSET_CAT = "images/pic_star.png";

let TEXTURE_STAR;

PIXI.loader
  //.add("bg_data", ASSET_BG)
  .add("star_data", ASSET_CAT)
  .load(onAssetsLoaded);

/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
  // BG
  /*
  bg = new PIXI.Sprite(res.bg_data.texture);
  container.addChild(bg);
  bg.x = 0;
  bg.y = 0;
  */

  //TEXTURE_STAR = new PIXI.Sprite(res.star_data.texture);

  /*
  for (let i = 0; i < particleMax; i++) {
    let obj = new PIXI.Sprite(res.star_data.texture);
    obj.x = Math.floor(Math.random() * (WIDTH + 1 - 1)) + 1;
    obj.y = Math.floor(Math.random() * (HEIGHT + 1 - 1)) + 1;
    obj.anchor.set(0.5);
    obj.scale.set(0.5);
    obj.vx = 0;
    obj.vy = 0;
    container.addChild(obj);
    particleList.push(obj);
    // particleList[i] = obj;
  }*/

  // Text
  let text = new PIXI.Text("Particle Test\n(PixiJS 4.5.5)", {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0xf0fff0,
    align: "center",
    fontWeight: "bold",
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text);
  text.x = WIDTH / 2 - text.width / 2;
  text.y = 20;

  emitParticles(res.star_data.texture);

  // Ticker
  let ticker = PIXI.ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  PIXI.settings.TARGET_FPMS = 0.06;
  app.ticker.add(tick);
}

/**
 * adjust fps
 * @param { number } delta time
 */
const tick = delta => {
  // console.log(delta);
  elapsedTime += delta;

  updateParticles();

  if (elapsedTime >= fpsDelta) {
    //enough time passed, update app
    update(elapsedTime);
    //reset
    elapsedTime = 0;
  }
};

/**
 * app rendering
 * @param { number } delta time
 */
const update = delta => {
  // console.log("updade");

  /*
  for (let i = 0; i < particleMax; i++) {
    console.log("i: ", i);

    let p = particleList[i];
    console.log(p);
    // gravity
    p.vy += 1;

    // friction
    p.vx *= 0.95;
    p.vy *= 0.95;

    // move
    p.x += p.vx;
    p.y += p.vy;

    if (p.y >= HEIGHT - p.height / 2) {
      p.y = HEIGHT - p.height / 2;
      p.vy *= -1;
    }
  }
  */

  /*
  particleList.map((e) => {
    e.vy +=1;
    e.vx *= friction_coe;
    e.vy *= friction_coe;
    e.x += e.vx;
    e.y += e.vy;
    if (e.y >= HEIGHT - e.height / 2) {
      e.y = HEIGHT - e.height / 2;
      e.vy *= -1;
    }
    */

  // });

  app.render();
};

const emitParticles = res => {
  console.log("emitParticles()");
  for (let i = 0; i < particleMax; i++) {
    let obj = new PIXI.Sprite(res);
    obj.x = WIDTH/2;//Math.floor(Math.random() * (WIDTH + 1 - 1)) + 1;
    obj.y = Math.floor(Math.random() * (HEIGHT + 1 - 1)) + 1;
    //console.log(app.renderer.plugins.interaction.mouse.getLocalPosition(app.stage));
    //const position = app.renderer.plugins.interaction.mouse.getLocalPosition(displayObject);
    //console.log(app.stage.plugins.interaction.mouse.global.x);
    //obj.x = app.renderer.plugins.interaction.mouse.global.x;
    //obj.y = app.renderer.plugins.interaction.mouse.global.y;

    console.log(app.stage.mouseX);
    obj.anchor.set(0.5);
    obj.scale.set(0.5);
    obj.vx = 50 * (Math.random() - 0.5);//0;
    obj.vy = 50 * (Math.random() - 0.5);//0;
    obj.life = 100;
    container.addChild(obj);
    particleList.push(obj);
    // particleList[i] = obj;
  }
};

const updateParticles = () => {
  console.log("updateParticles()");
  particleList.map(e => {
    e.vy += 1;
    e.vx *= friction_coe;
    e.vy *= friction_coe;
    e.x += e.vx;
    e.y += e.vy;
    e.life -= 1;
    if (e.y >= HEIGHT - e.height / 2) {
      e.y = HEIGHT - e.height / 2;
      e.vy *= -1;
    }
    if (e.life <= 0) {
      container.removeChild(e);
      particleList.some((el, idx) => {
        el === e ? particleList.splice(idx, 1) : el;
      });
    }
  });
};
