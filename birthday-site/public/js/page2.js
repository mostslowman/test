window.addEventListener('DOMContentLoaded', function() {
  var letterPaper = document.getElementById('letterPaper');
  var letterContent = document.getElementById('letterContent');
  var cursorBlink = document.getElementById('cursorBlink');
  var nextBtn = document.getElementById('nextBtn');
  var petalCanvas = document.getElementById('petalCanvas');
  var characters = document.querySelectorAll('.character');

  var fullText = '';
  var currentIndex = 0;
  var typingTimer = null;
  var textFinished = false;

  setTimeout(function() {
    characters.forEach(function(c) { c.classList.add('visible'); });
  }, 200);

  setTimeout(function() {
    letterPaper.classList.add('visible');
  }, 400);

  fetch('/api/config')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success && data.config && data.config.text) {
        fullText = data.config.text;
        startTyping();
      } else {
        fullText = '祝你生日快乐！天天开心！🎂';
        startTyping();
      }
    })
    .catch(function() {
      fullText = '祝你生日快乐！天天开心！🎂';
      startTyping();
    });

  function startTyping() {
    letterContent.innerHTML = '';
    cursorBlink.classList.remove('hidden');

    typingTimer = setInterval(function() {
      if (currentIndex < fullText.length) {
        var span = document.createElement('span');
        span.className = 'char-span';
        span.textContent = fullText[currentIndex];
        letterContent.appendChild(span);

        requestAnimationFrame(function() {
          span.style.opacity = '1';
        });

        currentIndex++;
      } else {
        clearInterval(typingTimer);
        typingTimer = null;
        textFinished = true;
        cursorBlink.classList.add('hidden');

        setTimeout(function() {
          nextBtn.classList.add('visible');
        }, 500);
      }
    }, 100);
  }

  nextBtn.addEventListener('click', function() {
    document.body.classList.add('fade-out');
    setTimeout(function() {
      window.location.href = 'page3.html';
    }, 800);
  });

  var ctx = null;
  var petals = [];
  var petalAnimId = null;
  var petalRunning = false;
  var petalSpawnCounter = 0;

  var petalColors = [
    '#f5c6d0', '#f2b5c4', '#e8a9b8', '#f0a5b8',
    '#e894a8', '#f7d0d8', '#d4a574', '#e8c4a0',
    '#fce4ec', '#ffd6e0'
  ];

  function initPetalCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
    ctx = petalCanvas.getContext('2d');
  }

  function createPetal() {
    return {
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 40,
      size: 10 + Math.random() * 14,
      speedY: 0.8 + Math.random() * 1.5,
      speedX: -0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.015 + Math.random() * 0.03,
      opacity: 0.5 + Math.random() * 0.45,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      swingAmplitude: 0.5 + Math.random() * 1.2,
      swingFrequency: 0.008 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      scale: 0.7 + Math.random() * 0.6,
      petalType: Math.floor(Math.random() * 3)
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    var s = p.size;
    var t = p.petalType;

    ctx.beginPath();
    if (t === 0) {
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.1, -s * 0.6, s * 0.6, -s * 0.7, s, 0);
      ctx.bezierCurveTo(s * 0.6, s * 0.3, s * 0.1, s * 0.4, 0 , 0);
    } else if (t === 1) {
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.2, -s * 0.5, s * 0.7, -s * 0.5, s * 0.9, 0);
      ctx.bezierCurveTo(s * 0.8, s * 0.4, s * 0.3, s * 0.6, 0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.1, s * 0.15, -s * 0.05, s * 0.05, 0, 0);
    } else {
      ctx.moveTo(0, s * 0.1);
      ctx.bezierCurveTo(s * 0.2, -s * 0.3, s * 0.5, -s * 0.5, s * 0.8, -s * 0.1);
      ctx.bezierCurveTo(s * 0.7, 0.1, s * 0.5, s * 0.4, s * 0.3, s * 0.5);
      ctx.bezierCurveTo(s * 0.15, s * 0.45, s * 0.05, s * 0.3, 0, s * 0.1);
    }

    ctx.closePath();
    ctx.fill();

    if (p.size > 14) {
      ctx.globalAlpha = p.opacity * 0.2;
      ctx.beginPath();
      if (t === 0) {
        ctx.moveTo(s * 0.15, -s * 0.05);
        ctx.bezierCurveTo(s * 0.25, -s * 0.2, s * 0.4, -s * 0.2, s * 0.5, -s * 0.05);
      } else if (t === 1) {
        ctx.moveTo(s * 0.2, s * 0.05);
        ctx.bezierCurveTo(s * 0.35, -s * 0.1, s * 0.5, -s * 0.1, s * 0.65, s * 0.05);
      } else {
        ctx.moveTo(s * 0.2, 0);
        ctx.bezierCurveTo(s * 0.35, -s * 0.2, s * 0.55, -s * 0.2, s * 0.7, 0);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  function updatePetals(time) {
    if (petalRunning) {
      petalSpawnCounter++;
      if (petalSpawnCounter % 3 === 0 && petals.length < 100 && Math.random() < 0.4) {
        petals.push(createPetal());
      }
    }

    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      p.x += p.speedX + Math.sin(time * p.swingFrequency + p.phase) * p.swingAmplitude;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > window.innerHeight + 30) {
        petals.splice(i, 1);
      }
    }
  }

  function drawScene(time) {
    if (!ctx) return;
    ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    for (var i = 0; i < petals.length; i++) {
      drawPetal(petals[i]);
    }
    updatePetals(time);
    petalAnimId = requestAnimationFrame(drawScene);
  }

  function startPetals() {
    if (petalRunning) return;
    petalRunning = true;
    initPetalCanvas();
    for (var i = 0; i < 15; i++) {
      var p = createPetal();
      p.y = Math.random() * window.innerHeight * 0.5;
      petals.push(p);
    }
    petalAnimId = requestAnimationFrame(drawScene);
  }

  letterPaper.addEventListener('click', function() {
    if (textFinished && !petalRunning) {
      startPetals();
    }
  });

  window.addEventListener('resize', function() {
    if (ctx) {
      petalCanvas.width = window.innerWidth;
      petalCanvas.height = window.innerHeight;
    }
  });
});