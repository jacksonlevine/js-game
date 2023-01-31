import './css/styles.css';
import ImprovedNoise from "./perlin.js";

onload = function () {
  let levels = new Array(
    "gg",
    "gg",
    "gg",
    "gg",
    "gg",
    "aa",
    "nn",
    "rr",
    "pp",
    "ss",
    "oo",
    "qq",
  );

  let deltaTime = 0;


  let playx = 0.0;
  let playy = 0.0;

  let mobSkins = [];

  const defaultSkin = [
    "qqggqq" +
    "ggqqgg" +
    "qqggqq" +
    "ggoogg" +
    "ooggoo",

    "qqgggg" +
    "xxqqgg" +
    "ggooqq" +
    "yyyyyy" +
    "ooggoo",

    "ggqqgg" +
    "xxooxx" +
    "ggqqgg" +
    "yyooyy" +
    "ooggoo",

    "ggggqq" +
    "ggqqxx" +
    "qqoogg" +
    "yyyyyy" +
    "ooggoo"
  ];
  const ginkSkin =
    [
      "pppppppppppppp" +
      "ppppqqqqqqpppp" +
      "ppqqqqqqqqqqpp" +
      "ppqqqqqqqqqqpp" +
      "ppqqqqqqqqqqpp" +
      "ppqqppqqqqqqpp" +
      "pppppppppppppp",

      "pppppppppppppp" +
      "ppppqqqqqqpppp" +
      "ppggaaqqqqqqpp" +
      "ppqqqqqqqqqqpp" +
      "aaaaqqqqqqqqpp" +
      "ppqqppqqqqqqpp" +
      "pppppppppppppp",

      "pppppppppppppp" +
      "ppppqqqqqqpppp" +
      "ppaaggqqggaapp" +
      "ppqqqqqqqqqqpp" +
      "ppqqaaaaaaqqpp" +
      "ppqqppqqqqqqpp" +
      "pppppppppppppp",

      "pppppppppppppp" +
      "ppppqqqqqqpppp" +
      "ppqqqqqqaaggpp" +
      "ppqqqqqqqqqqpp" +
      "ppqqqqqqqqaaaa" +
      "ppqqppqqqqqqpp" +
      "pppppppppppppp",
    ];

  mobSkins.push(defaultSkin);
  mobSkins.push(ginkSkin);

  let mobiles = [];
  let statics = new Map();

  for (let i = 0; i < 1300; i++) {
    let x = (Math.random() * 2000) - 1000;
    let y = (Math.random() * 2000) - 1000;
    let rock = {
      x: x,
      y: y,
      width: 8,
      height: 4,
      thing:
        "000qqo00" +
        "0oqqqoo0" +
        "aooqqqoo" +
        "gaaoooqo"
    };
    statics.set(parseInt(x) + "," + parseInt(y), rock);
  }

  for (let i = 0; i < 2000; i++) {
    let x = (Math.random() * 2000) - 1000;
    let y = (Math.random() * 2000) - 1000;
    let tree = {
      x: x,
      y: y,
      width: 26,
      height: 14,
      thing: makeTree()
    };
    statics.set(parseInt(x) + "," + parseInt(y), tree);
  }

  for (let i = 0; i < 3000; i++) {
    let x = (Math.random() * 2000) - 1000;
    let y = (Math.random() * 2000) - 1000;
    let tree = {
      x: x,
      y: y,
      width: 25,
      height: 25,
      thing: makeBigTree()
    };
    statics.set(parseInt(x) + "," + parseInt(y), tree);
  }

  for (let i = 0; i < 2000; i++) {
    let x = (Math.random() * 2000) + 1000;
    let y = (Math.random() * 2000) + 500;
    let tree = {
      x: x,
      y: y,
      width: 26,
      height: 14,
      thing: makeTree()
    };
    statics.set(parseInt(x) + "," + parseInt(y), tree);
  }

  for (let i = 0; i < 3000; i++) {
    let x = (Math.random() * 2000) + 7000;
    let y = (Math.random() * 2000) + 750;
    let tree = {
      x: x,
      y: y,
      width: 25,
      height: 25,
      thing: makeBigTree()
    };
    statics.set(parseInt(x) + "," + parseInt(y), tree);
  }


  let player = {
    x: 0,
    y: 0,
    myIndex: mobiles.length,
    direction: 0,
    foottimer: 0.0,
    isWalking: false,
    leftfoot: false,
    id: 0,
    width: 3,
    height: 5,
    elevation: 0
  };
  mobiles.push(player);

  let player2 = {
    x: 0,
    y: 0,
    myIndex: mobiles.length,
    direction: 3,
    foottimer: 0.0,
    isWalking: false,
    leftfoot: false,
    id: 1,
    width: 7,
    height: 7,
    elevation: 0
  };
  mobiles.push(player2);

  let player3 = {
    x: 14,
    y: 6,
    myIndex: mobiles.length,
    direction: 2,
    foottimer: 0.0,
    isWalking: false,
    leftfoot: false,
    id: 1,
    width: 7,
    height: 7,
    elevation: 0
  };
  mobiles.push(player3);

  let playheight = window.innerHeight / 24;
  let playwidth = window.innerWidth / 18;
  let statOverscan = 20;

  function noiseValueFromCoord(i, j, scale, offset) {
    let heel2 = ImprovedNoise.noise(parseFloat((i) / 5.1), parseFloat(j) / 5.1, 7.2) * 2;
    let heel1 = ImprovedNoise.noise(parseFloat((i) / 300.1), parseFloat(j) / 300.1, 7.2) * levels.length + 2;
    let heel = parseInt((ImprovedNoise.noise(parseFloat((i) / 50.1), parseFloat(j) / 50.1, 10.2) * levels.length + 2) + parseFloat(heel1) + parseFloat(heel2));
    if (scale != null && offset === null) {
      return heel * scale;
    } else
    if (scale != null && offset != null) {
      return (heel + offset) * scale;
    } else {
      return heel;
    }
  }

  function isWater(x, y) {
    return (noiseValueFromCoord(parseInt(x), parseInt(y)) < 1);
  }
  let mobSpots = new Map();
  let statSpots = new Map();
  let overSpots = new Map();
  function stringBuild() {
    playheight = window.innerHeight / 24;
    playwidth = window.innerWidth / 19.5;
    var theString = "";
    mobSpots = new Map();
    statSpots = new Map();
    overSpots = new Map();
    for (let j = playheight + statOverscan; j > 0; j--) {
      for (let i = -statOverscan; i < playwidth + statOverscan; i += 19) {
        theString += oneCharStringBuild(i, j);
        theString += oneCharStringBuild(i + 1, j);
        theString += oneCharStringBuild(i + 2, j);
        theString += oneCharStringBuild(i + 3, j);
        theString += oneCharStringBuild(i + 4, j);
        theString += oneCharStringBuild(i + 5, j);
        theString += oneCharStringBuild(i + 6, j);
        theString += oneCharStringBuild(i + 7, j);
        theString += oneCharStringBuild(i + 8, j);
        theString += oneCharStringBuild(i + 9, j);
        theString += oneCharStringBuild(i + 10, j);
        theString += oneCharStringBuild(i + 11, j);
        theString += oneCharStringBuild(i + 12, j);
        theString += oneCharStringBuild(i + 13, j);
        theString += oneCharStringBuild(i + 14, j);
        theString += oneCharStringBuild(i + 15, j);
        theString += oneCharStringBuild(i + 16, j);
        theString += oneCharStringBuild(i + 17, j);
        theString += oneCharStringBuild(i + 18, j);
      }
      if (j < playheight) {
        theString += "\n";
      }
    }
    return theString;
  }

  let miniMapX = 3;
  let miniMapWidth = 9;
  let miniMapY = miniMapWidth + 2;
  function oneCharStringBuild(i, j) {
    let theString = "";
    let iterationX = i + playx;
    let iterationY = j + playy;
    let heel = noiseValueFromCoord(i + playx, j + playy);
    let isMob = false;
    let isStat = false;
    let coordChar = parseInt(iterationX) + "," + parseInt(iterationY);

    if (parseInt(i) === miniMapX && parseInt(j) === miniMapY) {
      for (let m = miniMapWidth; m > 0; m--) {
        for (let n = 0; n < miniMapWidth; n++) {
          let mmSpot = parseInt(iterationX + n) + "," + parseInt(iterationY - m);

          let overPix;
          if (m === miniMapWidth || m === 1) {
            overPix = {
              brick: "yy"
            };
            if (!overSpots.has(mmSpot)) {
              overSpots.set(mmSpot, overPix);
            }
          } else {
            overPix = {
              brick: "gg"

            };
            if (!overSpots.has(mmSpot)) {
              overSpots.set(mmSpot, overPix);
            }
          }
        }
      }
    } else {

      if (statics.has(coordChar)) {
        let stat = statics.get(coordChar);
        let statWidth = stat.width;
        let statHeight = stat.height;
        for (let t = 0; t < statHeight; t++) {
          for (let c = 0; c < statWidth; c++) {
            let charOfTheStat = stat.thing.charAt((t * statWidth) + c);
            if (charOfTheStat != "0") {
              var statPixel = {
                x: parseInt(iterationX) + c,
                y: parseInt(iterationY) - t,
                brick: "" + charOfTheStat + charOfTheStat,
                statX: iterationX,
                statY: iterationY,
                sHeight: statHeight
              };
              if (!statSpots.has(parseInt(iterationX + c) + "," + parseInt(iterationY - t))) {
                statSpots.set(parseInt(iterationX + c) + "," + parseInt(iterationY - t), statPixel);
              }
            }
          }
        }

      }
    }
    for (let a = 0; a < mobiles.length; a++) {
      let mobY = ((isWater(mobiles[a].x, mobiles[a].y)) ? Math.min(Math.floor(mobiles[a].y + noiseValueFromCoord(mobiles[a].x, mobiles[a].y, 1, 0)), mobiles[a].y) : (mobiles[a].y + noiseValueFromCoord(mobiles[a].x, mobiles[a].y, .5, 0))) + mobiles[a].height + mobiles[a].elevation;
      let mobX = mobiles[a].x - Math.floor(mobiles[a].width / 2);
      if (parseInt(mobX) === parseInt(iterationX) && parseInt(mobY) === parseInt(iterationY)) {
        let mobID = mobiles[a].id;
        let mobWidth = mobiles[a].width;
        let isInWater = isWater(mobiles[a].x, mobiles[a].y);
        let mobHeight = (isInWater) ? Math.floor(Math.min(mobiles[a].height + (noiseValueFromCoord(mobiles[a].x, mobiles[a].y, 1, -1)), mobiles[a].height)) : mobiles[a].height;

        if (mobiles[a].isWalking) {
          if (mobiles[a].foottimer > 100) {
            mobiles[a].leftfoot = !mobiles[a].leftfoot;
            mobiles[a].foottimer = 0;
          } else {
            mobiles[a].foottimer += deltaTime * 5;
          }
        }
        for (let m = 0; m < mobHeight; m++) {
          for (let o = 0; o < mobWidth; o++) {
            var mobPixel = {
              x: parseInt(iterationX) + o,
              y: parseInt(iterationY) - m,
              brick: "" + mobSkins[mobID][mobiles[a].direction].charAt((((m * mobWidth) + o) * 2)) + mobSkins[mobID][mobiles[a].direction].charAt((((m * mobWidth) + o) * 2) + 1),
              mobX: iterationX,
              mobY: iterationY
            };
            if (!isInWater) {
              if (o === mobWidth - 1 && m === mobHeight - 1) {
                if (mobiles[a].leftfoot) {
                  mobPixel.brick = "gg";
                }
              }
              if (o === 0 && m === mobHeight - 1) {
                if (!mobiles[a].leftfoot) {
                  mobPixel.brick = "gg";
                }
              }
            }
            if (!mobSpots.has(parseInt(iterationX + o) + "," + parseInt(iterationY - m))) {
              mobSpots.set(parseInt(iterationX + o) + "," + parseInt(iterationY - m), mobPixel);
            }
          }
        }

      }
    }
    let isOverlay = false;
    let mobPix = {};
    let rightnowbrick = "";
    if (overSpots.has(coordChar)) {
      isOverlay = true;
      rightnowbrick = overSpots.get(coordChar).brick;
    } else {
      if (mobSpots.has(coordChar)) {
        mobPix = mobSpots.get(coordChar);
        rightnowbrick = mobPix.brick;
        isMob = true;
      }
      if (statSpots.has(coordChar)) {
        let statPix = statSpots.get(coordChar);
        if (isMob) {
          if (Object.hasOwn(mobPix, 'mobY')) {
            if (mobPix.mobY - 5 > statPix.statY - statPix.sHeight) {
              rightnowbrick = statPix.brick;
            }
          }
        } else {
          rightnowbrick = statPix.brick;
        }
        isStat = true;
      }
    }
    if (i > 0 && i < playwidth && j > 0 && j < playheight) {
      if (isMob || isStat || isOverlay) {
        theString = rightnowbrick;
      } else {
        if (heel <= levels.length - 1 && heel > 0) {
          theString = levels[heel];
        } else {
          if (heel > levels.length - 1) {
            theString = levels[levels.length - 1];
          } else {
            let date = new Date();
            if (parseInt(ImprovedNoise.noise(parseFloat(iterationX) / 10, parseFloat(iterationY) / 10, date.getTime() / 10000) * 10) === 0 && parseInt((iterationY * playwidth) + iterationX) % 4 === 0) {
              theString = levels[0];
            } else {
              theString = "gg";
            }
          }
        }
      }
    }
    return theString;
  }

  let mmWidth = 15;
  let mmHeight = 15;
  function miniMapString() {
    if (playwidth < playheight) {
      mmWidth = playwidth / 5;
      mmHeight = playheight / 3;
    } else {
      mmWidth = playwidth / 5;
      mmHeight = playwidth / 5;
    }

    let stringy = "";
    for (let y = mobiles[player.myIndex].y + (mmHeight * 8); y > mobiles[player.myIndex].y - (mmHeight * 8); y -= 8) {
      for (let x = mobiles[player.myIndex].x - (mmWidth * 8); x < mobiles[player.myIndex].x + (mmWidth * 8); x += 8) {
        if (Math.floor(noiseValueFromCoord(x, y)) > 0) {
          stringy += levels[Math.min(parseInt(noiseValueFromCoord(x, y)), levels.length - 1)];
        } else {
          stringy += "gg";
        }
      }
      stringy += "\n";
    }
    return stringy;
  }
  function miniMap2String() {
    let stringy = "";
    for (let y = mobiles[player.myIndex].y + mmHeight; y > mobiles[player.myIndex].y - mmHeight; y--) {
      for (let x = mobiles[player.myIndex].x - mmWidth; x < mobiles[player.myIndex].x + mmWidth; x++) {
        if (statics.has(Math.round(x) + "," + Math.round(y))) {
          stringy += "qq";
        } else {
          stringy += "gg";
        }
      }
      stringy += "\n";
    }
    return stringy;
  }

  let water2 = false;
  let waterTimer = 0;
  let jump = false;
  let jumpTimer = 0;

  function updateTime() {

    let coordShower = document.getElementById("afterward");
    let coords = "" + playx + ", " + playy;

    coordShower.innerText = coords;

    var currentTime = new Date();
    var firsttime = currentTime.getTime();

    var smallstep = 10;
    mobiles[player.myIndex].x = parseInt(playx) + parseInt(playwidth / 2) + parseInt(mobiles[player.myIndex].width / 5);
    mobiles[player.myIndex].y = parseInt(playy) + parseInt(playheight / 2) - (mobiles[player.myIndex].height);
    while (deltaTime > smallstep) {
      deltaTime -= smallstep;
    }

    if (waterTimer > 100) {
      waterTimer = 0;
      water2 = !water2;
    } else {
      waterTimer += deltaTime;
    }
    if (water2) {
      levels[0] = "gx";
    } else {
      levels[0] = "xg";
    }

    if (jump) {
      jumpTimer += deltaTime;
      mobiles[player.myIndex].elevation += Math.round((50 - jumpTimer) / 25);
      if (jumpTimer > 1 && mobiles[player.myIndex].elevation <= 0) {
        jump = false;
        jumpTimer = 0;
        mobiles[player.myIndex].elevation = 0;
        if (mobiles[player.myIndex].isWalking) {
          switch (mobiles[player.myIndex].direction) {
          case 0:
            key = "w";
            break;
          case 1:
            key = "a";
            break;
          case 2:
            key = "s";
            break;
          case 3:
            key = "d";
            break;
          default:
            break;
          }
        } else {
          key = "";
        }
      }
    }

    if (isMyTouchDown) {
      playx += parseInt(xdifferential);
      playy -= parseInt(ydifferential);
      if (Math.abs(ydifferential) > Math.abs(xdifferential)) {
        if (ydifferential > 0) {
          mobiles[player.myIndex].direction = 2;
          mobiles[player.myIndex].isWalking = true;
        } else
        if (ydifferential < 0) {
          mobiles[player.myIndex].direction = 0;
          mobiles[player.myIndex].isWalking = true;
        }
      } else {
        if (xdifferential < 0) {
          mobiles[player.myIndex].direction = 1;
          mobiles[player.myIndex].isWalking = true;
        } else
        if (xdifferential > 0) {
          mobiles[player.myIndex].direction = 3;
          mobiles[player.myIndex].isWalking = true;
        }
      }
    } else {
      if (key === "null") {
        mobiles[player.myIndex].isWalking = false;
      }
    }

    document.getElementById('time_span').textContent = "" + stringBuild();
    document.getElementById('miniMap').textContent = "" + miniMapString();
    document.getElementById('miniMap2').textContent = "" + miniMap2String();

    if ((document.activeElement).getAttribute("type") != "text") {
      if (key != "null") {
        switch (key) {
        case "ArrowDown": case "s": case "S":
          playy -= 1;
          mobiles[player.myIndex].direction = 2;
          mobiles[player.myIndex].isWalking = true;
          break;
        case "ArrowUp": case "w": case "W":
          playy += 1;
          mobiles[player.myIndex].direction = 0;
          mobiles[player.myIndex].isWalking = true;
          break;
        case "ArrowLeft": case "a": case "A":
          playx -= 1;
          mobiles[player.myIndex].direction = 1;
          mobiles[player.myIndex].isWalking = true;
          break;
        case "ArrowRight": case "d": case "D":
          playx += 1;
          mobiles[player.myIndex].direction = 3;
          mobiles[player.myIndex].isWalking = true;
          break;
        case "Space": case " ":
          jump = true;
          if (mobiles[player.myIndex].isWalking) {
            switch (mobiles[player.myIndex].direction) {
            case 0:
              playy += 1;
              break;
            case 1:
              playx -= 1;
              break;
            case 2:
              playy -= 1;
              break;
            case 3:
              playx += 1;
              break;
            default:
              break;
            }
          }
          break;
        default:
          mobiles[player.myIndex].isWalking = false;
          key = "null";
        }
      }
    }
    currentTime = new Date();
    let time = currentTime.getTime();

    deltaTime += time - firsttime;
  }


  let key = "";

  let currTouchX = 0;
  let currTouchY = 0;

  window.addEventListener("touchstart", touchStartMethod, true);

  function touchStartMethod(event) {
    if (event.defaultPrevented) {
      return;
    }

    for (let i = 0; i < event.touches.length; i++) {
      currTouchX = event.touches[i].pageX;
      currTouchY = event.touches[i].pageY;

    }
    isMyTouchDown = true;

    event.preventDefault();
  }

  let isMyTouchDown = false;
  window.addEventListener("touchend", touchEndMethod, true);

  function touchEndMethod(event) {
    if (event.defaultPrevented) {
      return;
    }

    isMyTouchDown = false;


    event.preventDefault();
  }

  let ydifferential = 0;
  let xdifferential = 0;

  window.addEventListener("touchmove", touchMoveMethod, true);

  function touchMoveMethod(event) {
    if (event.defaultPrevented) {
      return;
    }


    for (let i = 0; i < event.changedTouches.length; i++) {
      xdifferential = parseInt(Math.min(Math.max((event.changedTouches[i].pageX - currTouchX) / 16, -1), 1));
      ydifferential = parseInt(Math.min(Math.max((event.changedTouches[i].pageY - currTouchY) / 16, -1), 1));
      if (currTouchY > event.changedTouches[i].pageY) {
        event.preventDefault();
      }
    }
    event.preventDefault();
  }

  let color1 = document.getElementById("foreColor");
  let color2 = document.getElementById("backColor");
  color1.oninput = setUserColor;
  color2.oninput = setUserColor;

  function setUserColor() {
    let html = document.querySelector("html");
    let color1 = document.getElementById("foreColor").value;
    let color2 = document.getElementById("backColor").value;

    if (color1 != "#000000") {
      html.style.color = color1;
    }
    html.style.backgroundColor = color2;

  }

  let terminal = document.querySelector(".terminal");
  let form = document.querySelector("form");

  form.onsubmit = function (event) {
    event.preventDefault();
    let text = document.getElementById("inputText").value;
    let msg = document.createElement("p");
    msg.textContent = text;
    msg.setAttribute("id", "chatmsg");
    terminal.appendChild(msg);
    form.reset();
  };

  function removeChatMsg() {
    if (document.querySelector("#chatmsg") != null) {
      terminal.removeChild(document.querySelector("#chatmsg"));
    }
  }

  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return;
    }

    key = event.key;

    if ((document.activeElement).getAttribute("type") != "text") {
      event.preventDefault();
    }
  }, true);

  let deltaTimes = 0;
  let amtToAverage = 50;
  for (let i = 0; i < amtToAverage; i++) {
    updateTime();
    deltaTimes += deltaTime;
  }
  deltaTime = deltaTimes / amtToAverage;

  setInterval(updateTime, 30);

  setInterval(removeChatMsg, 10000);
};

