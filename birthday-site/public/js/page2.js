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
    }, 600);
  });

  // Petal effect on letter click
  var ctx = null;
  var petals = [];
  var petalAnimId = null;
  var petalRunning = false;

  function initPetalCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
    ctx = petalCanvas.getContext('2d');
  }

  function createPetal() {
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      size: 8 + Math.random() * 12,
      speedY: 1 + Math.random() * 2,
      speedX: -0.5 + Math.random() * 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.02 + Math.random() * 0.04,
      opacity: 0.6 + Math.random() * 0.4,
      color: ['#ff6b9d', '#ff8fab', '#ffb3c6', '#ffc8dd', '#ffd6e7'][Math.floor(Math.random() * 5)],
      swing: Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size * 0.3, -p.size * 0.5, p.size * 0.7, -p.size * 0.3, p.size, 0);
    ctx.bezierCurveTo(p.size * 0.7, p.size * 0.3, p.size * 0.3, p.size * 0.5, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function updatePetals() {
    if (petalRunning && Math.random() < 0.3 && petals.length < 80) {
      petals.push(createPetal());
    }

    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      p.x += p.speedX + Math.sin(Date.now() * p.swing + p.phase) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > window.innerHeight + 20) {
        petals.splice(i, 1);
      }
    }
  }

  function drawScene() {
    if (!ctx) return;
    ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    for (var i = 0; i < petals.length; i++) {
      drawPetal(petals[i]);
    }
    updatePetals();
    petalAnimId = requestAnimationFrame(drawScene);
  }

  function startPetals() {
    if (petalRunning) return;
    petalRunning = true;
    initPetalCanvas();
    drawScene();
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