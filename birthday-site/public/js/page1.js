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

  function drawSoftGradient() {
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ffd6e7');
    grad.addColorStop(0.3, '#ffb6c1');
    grad.addColorStop(0.6, '#ff9eb5');
    grad.addColorStop(1, '#ffe4ec');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    var grad2 = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, w * 0.6);
    grad2.addColorStop(0, 'rgba(255, 215, 0, 0.08)');
    grad2.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, w, h);
  }

  function drawCake(x, y, size, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    var s = size;

    ctx.shadowColor = 'rgba(255, 107, 157, 0.15)';
    ctx.shadowBlur = 8;

    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.roundRect(-s * 0.6, -s * 0.35, s * 1.2, s * 0.7, 4);
    ctx.fill();

    ctx.fillStyle = '#ffc0cb';
    ctx.beginPath();
    ctx.roundRect(-s * 0.4, -s * 0.65, s * 0.8, s * 0.45, 3);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (var i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.ellipse(i * s * 0.12, -s * 0.65, s * 0.08, s * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.65, s * 0.35, s * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    var candleH = s * 0.3;
    ctx.fillStyle = '#ff6b9d';
    ctx.fillRect(-2, -s * 0.65 - candleH, 4, candleH);

    ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.65 - candleH - 4, 2.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.65 - candleH - 5, 1.5, 3, 0, 0, Math.PI * 2);
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

    ctx.shadowColor = 'rgba(255, 107, 157, 0.12)';
    ctx.shadowBlur = 6;

    ctx.fillStyle = '#ff9eb5';
    ctx.beginPath();
    ctx.roundRect(-s * 0.45, -s * 0.35, s * 0.9, s * 0.7, 6);
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-2.5, -s * 0.35, 5, s * 0.7);
    ctx.fillRect(-s * 0.45, -2.5, s * 0.9, 5);

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(-s * 0.12, -s * 0.35 - 5, 5, 0, Math.PI * 2);
    ctx.arc(s * 0.12, -s * 0.35 - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e6c200';
    ctx.beginPath();
    ctx.arc(0, -s * 0.35 - 6, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawTextElement(text, x, y, size, rot, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.font = 'bold ' + size + 'px "KaiTi", "STKaiti", "SimKai", "PingFang SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 107, 157, ' + opacity + ')';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  var elements = [];
  var greetings = ['\u751f\u65e5\u5feb\u4e50', '\u5929\u5929\u5f00\u5fc3'];

  function initElements() {
    elements.length = 0;
    var numElements = 18 + Math.floor(Math.random() * 10);
    for (var i = 0; i < numElements; i++) {
      var el = {
        x: Math.random() * w,
        y: Math.random() * h,
        size: 18 + Math.random() * 35,
        rotation: (Math.random() - 0.5) * 0.3,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.25 + Math.random() * 0.35,
        floatAmplitude: 8 + Math.random() * 14,
        type: Math.random() < 0.3 ? 'cake' : Math.random() < 0.6 ? 'gift' : 'text'
      };
      if (el.type === 'text') {
        el.text = greetings[Math.floor(Math.random() * greetings.length)];
        el.opacity = 0.1 + Math.random() * 0.2;
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
      var drawY = el.y + floatY;

      if (el.type === 'cake') {
        drawCake(el.x, drawY, el.size, el.rotation);
      } else if (el.type === 'gift') {
        drawGift(el.x, drawY, el.size, el.rotation);
      } else if (el.type === 'text') {
        drawTextElement(el.text, el.x, drawY, el.size, el.rotation, el.opacity);
      }
    }
  }

  function ConfettiPiece() {
    this.x = Math.random() * w;
    this.y = -10 - Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = 1.5 + Math.random() * 2.5;
    this.size = 6 + Math.random() * 8;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.12;
    this.color = ['#ff6b9d', '#ffd700', '#ff9eb5', '#ff4d88', '#e6c200', '#ffc0cb', '#fff'][Math.floor(Math.random() * 7)];
    this.opacity = 0.7 + Math.random() * 0.3;
    this.shape = Math.random() < 0.5 ? 'rect' : 'circle';
  }

  ConfettiPiece.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.02;
    this.rotation += this.rotSpeed;
  };

  ConfettiPiece.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size * 0.3, -this.size * 0.15, this.size * 0.6, this.size * 0.3);
    }
    ctx.restore();
  };

  ConfettiPiece.prototype.isAlive = function () {
    return this.y < h + 50;
  };

  var confetti = [];

  function spawnConfetti() {
    var target = 120 + Math.floor(Math.random() * 30);
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
    if (confetti.length < 40) {
      spawnConfetti();
    }
  }

  spawnConfetti();

  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, w, h);
    drawSoftGradient();
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
      }, 500);
    });
  }
});