function makeTree() {
  let intString = [];
  let width = 26;
  let height = 14;
  let amplitudeX = 3;
  for (let j = 0; j < width; j++) {
    for (let i = 0; i < height; i++) {
      intString.push(0);
    }
  }
  let initialSpot = {
    x: parseInt(width / 2),
    y: height - 1
  };
  let initialDirection = {
    x: (Math.random() - 0.5),
    y: 1
  };
  let trunkheight = Math.min(Math.random() * 10, 5);
  let nextSpot = {
    x: 0,
    y: 0
  };
  for (let i = 0; i < trunkheight; i++) {
    intString[(parseInt(initialSpot.y) * width) + parseInt(initialSpot.x)] = 1;
    initialSpot.x += initialDirection.x;
    initialSpot.y -= initialDirection.y;
    nextSpot.x = initialSpot.x;
    nextSpot.y = initialSpot.y;
  }
  let nextSpots = [];
  for (let i = 0; i < 3; i++) {
    let branchlength = Math.min(Math.random() * 5, 3);
    let nextSpot2 = {
      x: 0,
      y: 0
    };
    let newDirection = {
      x: (Math.random() - 0.5) * amplitudeX,
      y: 1
    };
    for (let b = 0; b < branchlength; b++) {
      intString[(parseInt(nextSpot.y) * width) + parseInt(nextSpot.x)] = 1;
      nextSpot.x += newDirection.x;
      nextSpot.y -= newDirection.y;
      nextSpot2.x = initialSpot.x;
      nextSpot2.y = initialSpot.y;
    }
    nextSpots.push(nextSpot2);
  }
  let nextSpotsClone = [...nextSpots];
  let leafspots = [];
  for (let i = 0; i < 3; i++) {
    for (let t = 0; t < 3; t++) {
      let finlength = Math.min(Math.random() * 5, 3);
      let newDirection = {
        x: (Math.random() - 0.5) * amplitudeX,
        y: 1
      };
      let endOfThisBranch = {
        x: 0,
        y: 0
      };
      for (let b = 0; b < finlength; b++) {
        intString[(parseInt(nextSpots[i].y) * width) + parseInt(nextSpots[i].x)] = 1;
        nextSpots[i].x += newDirection.x;
        nextSpots[i].y -= newDirection.y;
        endOfThisBranch.x = nextSpots[i].x;
        endOfThisBranch.y = nextSpots[i].y;
      }
      leafspots.push(endOfThisBranch);
    }
    nextSpots = [...nextSpotsClone];
  }
  for (let i of leafspots) {
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x)] = 3;
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x - 1)] = 3;
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x + 1)] = 3;
    intString[(parseInt(i.y) * width) + parseInt(i.x - 1)] = 2;
    intString[(parseInt(i.y) * width) + parseInt(i.x + 1)] = 2;
    intString[(parseInt(i.y) * width) + parseInt(i.x - 2)] = 2;
    intString[(parseInt(i.y) * width) + parseInt(i.x + 2)] = 2;
  }
  let string = "";
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      if (intString[(j * width) + i] === 0) {
        string += "0";
      }
      if (intString[(j * width) + i] === 1) {
        string += "a";
      }
      if (intString[(j * width) + i] === 2) {
        string += "t";
      }
      if (intString[(j * width) + i] === 3) {
        string += "j";
      }
    }
  }
  return string;
}

