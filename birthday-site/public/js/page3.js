(function () {
  'use strict';

  var CONFIG_URL = '/api/config';
  var RING_RADIUS = 6;
  var CAMERA_ORBIT_RADIUS = 11;
  var FOCUS_RADIUS = 3.8;
  var FOCUS_DURATION = 4;
  var TRANSITION_DURATION = 1;
  var FLY_DURATION = 1.2;
  var FLY_DELAY_STEP = 0.15;
  var IMAGE_SIZE = 2.4;
  var FRAME_PADDING = 0.18;
  var AUTO_ROTATE_SPEED = 0.15;
  var RESUME_DELAY = 2000;

  var STATE = {
    LOADING: 0,
    FLY_IN: 1,
    ORBIT: 2,
    FOCUS_TRANSITION: 3,
    FOCUS_ROTATION: 4
  };

  var config = null;
  var state = STATE.LOADING;
  var scene, camera, renderer;
  var imageGroups = [];
  var imageData = [];
  var focusIndex = -1;
  var focusStartTime = 0;
  var transitionStartTime = 0;
  var transitionFromState = null;
  var transitionStartPos = new THREE.Vector3();
  var transitionStartTarget = new THREE.Vector3();
  var transitionEndPos = new THREE.Vector3();
  var transitionEndTarget = new THREE.Vector3();
  var nextFocusIndex = 0;
  var flyInStartTime = 0;
  var orbitAngle = 0;
  var isUserInteracting = false;
  var userTheta = 0;
  var userPhi = Math.PI / 4;
  var lastInteractionTime = 0;
  var clock = new THREE.Clock();
  var bgMesh = null;
  var bgOverlay = null;
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var isDragging = false;
  var dragStartX = 0;
  var dragStartY = 0;
  var dragTheta = 0;
  var dragPhi = 0;
  var hasDragged = false;
  var flyInComplete = false;

  var audio = null;
  var isAudioReady = false;
  var isSeeking = false;

  var loadingOverlay, noImagesMsg, imageInfoEl, backBtn;
  var playBtn, progressBar, currentTimeEl, durationEl;
  var volumeSlider, speedSelect;

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function initUI() {
    loadingOverlay = document.getElementById('loading-overlay');
    noImagesMsg = document.getElementById('no-images-msg');
    imageInfoEl = document.getElementById('image-info');
    backBtn = document.getElementById('back-btn');
    playBtn = document.getElementById('play-btn');
    progressBar = document.getElementById('progress-bar');
    currentTimeEl = document.getElementById('current-time');
    durationEl = document.getElementById('duration');
    volumeSlider = document.getElementById('volume-slider');
    speedSelect = document.getElementById('speed-select');

    backBtn.addEventListener('click', function () {
      document.body.classList.add('fade-out');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 500);
    });

    playBtn.addEventListener('click', togglePlay);

    progressBar.addEventListener('input', function () {
      isSeeking = true;
      if (audio && audio.duration) {
        var val = parseFloat(this.value);
        audio.currentTime = val * audio.duration;
      }
    });

    progressBar.addEventListener('change', function () {
      isSeeking = false;
    });

    volumeSlider.addEventListener('input', function () {
      if (audio) {
        audio.volume = parseFloat(this.value);
        updateVolumeIcon();
      }
    });

    speedSelect.addEventListener('change', function () {
      if (audio) {
        audio.playbackRate = parseFloat(this.value);
      }
    });
  }

  function updateVolumeIcon() {
    var icon = document.getElementById('volume-icon');
    if (!icon || !audio) return;
    var v = audio.volume;
    if (v === 0 || audio.muted) {
      icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><line x1="3" y1="3" x2="21" y2="21" stroke="white" stroke-width="2"/></svg>';
    } else if (v < 0.5) {
      icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
    } else {
      icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16.5 3l-1.5 1.5C16.5 6.5 18 9 18 12s-1.5 5.5-3 7.5l1.5 1.5c2-2.5 3.5-5.5 3.5-9s-1.5-6.5-3.5-9z"/></svg>';
    }
  }

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  }

  function updatePlayButton() {
    if (!audio) return;
    var isPaused = audio.paused;
    playBtn.innerHTML = isPaused
      ? '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  }

  function setupAudio(audioUrl) {
    if (!audioUrl) {
      document.getElementById('audio-controls').classList.add('hidden');
      return;
    }

    audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = audioUrl;
    audio.volume = parseFloat(volumeSlider.value);
    audio.playbackRate = parseFloat(speedSelect.value);

    audio.addEventListener('loadedmetadata', function () {
      isAudioReady = true;
      durationEl.textContent = formatTime(audio.duration);
      progressBar.max = 1;
      progressBar.value = 0;

      audio.play().then(function () {
        updatePlayButton();
      }).catch(function () {});
    });

    audio.addEventListener('timeupdate', function () {
      if (!isSeeking && audio.duration) {
        progressBar.value = audio.currentTime / audio.duration;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);
    audio.addEventListener('ended', function () {
      updatePlayButton();
      currentTimeEl.textContent = formatTime(audio.duration);
      progressBar.value = 1;
    });

    audio.addEventListener('error', function () {
      document.getElementById('audio-controls').classList.add('hidden');
    });

    setTimeout(function () {
      if (audio && audio.readyState === 0) {
        audio.load();
      }
    }, 1000);
  }

  function initThreeJS(images) {
    scene = new THREE.Scene();

    var bgColor = new THREE.Color(0x1a1a2e);
    scene.background = bgColor;

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, CAMERA_ORBIT_RADIUS);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('three-canvas'),
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    var ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    var fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-5, 0, -8);
    scene.add(fillLight);

    var rimLight = new THREE.DirectionalLight(0xff6b9d, 0.4);
    rimLight.position.set(0, -5, 0);
    scene.add(rimLight);

    var pointLight = new THREE.PointLight(0xffd700, 0.5, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    var particleCount = 500;
    var particleGeo = new THREE.BufferGeometry();
    var particlePos = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount * 3; i++) {
      particlePos[i] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    var particleMat = new THREE.PointsMaterial({
      color: 0x8888ff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    var particles = new THREE.Points(particleGeo, particleMat);
    particles.position.y = -5;
    scene.add(particles);

    if (images.length === 0) {
      noImagesMsg.style.display = 'block';
      showPage();
      return;
    }

    var firstImg = images[0];
    if (firstImg) {
      var bgTextureLoader = new THREE.TextureLoader();
      bgTextureLoader.crossOrigin = 'anonymous';
      bgTextureLoader.load(firstImg, function (texture) {
        var aspect = texture.image.width / texture.image.height;
        var bgWidth = 30;
        var bgHeight = bgWidth / aspect;
        if (bgHeight < 20) {
          bgHeight = 20;
          bgWidth = bgHeight * aspect;
        }
        var bgGeo = new THREE.PlaneGeometry(bgWidth, bgHeight);
        var bgMat = new THREE.MeshBasicMaterial({
          map: texture,
          depthWrite: false
        });
        bgMesh = new THREE.Mesh(bgGeo, bgMat);
        bgMesh.position.z = -15;
        bgMesh.position.y = 0;
        scene.add(bgMesh);

        var overlayGeo = new THREE.PlaneGeometry(40, 25);
        var overlayMat = new THREE.MeshBasicMaterial({
          color: 0x0a0a1a,
          transparent: true,
          opacity: 0.55,
          depthWrite: false
        });
        bgOverlay = new THREE.Mesh(overlayGeo, overlayMat);
        bgOverlay.position.z = -14.5;
        bgOverlay.position.y = 0;
        scene.add(bgOverlay);
      }, undefined, function () {});
    }

    createImageFrames(images);
    setupInteraction();
    startFlyIn();
  }

  function createImageFrames(images) {
    var N = images.length;
    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    for (var i = 0; i < N; i++) {
      var angle = (i / N) * Math.PI * 2;
      var x = RING_RADIUS * Math.sin(angle);
      var z = RING_RADIUS * Math.cos(angle);

      var group = new THREE.Group();

      var frameSize = IMAGE_SIZE + FRAME_PADDING * 2;
      var frameGeo = new THREE.PlaneGeometry(frameSize, frameSize);
      var frameMat = new THREE.MeshStandardMaterial({
        color: 0xff6b9d,
        emissive: 0xff6b9d,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        metalness: 0.3,
        roughness: 0.4
      });
      var frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = -0.05;
      group.add(frameMesh);

      var innerFrameGeo = new THREE.PlaneGeometry(frameSize - 0.15, frameSize - 0.15);
      var innerFrameMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a4a,
        emissive: 0x1a1a3a,
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.1
      });
      var innerFrame = new THREE.Mesh(innerFrameGeo, innerFrameMat);
      innerFrame.position.z = 0;
      group.add(innerFrame);

      (function (idx, imgUrl) {
        textureLoader.load(imgUrl, function (texture) {
          var imgAspect = texture.image.width / texture.image.height;
          var imgW = IMAGE_SIZE;
          var imgH = IMAGE_SIZE;
          if (imgAspect > 1) {
            imgW = IMAGE_SIZE;
            imgH = IMAGE_SIZE / imgAspect;
          } else {
            imgH = IMAGE_SIZE;
            imgW = IMAGE_SIZE * imgAspect;
          }

          var imgGeo = new THREE.PlaneGeometry(imgW, imgH);
          var imgMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.3,
            metalness: 0.0
          });
          var imgMesh = new THREE.Mesh(imgGeo, imgMat);
          imgMesh.position.z = 0.05;
          group.add(imgMesh);

          if (idx === 0) {
            imgMat.emissive = new THREE.Color(0xffffff);
            imgMat.emissiveIntensity = 0.05;
          }

          imageData[idx].texture = texture;
          imageData[idx].imgMesh = imgMesh;
          imageData[idx].imgMat = imgMat;
        }, undefined, function () {
          var fallbackGeo = new THREE.PlaneGeometry(IMAGE_SIZE * 0.8, IMAGE_SIZE * 0.8);
          var fallbackMat = new THREE.MeshBasicMaterial({
            color: 0x444466,
            side: THREE.DoubleSide
          });
          var fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
          fallbackMesh.position.z = 0.05;
          group.add(fallbackMesh);
        });
      })(i, images[i]);

      var backGeo = new THREE.PlaneGeometry(IMAGE_SIZE * 0.9, IMAGE_SIZE * 0.9);
      var backMat = new THREE.MeshStandardMaterial({
        color: 0x222244,
        emissive: 0x333355,
        emissiveIntensity: 0.05,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.3
      });
      var backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.z = -0.1;
      group.add(backMesh);

      group.position.set(x, 0, z);
      var lookTarget = new THREE.Vector3(0, 0, 0);
      group.lookAt(lookTarget);
      group.rotateY(Math.PI);

      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var startRadius = 20 + Math.random() * 5;
      var startPos = new THREE.Vector3(
        startRadius * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 10,
        startRadius * Math.sin(phi) * Math.sin(theta)
      );

      var endPos = group.position.clone();
      group.position.copy(startPos);

      imageData.push({
        index: i,
        url: images[i],
        group: group,
        frameMat: frameMat,
        startPos: startPos,
        endPos: endPos,
        angle: angle,
        flyDelay: i * FLY_DELAY_STEP,
        flyProgress: 0,
        isFlying: true,
        texture: null,
        imgMesh: null,
        imgMat: null,
        glowPhase: 0
      });

      scene.add(group);
    }
  }

  function setupInteraction() {
    var canvas = renderer.domElement;

    canvas.addEventListener('mousedown', function (e) {
      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragTheta = userTheta;
      dragPhi = userPhi;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - dragStartX;
      var dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged = true;
      }
      userTheta = dragTheta - dx * 0.005;
      userPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, dragPhi - dy * 0.005));
      isUserInteracting = true;
      lastInteractionTime = Date.now();
      clearTimeout(autoRotateTimer);
    });

    window.addEventListener('mouseup', function (e) {
      if (isDragging && !hasDragged) {
        handleClick(e);
      }
      isDragging = false;
      if (isUserInteracting) {
        autoRotateTimer = setTimeout(function () {
          isUserInteracting = false;
        }, RESUME_DELAY);
      }
    });

    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        hasDragged = false;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        dragTheta = userTheta;
        dragPhi = userPhi;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - dragStartX;
      var dy = e.touches[0].clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged = true;
      }
      userTheta = dragTheta - dx * 0.005;
      userPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, dragPhi - dy * 0.005));
      isUserInteracting = true;
      lastInteractionTime = Date.now();
      clearTimeout(autoRotateTimer);
    }, { passive: true });

    canvas.addEventListener('touchend', function (e) {
      if (isDragging && !hasDragged) {
        var touch = e.changedTouches[0];
        handleClick({ clientX: touch.clientX, clientY: touch.clientY });
      }
      isDragging = false;
      if (isUserInteracting) {
        autoRotateTimer = setTimeout(function () {
          isUserInteracting = false;
        }, RESUME_DELAY);
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      var w = window.innerWidth;
      var h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function handleClick(e) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var meshes = [];
    for (var i = 0; i < imageData.length; i++) {
      var group = imageData[i].group;
      group.children.forEach(function (child) {
        if (child.isMesh) {
          meshes.push(child);
        }
      });
    }

    var intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      var hit = intersects[0].object;
      for (var j = 0; j < imageData.length; j++) {
        var g = imageData[j].group;
        if (g.children.indexOf(hit) !== -1) {
          focusOnImage(j);
          break;
        }
      }
    }
  }

  function focusOnImage(index) {
    if (state === STATE.FLY_IN || !flyInComplete) return;
    if (index === focusIndex) return;

    focusIndex = index;
    nextFocusIndex = (index + 1) % imageData.length;
    state = STATE.FOCUS_TRANSITION;
    transitionStartTime = performance.now();

    var camPos = camera.position.clone();
    var focusPos = imageData[index].endPos.clone();
    var targetCamPos = calculateFocusOrbitPosition(index, 0);

    transitionStartPos.copy(camPos);
    transitionEndPos.copy(targetCamPos);
    transitionStartTarget.copy(getCurrentLookTarget());
    transitionEndTarget.copy(focusPos);

    updateImageInfo(index);
    highlightImage(index);
  }

  function calculateFocusOrbitPosition(index, t) {
    var data = imageData[index];
    var pos = data.endPos;
    var angle = t * Math.PI * 2;
    return new THREE.Vector3(
      pos.x + FOCUS_RADIUS * Math.sin(angle),
      pos.y + 0.4 + 0.3 * Math.sin(angle * 2),
      pos.z + FOCUS_RADIUS * Math.cos(angle)
    );
  }

  function getCurrentLookTarget() {
    var dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    return camera.position.clone().add(dir.multiplyScalar(5));
  }

  function highlightImage(index) {
    for (var i = 0; i < imageData.length; i++) {
      var data = imageData[i];
      if (data.group) {
        data.group.children.forEach(function (child) {
          if (child.material && child.material !== data.frameMat) {
            if (i === index) {
              child.material.opacity = 1;
              child.material.transparent = false;
            } else {
              child.material.transparent = true;
              child.material.opacity = 0.3;
            }
            child.material.needsUpdate = true;
          }
        });
        if (data.frameMat) {
          if (i === index) {
            data.frameMat.emissiveIntensity = 0.8;
            data.frameMat.opacity = 1;
          } else {
            data.frameMat.emissiveIntensity = 0.05;
            data.frameMat.opacity = 0.2;
          }
          data.frameMat.needsUpdate = true;
        }
      }
    }
  }

  function resetHighlight() {
    for (var i = 0; i < imageData.length; i++) {
      var data = imageData[i];
      if (data.group) {
        data.group.children.forEach(function (child) {
          if (child.material && child.material !== data.frameMat) {
            child.material.transparent = false;
            child.material.opacity = 1;
            child.material.needsUpdate = true;
          }
        });
        if (data.frameMat) {
          data.frameMat.emissiveIntensity = 0.15;
          data.frameMat.opacity = 0.5;
          data.frameMat.needsUpdate = true;
        }
      }
    }
  }

  function updateImageInfo(index) {
    if (!imageInfoEl) return;
    imageInfoEl.textContent = '图片 ' + (index + 1) + ' / ' + imageData.length;
    imageInfoEl.classList.add('visible');
  }

  function startFlyIn() {
    state = STATE.FLY_IN;
    flyInStartTime = performance.now();
    flyInComplete = false;
  }

  function updateFlyIn(now) {
    var allDone = true;
    var elapsed = (now - flyInStartTime) / 1000;

    for (var i = 0; i < imageData.length; i++) {
      var data = imageData[i];
      if (!data.isFlying) continue;

      var t = (elapsed - data.flyDelay) / FLY_DURATION;
      if (t < 0) {
        allDone = false;
        continue;
      }
      t = Math.min(t, 1);

      var eased = 1 - Math.pow(1 - t, 3);
      var pos = new THREE.Vector3().copy(data.startPos);
      pos.lerp(data.endPos, eased);
      data.group.position.copy(pos);

      var scale = 0.5 + 0.5 * eased;
      data.group.scale.set(scale, scale, scale);

      data.flyProgress = eased;
      data.isFlying = t < 1;

      if (t >= 1) {
        data.group.position.copy(data.endPos);
        var lookTarget = new THREE.Vector3(0, 0, 0);
        data.group.lookAt(lookTarget);
        data.group.rotateY(Math.PI);
        data.group.scale.set(1, 1, 1);
      } else {
        allDone = false;
      }
    }

    var progress = 0;
    for (var j = 0; j < imageData.length; j++) {
      progress += imageData[j].flyProgress;
    }
    progress /= imageData.length;

    if (!allDone && imageData.length > 0) {
      var orbitP = progress;
      var viewRadius = CAMERA_ORBIT_RADIUS - (CAMERA_ORBIT_RADIUS - 8) * orbitP;
      var viewY = 5 - 2 * orbitP;
      var orbitA = orbitAngle + orbitP * Math.PI * 0.5;
      camera.position.x = viewRadius * Math.sin(orbitA);
      camera.position.y = viewY;
      camera.position.z = viewRadius * Math.cos(orbitA);
      camera.lookAt(0, 0, 0);
    }

    if (allDone && !flyInComplete) {
      flyInComplete = true;
      state = STATE.ORBIT;
      orbitAngle = 0;
      if (imageData.length > 0) {
        updateImageInfo(0);
      }
      resetHighlight();
    }
  }

  function updateOrbit(delta) {
    if (imageData.length === 0) return;

    if (!isUserInteracting) {
      orbitAngle += delta * AUTO_ROTATE_SPEED;
      userTheta = orbitAngle;
    }

    var r = CAMERA_ORBIT_RADIUS;
    var phi = isUserInteracting ? userPhi : Math.PI / 4;
    camera.position.x = r * Math.sin(userTheta) * Math.sin(phi);
    camera.position.y = r * Math.cos(phi);
    camera.position.z = r * Math.cos(userTheta) * Math.sin(phi);
    camera.lookAt(0, 0, 0);

    var currentAngle = ((userTheta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    var targetIndex = -1;
    var bestDiff = Infinity;
    for (var i = 0; i < imageData.length; i++) {
      var imgAngle = ((imageData[i].angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      var diff = Math.abs(currentAngle - imgAngle);
      diff = Math.min(diff, Math.PI * 2 - diff);
      if (diff < bestDiff) {
        bestDiff = diff;
        targetIndex = i;
      }
    }

    if (bestDiff < 0.25 && !isUserInteracting && !isDragging) {
      if (targetIndex !== focusIndex && targetIndex >= 0) {
        autoFocusImage(targetIndex);
      }
    }

    updateImageGlow(delta);
  }

  function autoFocusImage(index) {
    if (state !== STATE.ORBIT) return;
    focusIndex = index;
    nextFocusIndex = (index + 1) % imageData.length;
    state = STATE.FOCUS_TRANSITION;
    transitionStartTime = performance.now();

    var camPos = camera.position.clone();
    var focusPos = imageData[index].endPos.clone();
    var targetCamPos = calculateFocusOrbitPosition(index, 0);

    transitionStartPos.copy(camPos);
    transitionEndPos.copy(targetCamPos);
    transitionStartTarget.copy(getCurrentLookTarget());
    transitionEndTarget.copy(focusPos);

    updateImageInfo(index);
    highlightImage(index);
  }

  function updateFocusTransition(now) {
    var elapsed = (now - transitionStartTime) / 1000;
    var t = Math.min(elapsed / TRANSITION_DURATION, 1);
    var eased = 1 - Math.pow(1 - t, 3);

    camera.position.lerpVectors(transitionStartPos, transitionEndPos, eased);

    var target = new THREE.Vector3().lerpVectors(transitionStartTarget, transitionEndTarget, eased);
    camera.lookAt(target);

    if (t >= 1) {
      state = STATE.FOCUS_ROTATION;
      focusStartTime = now;
    }
  }

  function updateFocusRotation(now) {
    var elapsed = (now - focusStartTime) / 1000;
    var t = Math.min(elapsed / FOCUS_DURATION, 1);

    var camPos = calculateFocusOrbitPosition(focusIndex, t);
    camera.position.copy(camPos);

    var targetPos = imageData[focusIndex].endPos.clone();
    targetPos.y += 0.2;
    camera.lookAt(targetPos);

    updateImageGlow(0.016);

    if (t >= 1) {
      state = STATE.FOCUS_TRANSITION;
      transitionStartTime = now;

      var currentCamPos = camera.position.clone();
      var focusPos = imageData[focusIndex].endPos.clone();

      var nextIdx = nextFocusIndex;
      var nextTarget = imageData[nextIdx].endPos.clone();
      var nextFrameStart = calculateFocusOrbitPosition(nextIdx, 0);
      var nextAngle = imageData[nextIdx].angle;

      var orbitRadius = CAMERA_ORBIT_RADIUS;
      var intermediatePos = new THREE.Vector3(
        orbitRadius * Math.sin(nextAngle + Math.PI * 0.5),
        3,
        orbitRadius * Math.cos(nextAngle + Math.PI * 0.5)
      );

      transitionStartPos.copy(currentCamPos);
      transitionEndPos.copy(nextFrameStart);
      transitionStartTarget.copy(focusPos);
      transitionEndTarget.copy(nextTarget);

      focusIndex = nextIdx;
      nextFocusIndex = (nextIdx + 1) % imageData.length;
      highlightImage(focusIndex);
      updateImageInfo(focusIndex);
    }
  }

  function updateImageGlow(delta) {
    for (var i = 0; i < imageData.length; i++) {
      var data = imageData[i];
      if (data.frameMat && i !== focusIndex) {
        data.glowPhase += delta * 0.5;
        var glow = 0.1 + 0.08 * Math.sin(data.glowPhase);
        data.frameMat.emissiveIntensity = glow;
        data.frameMat.needsUpdate = true;
      }
    }
  }

  function showPage() {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
  }

  function loadConfig() {
    fetch(CONFIG_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('Config load failed');
        return res.json();
      })
      .then(function (data) {
        config = data;
        var images = (data.config.images && Array.isArray(data.config.images)) ? data.config.images : [];
        var audioUrl = data.config.audio || null;

        if (images.length > 0) {
          images = images.map(function (name) { return '/uploads/images/' + name; });
        }

        if (audioUrl) {
          audioUrl = '/uploads/audio/' + audioUrl;
        }

        if (images.length === 0) {
          showPage();
          noImagesMsg.style.display = 'block';
          return;
        }

        initThreeJS(images);

        if (audioUrl) {
          setupAudio(audioUrl);
        } else {
          document.getElementById('audio-controls').classList.add('hidden');
        }

        animate();
        showPage();
      })
      .catch(function (err) {
        noImagesMsg.style.display = 'block';
        noImagesMsg.textContent = '加载失败，请稍后再试';
        showPage();
      });
  }

  function animate() {
    requestAnimationFrame(animate);

    var now = performance.now();
    var delta = clock.getDelta();

    if (state === STATE.FLY_IN) {
      updateFlyIn(now);
    } else if (state === STATE.ORBIT) {
      updateOrbit(delta);
    } else if (state === STATE.FOCUS_TRANSITION) {
      updateFocusTransition(now);
    } else if (state === STATE.FOCUS_ROTATION) {
      updateFocusRotation(now);
    }

    renderer.render(scene, camera);
  }

  window.addEventListener('DOMContentLoaded', function () {
    initUI();

    if (typeof THREE === 'undefined') {
      noImagesMsg.style.display = 'block';
      noImagesMsg.textContent = 'Three.js 加载失败';
      showPage();
      return;
    }

    loadConfig();
  });
})();