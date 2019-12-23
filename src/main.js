// import "pixi-filters";
// import * as filters from "pixi-filters";
console.log(PIXI.filters);

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
let particleMax = 10;
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
const ASSET_LIGHT = "images/pic_light_p8_c32_yellow.png";

let TEXTURE_OBJ;
let isSetupEnd = false;
const MAX_LIFE = 150;

PIXI.loader
  .add("bg_data", ASSET_BG)
  .add("star_data", ASSET_LIGHT)
  .load(onAssetsLoaded);

/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
  // BG
  bg = new PIXI.Sprite(res.bg_data.texture);
  container.addChild(bg);
  bg.x = 0;
  bg.y = 0;

  // texture refernce
  TEXTURE_OBJ = Object.assign({}, res.star_data.texture);

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

  // Text2
  let text2 = new PIXI.Text("MouseOver the Stage(PC only)", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xff0033,
    align: "center",
    fontWeight: "bold",
    stroke: "#000000",
    strokeThickness: 5,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text2);
  text2.x = WIDTH / 2 - text2.width / 2;
  text2.y = HEIGHT - text2.height - 20;

  // Ticker
  let ticker = PIXI.ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  PIXI.settings.TARGET_FPMS = 0.06;
  app.ticker.add(tick);

  isSetupEnd = true;
}

/**
 * adjust fps
 * @param { number } delta time
 */
const tick = delta => {
  // console.log(delta);
  elapsedTime += delta;

  if (isSetupEnd) {
    emitParticles();
    updateParticles();
  }

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
const update = delta => app.render();

const emitParticles = () => {
  // console.log("emitParticles()");
  for (let i = 0; i < particleMax; i++) {
    let obj = new PIXI.Sprite(TEXTURE_OBJ);
    // obj.x = WIDTH/2;//Math.floor(Math.random() * (WIDTH + 1 - 1)) + 1;
    // obj.y = Math.floor(Math.random() * (HEIGHT + 1 - 1)) + 1;
    // console.log(
    //  app.renderer.plugins.interaction.mouse.getLocalPosition(app.stage)
    //); // x:112 y:117、会社PCだとok？
    // const position = app.renderer.plugins.interaction.mouse.getLocalPosition(displayObject);
    // console.log(app.stage.plugins.interaction.mouse.global.x);
    obj.x = app.renderer.plugins.interaction.mouse.global.x; // 会社PCだとok？
    obj.y = app.renderer.plugins.interaction.mouse.global.y; // 会社PCだとok？

    // anchor
    obj.anchor.set(0.1);

    // scale
    let scale = Math.random() * 0.1 + 0.05;
    obj.scale.set(scale);

    // obj.alpha = 0.5;
    obj.vx = 50 * (Math.random() - 0.5); //0;
    obj.vy = 50 * (Math.random() - 0.5); //0;
    obj.life = MAX_LIFE;

    // tint ver, too dark
    // let color = ((Math.random() * 0xffffff) | 0).toString(16);
    // let randomColor = "#" + ("ffffff" + color).slice(-6);
    // console.log("randomColor: ", randomColor);
    // obj.tint = `0x${randomColor}`;

    // colorMatrix ver.
    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    obj.filters = [colorMatrix];

    let hue = Math.floor(Math.random() * 360) + 0;
    obj.hue = hue;
    colorMatrix.hue(hue, 1);

    // Effective when not using colormatorix
    // obj.blendMode = PIXI.BLEND_MODES.ADD;

    container.addChild(obj);
    particleList.push(obj);
  }
};

const updateParticles = () => {
  // console.log("updateParticles()");
  particleList.map(e => {
    e.vy += 1;
    e.vx *= friction_coe;
    e.vy *= friction_coe;
    e.x += e.vx;
    e.y += e.vy;

    // small increments
    let oldScale = e.scale.x;
    let newScale = (e.life / MAX_LIFE) * oldScale;
    e.scale.set(newScale);

    // change color
    /*
    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    e.hue +=1;
    e.hue >= 360 ? e.hue = 0 : e.hue;
    colorMatrix.hue(e.hue, 1); // blend addと二律背反？
    e.filters = [colorMatrix];
    */

    e.life -= 0.5;

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