function makeBigTree() {
  let intString = [];
  let width = 25;
  let height = 25;
  let amplitudeX = 3;
  for (let j = 0; j < width; j++) {
    for (let i = 0; i < height; i++) {
      intString.push(0);
    }
  }
  let initialSpot = {
    x: parseInt(width / 2),
    y: height - 1
  };
  let initialDirection = {
    x: (Math.random() - 0.5),
    y: 1
  };
  let trunkheight = Math.min(Math.random() * 12, 5);
  let nextSpot = {
    x: 0,
    y: 0
  };
  for (let i = 0; i < trunkheight; i++) {
    intString[(parseInt(initialSpot.y) * width) + parseInt(initialSpot.x)] = 1;
    initialSpot.x += initialDirection.x;
    initialSpot.y -= initialDirection.y;
    nextSpot.x = initialSpot.x;
    nextSpot.y = initialSpot.y;
  }
  let nextSpots = [];
  for (let i = 0; i < 3; i++) {
    let branchlength = Math.min(Math.random() * 8, 6);
    let nextSpot2 = {
      x: 0,
      y: 0
    };
    let newDirection = {
      x: (Math.random() - 0.5) * amplitudeX,
      y: 1
    };
    for (let b = 0; b < branchlength; b++) {
      intString[(parseInt(nextSpot.y) * width) + parseInt(nextSpot.x)] = 1;
      nextSpot.x += newDirection.x;
      nextSpot.y -= newDirection.y;
      nextSpot2.x = initialSpot.x;
      nextSpot2.y = initialSpot.y;
    }
    nextSpots.push(nextSpot2);
  }
  let nextSpotsClone = [...nextSpots];
  let leafspots = [];
  for (let i = 0; i < 3; i++) {
    for (let t = 0; t < 3; t++) {
      let finlength = Math.min(Math.random() * 8, 6);
      let newDirection = {
        x: (Math.random() - 0.5) * amplitudeX,
        y: 1
      };
      let endOfThisBranch = {
        x: 0,
        y: 0
      };
      for (let b = 0; b < finlength; b++) {
        intString[(parseInt(nextSpots[i].y) * width) + parseInt(nextSpots[i].x)] = 1;
        nextSpots[i].x += newDirection.x;
        nextSpots[i].y -= newDirection.y;
        endOfThisBranch.x = nextSpots[i].x;
        endOfThisBranch.y = nextSpots[i].y;
      }
      leafspots.push(endOfThisBranch);
    }
    nextSpots = [...nextSpotsClone];
  }
  for (let i of leafspots) {
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x)] = 2;
    intString[(parseInt(i.y) * width) + parseInt(i.x)] = 2;
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x - 1)] = 2;
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x + 1)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x - 1)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x + 1)] = 2;
    intString[(parseInt(i.y) * width) + parseInt(i.x - 1)] = 3;
    intString[(parseInt(i.y) * width) + parseInt(i.x + 1)] = 3;
    intString[(parseInt(i.y) * width) + parseInt(i.x - 2)] = 3;
    intString[(parseInt(i.y) * width) + parseInt(i.x + 2)] = 3;
    intString[(parseInt(i.y + 1) * width) + parseInt(i.x)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x - 2)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x + 2)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x - 2)] = 2;
    intString[(parseInt(i.y + 2) * width) + parseInt(i.x + 2)] = 2;
    intString[(parseInt(i.y - 1) * width) + parseInt(i.x - 1)] = 3;
    intString[(parseInt(i.y - 1) * width) + parseInt(i.x)] = 3;
    intString[(parseInt(i.y - 1) * width) + parseInt(i.x + 1)] = 3;
  }
  let string = "";
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      if (intString[(j * width) + i] === 0) {
        string += "0";
      }
      if (intString[(j * width) + i] === 1) {
        string += "a";
      }
      if (intString[(j * width) + i] === 2) {
        string += "n";
      }
      if (intString[(j * width) + i] === 3) {
        string += "j";
      }
    }
  }
  return string;
}