/* ============================================================
   JAZZ BACKGROUND — Animated floating instruments & notes
   ============================================================ */
(function () {
  var canvas = document.getElementById("jazz-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var W, H;
  var elements = [];
  var maxElements = 28;

  var goldTones = [
    "rgba(212,166,80,0.35)",
    "rgba(212,166,80,0.22)",
    "rgba(232,196,120,0.28)",
    "rgba(180,140,60,0.2)",
    "rgba(255,215,100,0.18)",
    "rgba(200,160,80,0.25)"
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- Draw functions for each instrument / symbol ----

  function drawMusicNote(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.12;

    // Stem
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.5);
    ctx.lineTo(size * 0.3, size * 0.25);
    ctx.stroke();

    // Note head (filled ellipse)
    ctx.beginPath();
    ctx.ellipse(size * 0.15, size * 0.25, size * 0.2, size * 0.15, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Flag
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.5);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.3, size * 0.35, -size * 0.1);
    ctx.stroke();

    ctx.restore();
  }

  function drawDoubleNote(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.1;

    // Two stems
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, -size * 0.5);
    ctx.lineTo(-size * 0.15, size * 0.3);
    ctx.moveTo(size * 0.25, -size * 0.5);
    ctx.lineTo(size * 0.25, size * 0.3);
    ctx.stroke();

    // Beam connecting them
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, -size * 0.5);
    ctx.lineTo(size * 0.25, -size * 0.5);
    ctx.stroke();

    // Note heads
    ctx.beginPath();
    ctx.ellipse(-size * 0.25, size * 0.3, size * 0.18, size * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.15, size * 0.3, size * 0.18, size * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawSaxophone(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = "round";

    // Mouthpiece
    ctx.beginPath();
    ctx.moveTo(-size * 0.05, -size * 0.55);
    ctx.lineTo(size * 0.05, -size * 0.4);
    ctx.stroke();

    // Neck (curved)
    ctx.beginPath();
    ctx.moveTo(size * 0.05, -size * 0.4);
    ctx.quadraticCurveTo(size * 0.15, -size * 0.2, size * 0.1, 0);
    ctx.stroke();

    // Body (main tube curving down)
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(size * 0.1, 0);
    ctx.quadraticCurveTo(size * 0.15, size * 0.2, size * 0.05, size * 0.35);
    ctx.quadraticCurveTo(-size * 0.1, size * 0.5, -size * 0.2, size * 0.45);
    ctx.stroke();

    // Bell (flared end)
    ctx.beginPath();
    ctx.arc(-size * 0.2, size * 0.45, size * 0.12, 0, Math.PI * 2);
    ctx.stroke();

    // Keys (small dots)
    ctx.fillStyle = color;
    var keys = [[0.12, -0.05], [0.14, 0.1], [0.12, 0.2]];
    for (var i = 0; i < keys.length; i++) {
      ctx.beginPath();
      ctx.arc(size * keys[i][0], size * keys[i][1], size * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawTrumpet(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = "round";

    // Mouthpiece
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, 0);
    ctx.lineTo(-size * 0.35, 0);
    ctx.stroke();

    // Main tube
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.35, 0);
    ctx.lineTo(size * 0.2, 0);
    ctx.stroke();

    // Bell (flared)
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 0.12);
    ctx.quadraticCurveTo(size * 0.45, -size * 0.2, size * 0.5, 0);
    ctx.quadraticCurveTo(size * 0.45, size * 0.2, size * 0.2, size * 0.12);
    ctx.stroke();

    // Valves (3 rectangles on top)
    ctx.fillStyle = color;
    for (var v = -1; v <= 1; v++) {
      ctx.fillRect(-size * 0.05 + v * size * 0.12, -size * 0.2, size * 0.06, size * 0.12);
    }

    ctx.restore();
  }

  function drawPianoKeys(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.04;

    // White keys
    var keyW = size * 0.12;
    var keyH = size * 0.45;
    for (var k = 0; k < 7; k++) {
      ctx.strokeRect(-size * 0.42 + k * keyW, -keyH * 0.5, keyW, keyH);
    }

    // Black keys
    ctx.fillStyle = color;
    var blackPos = [0, 1, 3, 4, 5];
    for (var b = 0; b < blackPos.length; b++) {
      var bx = -size * 0.42 + blackPos[b] * keyW + keyW * 0.65;
      ctx.fillRect(bx, -keyH * 0.5, keyW * 0.7, keyH * 0.55);
    }

    ctx.restore();
  }

  function drawTrebleClef(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = "round";

    // Simplified treble clef shape
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.quadraticCurveTo(-size * 0.25, size * 0.15, -size * 0.1, -size * 0.1);
    ctx.quadraticCurveTo(size * 0.05, -size * 0.35, size * 0.15, -size * 0.5);
    ctx.quadraticCurveTo(size * 0.2, -size * 0.3, size * 0.1, -size * 0.15);
    ctx.quadraticCurveTo(-size * 0.1, 0.05, -size * 0.15, size * 0.15);
    ctx.quadraticCurveTo(-size * 0.1, size * 0.35, size * 0.1, size * 0.3);
    ctx.stroke();

    // Bottom curl
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.quadraticCurveTo(size * 0.12, size * 0.55, size * 0.05, size * 0.65);
    ctx.stroke();

    ctx.restore();
  }

  function drawVinylRecord(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.05;

    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // Grooves
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.stroke();

    // Center label
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Center hole
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    ctx.restore();
  }

  // ---- Element class ----
  var drawFns = [
    drawMusicNote, drawDoubleNote, drawSaxophone,
    drawTrumpet, drawPianoKeys, drawTrebleClef, drawVinylRecord
  ];

  function JazzElement() {
    this.reset(true);
  }

  JazzElement.prototype.reset = function (initial) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : H + 60;
    this.size = 30 + Math.random() * 50;
    this.color = goldTones[Math.floor(Math.random() * goldTones.length)];
    this.drawFn = drawFns[Math.floor(Math.random() * drawFns.length)];
    this.rotation = (Math.random() - 0.5) * 0.6;
    this.rotationSpeed = (Math.random() - 0.5) * 0.003;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(0.15 + Math.random() * 0.35);
    this.alpha = initial ? (0.3 + Math.random() * 0.5) : 0;
    this.targetAlpha = 0.3 + Math.random() * 0.5;
    this.swayPhase = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.005 + Math.random() * 0.01;
    this.swayAmount = 0.3 + Math.random() * 0.5;
  };

  JazzElement.prototype.update = function () {
    this.swayPhase += this.swaySpeed;
    this.x += this.vx + Math.sin(this.swayPhase) * this.swayAmount;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Fade in
    if (this.alpha < this.targetAlpha) {
      this.alpha += 0.003;
    }

    // Reset when off screen
    if (this.y < -80 || this.x < -80 || this.x > W + 80) {
      this.reset(false);
    }
  };

  JazzElement.prototype.draw = function () {
    ctx.globalAlpha = Math.max(this.alpha, 0);
    this.drawFn(ctx, this.x, this.y, this.size, this.color, this.rotation);
    ctx.globalAlpha = 1;
  };

  // ---- Initialize ----
  for (var i = 0; i < maxElements; i++) {
    elements.push(new JazzElement());
  }

  // ---- Animation loop ----
  function loop() {
    requestAnimationFrame(loop);

    // Dark clear with slight trail
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(26, 21, 32, 0.06)";
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < elements.length; i++) {
      elements[i].update();
      elements[i].draw();
    }
  }

  loop();
})();
