// 20210882_서혜랑
// 사운드미디어제작 기말 과제
// Interstellar Music Visualizer

let firststep;
let amp;

// 오른쪽 하단에 있는 음악 재생/일시정지 별 모양 버튼을 위한 변수 선언
let starX;
let starY;
let starSize = 40;

let baseRadius = 120;
let particles = [];

function preload(){
  firststep = loadSound('FirstStep.mp3'); // 인터스텔라 사운드 트랙인 first step 음원 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  starX = width - 80;
  starY = height - 80;

  // p5.sound 음량 분석 객체
  amp = new p5.Amplitude();
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
  drawIcon();

  // 음악에서 볼륨을 얻어내는 getLevel() 사용
  let level = amp.getLevel();
  // 음량을 보기 좋은 값으로 조절하는 코드
  let mapped = map(level, 0, 0.3, 0, 1, true);

  // 음악에 맞춰서 중앙에 원이 음악이 커질 수록 별 모양 시각화
  push();
  translate(width / 2, height / 2);
  noFill();
  stroke(0, 255, 220);
  strokeWeight(2);

  // 반지름이 음악이 커질 수록 튀어나오게 설정
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    let wave = sin(a * 5 - HALF_PI) * mapped * 80;
    let r = baseRadius + wave;
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  pop();

   // 쏟아지는 파티클 생성 
  if (firststep.isPlaying()) {
    let particleCount = int(map(mapped, 0, 1, 1, 6));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new StarParticle(mapped));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
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

function drawIcon() {
  fill(0);
  noStroke();

  if (firststep.isPlaying()) {
    // 일시정지 아이콘
    rect(starX - 6, starY - 10, 4, 20);
    rect(starX + 2, starY - 10, 4, 20);
  } else {
    // 재생 아이콘
    triangle(
      starX - 5, starY - 10,
      starX - 5, starY + 10,
      starX + 8, starY
    );
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, starX, starY);
  // 별 버튼 클릭 시 음악 재생 및 일시정지
  if (d < starSize) {
    if (!firststep.isPlaying()) {
      firststep.loop();
    } else {
      firststep.pause();
      particles = [];
    }
  }
}

// 중앙에서 퍼져나오는 파티클 클래스
class StarParticle {
  constructor(volume) {
    this.x = width / 2;
    this.y = height / 2;

    let angle = random(TWO_PI);
    let speed = map(volume, 0, 1, 0.5, 8);

    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;

    this.size = map(volume, 0, 1, 4, 24);
    this.alpha = 255;

    this.rotation = random(TWO_PI);
    this.rotSpeed = map(volume, 0, 1, -0.02, 0.1);

    let r = random();
    if (r < 0.33) this.shape = 'circle';
    else if (r < 0.66) this.shape = 'rect';
    else this.shape = 'triangle';

    this.phase = random(TWO_PI);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= 3;
    this.phase += 0.04;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    noStroke();

    // 파티클 색상 변화
    let t = (sin(this.phase) + 1) / 2;
    let c = lerpColor(
      color(0, 255, 220),
      color(255, 230, 150),
      t
    );

    fill(red(c), green(c), blue(c), this.alpha);

    if (this.shape === 'circle') {
      ellipse(0, 0, this.size);
    } 
    else if (this.shape === 'rect') {
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
    } 
    else {
      triangle(
        -this.size / 2, this.size / 2,
        this.size / 2, this.size / 2,
        0, -this.size / 2
      );
    }

    pop();
  }

  isDead() {
    return this.alpha <= 0;
  }
}
