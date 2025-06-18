let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let fishProperties = [];
let frame = 0;
let Nfish = 10;
let foodMultiplier = 0.1;
let fish = { x: 0, y: 0, w: 0, h: 0 };
let food = { x: 0, y: 0, w: 0, h: 0 };
let ray = { x: 0, y: 0, w: 0, h: 0, a: 0};

let resolutionRay = 10;
let rayDistance = 5;
let rayAngle = 10;
let numberRays = 9;

let lavia;

createFishProperies(Nfish);
createFoodProperies(2);
updateFrame();

function intersects(fish, ray) {
  return !(
    fish.x >= ray.x + ray.w ||
    fish.x + fish.w <= ray.x ||
    fish.y >= ray.y + ray.h ||
    fish.y + fish.h <= ray.y
  );
}

function updateFrame() {
  frame++;
  removeFish();
  for (let id = 0; id < fishProperties.length; id++) {
    moveFish(id, 1);
    ctx.save();
    ctx.translate(fishProperties[id][0], fishProperties[id][1]);
    ctx.rotate((fishProperties[id][4] * Math.PI) / 180);
    ctx.fillStyle = fishProperties[id][5];
    ctx.fillRect(
      -fishProperties[id][2] / 2,
      -fishProperties[id][3] / 2,
      fishProperties[id][2],
      fishProperties[id][3]
    );
    ctx.restore();
  }
  for (let id = 0; id < foodProperties.length; id++) {
    ctx.fillStyle = foodProperties[id][4];
    ctx.fillRect(
      foodProperties[id][0],
      foodProperties[id][1],
      foodProperties[id][2],
      foodProperties[id][3]
    );
  }
  for (let id = 0; id < fishProperties.length; id++) {
    fish.x = fishProperties[id][0];
    fish.y = fishProperties[id][1];
    fish.w = fishProperties[id][2];
    fish.h = fishProperties[id][3];
    fish.a = fishProperties[id][4];
    fish.id = id;
    for (let h = 0; h < foodProperties.length; h++) {
      food.x = foodProperties[h][0];
      food.y = foodProperties[h][1];
      food.w = foodProperties[h][2];
      food.h = foodProperties[h][3];
      for (let i = 0; i < numberRays; i++) {
        
        ray.a = (fish.a * Math.PI) / 180 + rayAngle * i - rayAngle * numberRays / 2;
        for (let j = 0; j < resolutionRay; j++) {
          ray.x = fish.x + calculateSides(fish.a + ray.a, rayDistance)[0] * j;
          ray.y = fish.y + calculateSides(fish.a + ray.a, rayDistance)[1] * j;
          ray.w = 1;
          ray.h = 1;
          // console.log(ray)
          ctx.fillStyle = "#0000FF";
          ctx.fillRect(ray.x, ray.y, ray.w, ray.h);
          if (intersects(food, ray)) {
            console.log("HIT at " + id + " - " + j);
            break;
          }
        }
      }
    }
  }

  requestAnimationFrame(updateFrame);
}

function moveFish(id, value) {
  let [x, y] = calculateSides(fishProperties[id][4], value);
  fishProperties[id][0] += x;
  fishProperties[id][1] += y;
}

function createFishProperies(amount) {
  for (let i = 0; i < amount; i++) {
    fishProperties.push([
      Math.floor(Math.random() * 1000),
      Math.floor(Math.random() * 500),
      60,
      30,
      Math.floor(Math.random() * 360),
      "#FF0000",
      15,
    ]);
  }
}

function createFoodProperies(amount) {
  for (let i = 0; i < amount; i++) {
    foodProperties.push([
      Math.floor(Math.random() * 1000),
      Math.floor(Math.random() * 500),
      25,
      25,
      "#0000FF",
    ]);
  }
}

// console.log(foodProperties);

function removeFish() {
  ctx.clearRect(0, 0, 1000, 500);
  return;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateSides(angleDegrees, value) {
  const angleRadians = degreesToRadians(angleDegrees);
  const x = value * Math.cos(angleRadians);
  const y = value * Math.sin(angleRadians);
  return [x, y];
}