if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    var r = 0;
    if (Array.isArray(radii)) {
      r = radii[0] || 0;
    } else if (typeof radii === 'number') {
      r = radii;
    }
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('bgCanvas');
  var ctx = canvas.getContext('2d');
  var w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var time = 0;

  function drawSky() {
    var grad = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.3, w * 0.8);
    grad.addColorStop(0, 'rgba(255, 215, 0, 0.06)');
    grad.addColorStop(0.3, 'rgba(232, 160, 180, 0.12)');
    grad.addColorStop(0.6, 'rgba(200, 160, 210, 0.08)');
    grad.addColorStop(1, 'rgba(180, 160, 200, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function drawSoftGradient() {
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fce4ec');
    grad.addColorStop(0.25, '#fce8f0');
    grad.addColorStop(0.5, '#f8e8e0');
    grad.addColorStop(0.75, '#f5ecf0');
    grad.addColorStop(1, '#ede0f5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    var grad2 = ctx.createRadialGradient(w * 0.2, h * 0.15, 0, w * 0.2, h * 0.15, w * 0.5);
    grad2.addColorStop(0, 'rgba(255, 215, 0, 0.07)');
    grad2.addColorStop(0.4, 'rgba(232, 160, 180, 0.05)');
    grad2.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    ctx.save();
    var grad3 = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, w * 0.4);
    grad3.addColorStop(0, 'rgba(240, 214, 138, 0.05)');
    grad3.addColorStop(1, 'rgba(240, 214, 138, 0)');
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawCake(x, y, size, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    var s = size;

    ctx.shadowColor = 'rgba(232, 160, 180, 0.15)';
    ctx.shadowBlur = 10;

    var gradBottom = ctx.createLinearGradient(0, -s * 0.3, 0, s * 0.4);
    gradBottom.addColorStop(0, 'rgba(255, 182, 193, 0.9)');
    gradBottom.addColorStop(1, 'rgba(232, 160, 180, 0.9)');
    ctx.fillStyle = gradBottom;
    ctx.beginPath();
    ctx.roundRect(-s * 0.65, -s * 0.3, s * 1.3, s * 0.7, 4);
    ctx.fill();

    var gradTop = ctx.createLinearGradient(0, -s * 0.65, 0, -s * 0.25);
    gradTop.addColorStop(0, 'rgba(255, 200, 210, 0.95)');
    gradTop.addColorStop(1, 'rgba(255, 182, 193, 0.9)');
    ctx.fillStyle = gradTop;
    ctx.beginPath();
    ctx.roundRect(-s * 0.45, -s * 0.65, s * 0.9, s * 0.45, 3);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(248, 232, 224, 0.95)';
    for (var i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.ellipse(i * s * 0.1, -s * 0.65, s * 0.07, s * 0.035, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(248, 232, 224, 0.95)';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.65, s * 0.38, s * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(248, 232, 224, 0.9)';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.3, s * 0.55, s * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();

    var candleH = s * 0.28;
    ctx.fillStyle = '#e8a0b4';
    ctx.shadowColor = 'rgba(232, 160, 180, 0.2)';
    ctx.shadowBlur = 4;
    ctx.fillRect(-2.5, -s * 0.65 - candleH, 5, candleH);
    ctx.shadowBlur = 0;

    var stripeY = -s * 0.65 - candleH + 4;
    ctx.fillStyle = '#f7e8d0';
    ctx.fillRect(-2.5, stripeY, 5, 3);
    ctx.fillRect(-2.5, stripeY + 8, 5, 3);

    var flicker = Math.sin(time * 6) * 0.12 + 1;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.shadowBlur = 12 * flicker;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.65 - candleH - 4, 2.5 * flicker, 5 * flicker, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'rgba(255, 140, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.65 - candleH - 5, 1.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.restore();
  }

  function drawGift(x, y, size, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    var s = size;

    ctx.shadowColor = 'rgba(232, 160, 180, 0.12)';
    ctx.shadowBlur = 8;

    var gradBox = ctx.createLinearGradient(-s * 0.45, -s * 0.35, s * 0.45, s * 0.35);
    gradBox.addColorStop(0, '#f5c6d6');
    gradBox.addColorStop(0.5, '#e8a0b4');
    gradBox.addColorStop(1, '#d47a94');
    ctx.fillStyle = gradBox;
    ctx.beginPath();
    ctx.roundRect(-s * 0.45, -s * 0.35, s * 0.9, s * 0.7, 6);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
    ctx.fillRect(-2.5, -s * 0.35, 5, s * 0.7);
    ctx.fillRect(-s * 0.45, -2.5, s * 0.9, 5);

    ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#f0d68a';
    ctx.beginPath();
    ctx.ellipse(-s * 0.12, -s * 0.35 - 5, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.12, -s * 0.35 - 5, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(0, -s * 0.35 - 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    for (var di = -2; di <= 2; di++) {
      if (di === 0) continue;
      ctx.beginPath();
      ctx.arc(di * s * 0.15, s * 0.05, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, s * 0.2, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.12, -s * 0.1, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-s * 0.12, -s * 0.1, s * 0.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
    ctx.lineWidth = 1;
    for (var si = 0; si < 6; si++) {
      var angle = si * Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * s * 0.3, Math.sin(angle) * s * 0.3);
      ctx.stroke();
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawTextElement(text, x, y, size, rot, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.font = '500 ' + size + 'px "KaiTi", "STKaiti", "SimKai", "PingFang SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.08)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(232, 160, 180, ' + opacity + ')';
    ctx.fillText(text, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  var elements = [];
  var greetings = ['\u751f\u65e5\u5feb\u4e50', '\u795d\u798f\u4f60', '\u5e78\u798f\u5feb\u4e50'];

  function initElements() {
    elements.length = 0;
    var numElements = 20 + Math.floor(Math.random() * 12);
    for (var i = 0; i < numElements; i++) {
      var el = {
        x: Math.random() * w,
        y: Math.random() * h,
        size: 16 + Math.random() * 38,
        rotation: (Math.random() - 0.5) * 0.35,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.15 + Math.random() * 0.25,
        floatAmplitude: 10 + Math.random() * 16,
        phaseOffset: Math.random() * Math.PI * 2,
        driftSpeed: (Math.random() - 0.5) * 0.08,
        type: Math.random() < 0.3 ? 'cake' : Math.random() < 0.6 ? 'gift' : 'text'
      };
      if (el.type === 'text') {
        el.text = greetings[Math.floor(Math.random() * greetings.length)];
        el.opacity = 0.08 + Math.random() * 0.15;
      }
      elements.push(el);
    }
  }
  initElements();
  window.addEventListener('resize', initElements);

  function drawBackground() {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var floatY = Math.sin(time * el.floatSpeed + el.floatOffset) * el.floatAmplitude;
      var driftX = Math.sin(time * el.driftSpeed + el.phaseOffset) * 15;
      var drawY = el.y + floatY;
      var drawX = el.x + driftX;

      if (el.type === 'cake') {
        drawCake(drawX, drawY, el.size, el.rotation);
      } else if (el.type === 'gift') {
        drawGift(drawX, drawY, el.size, el.rotation);
      } else if (el.type === 'text') {
        drawTextElement(el.text, drawX, drawY, el.size, el.rotation, el.opacity);
      }
    }
  }

  function drawStar(cx, cy, r) {
    ctx.beginPath();
    var rot = -Math.PI / 2;
    for (var i = 0; i < 5; i++) {
      var angle = rot + i * Math.PI * 2 / 5;
      var ox = cx + Math.cos(angle) * r;
      var oy = cy + Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(ox, oy);
      } else {
        ctx.lineTo(ox, oy);
      }
      var innerAngle = angle + Math.PI / 5;
      ctx.lineTo(cx + Math.cos(innerAngle) * r * 0.4, cy + Math.sin(innerAngle) * r * 0.4);
    }
    ctx.closePath();
  }

  function ConfettiPiece() {
    this.x = Math.random() * w;
    this.y = -10 - Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 1.8;
    this.vy = 1.2 + Math.random() * 2.2;
    this.size = 5 + Math.random() * 8;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.1;
    this.colors = ['#e8a0b4', '#ffd700', '#ff8fa3', '#fff', '#c8b8e8', '#b8d8e8', '#f0d68a', '#ffb3c4'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.opacity = 0.6 + Math.random() * 0.4;
    this.shape = Math.random() < 0.5 ? 'rect' : Math.random() < 0.75 ? 'circle' : 'star';
    this.twinkleSpeed = 1 + Math.random() * 3;
    this.twinkleOffset = Math.random() * Math.PI * 2;
  }

  ConfettiPiece.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.015;
    this.rotation += this.rotSpeed;
  };

  ConfettiPiece.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    var twinkle = 0.7 + 0.3 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
    ctx.globalAlpha = this.opacity * twinkle;
    ctx.fillStyle = this.color;
    if (this.shape === 'star') {
      ctx.shadowColor = 'rgba(212, 175, 55, 0.15)';
      ctx.shadowBlur = 4;
      drawStar(0, 0, this.size * 0.5);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (this.shape === 'circle') {
      ctx.shadowColor = 'rgba(232, 160, 180, 0.12)';
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.shadowColor = 'rgba(232, 160, 180, 0.1)';
      ctx.shadowBlur = 2;
      var sw = this.size * 0.5;
      var sh = this.size * 0.2;
      ctx.fillRect(-sw * 0.5, -sh * 0.5, sw, sh);
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  };

  ConfettiPiece.prototype.isAlive = function () {
    return this.y < h + 50;
  };

  var confetti = [];

  function spawnConfetti() {
    var target = 100 + Math.floor(Math.random() * 40);
    while (confetti.length < target) {
      confetti.push(new ConfettiPiece());
    }
  }

  function updateConfetti() {
    for (var i = confetti.length - 1; i >= 0; i--) {
      confetti[i].update();
      if (!confetti[i].isAlive()) {
        confetti.splice(i, 1);
      }
    }
    if (confetti.length < 30) {
      spawnConfetti();
    }
  }

  spawnConfetti();

  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, w, h);
    drawSoftGradient();
    drawSky();
    drawBackground();
    updateConfetti();
    for (var i = 0; i < confetti.length; i++) {
      confetti[i].draw(ctx);
    }
    requestAnimationFrame(animate);
  }

  animate();

  var heartContainer = document.querySelector('.heart-container');
  if (heartContainer) {
    heartContainer.style.cursor = 'pointer';
    heartContainer.addEventListener('click', function () {
      document.body.classList.add('fade-out');
      setTimeout(function () {
        window.location.href = 'page2.html';
      }, 600);
    });
  }
});