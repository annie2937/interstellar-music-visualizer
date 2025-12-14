// 20210882_서혜랑
// 사운드미디어제작 기말 과제
// Interstellar Music Visualizer

let firststep;

// 음악 재생/중지 별 모양 버튼을 위한 변수 선언
let starX;
let starY;
let starSize = 40;

function preload(){
  firststep = loadSound('FirstStep.mp3'); // 인터스텔라 사운드 트랙인 first step 음원 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  starX = width - 80;
  starY = height - 80;
}

function draw() {
  background(0);

  // 재생 상태에 따라 버튼 색 변경
  if (firststep.isPlaying()) {
    fill(0, 255, 220); // 재생 중일 때
  } else {
    fill(255, 200, 50); // 정지 상태일 때
  }
  noStroke();
  drawStar(starX, starY, starSize * 0.4, starSize, 5);
}

// 별 모양 만드는 함수 선언
function drawStar(x, y, r1, r2, n) {
  let angle = TWO_PI / n;
  let halfAngle = angle / 2;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    vertex(x + cos(a) * r2, y + sin(a) * r2);
    vertex(x + cos(a + halfAngle) * r1, y + sin(a + halfAngle) * r1);
  }
  endShape(CLOSE);
}


function mousePressed() {
  let d = dist(mouseX, mouseY, starX, starY);

  // 별을 클릭했을 때 음악이 재생 또는 정지
  if (d < starSize) {
    if (!firststep.isPlaying()) {
      firststep.loop();
    } else {
      firststep.pause();
    }
  }
}