/* ============================================================
   FIREWORKS — Colorful background animation
   ============================================================ */
(function () {
  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H;
  const fireworks = [];
  const particles = [];
  const colors = [
    "#ff4757", "#ff6b81", "#ffa502", "#ffda79",
    "#1e90ff", "#70a1ff", "#2ed573", "#7bed9f",
    "#a55eea", "#d980fa", "#ff6348", "#eccc68",
    "#00d2d3", "#f368e0", "#ff9ff3", "#48dbfb"
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // --- Firework (rising projectile) ---
  function Firework() {
    this.x  = Math.random() * W;
    this.y  = H;
    this.tx = Math.random() * W;
    this.ty = H * (0.1 + Math.random() * 0.35);
    this.speed  = 2.5 + Math.random() * 2;
    this.angle  = Math.atan2(this.ty - this.y, this.tx - this.x);
    this.vx     = Math.cos(this.angle) * this.speed;
    this.vy     = Math.sin(this.angle) * this.speed;
    this.color  = colors[Math.floor(Math.random() * colors.length)];
    this.trail  = [];
    this.alive  = true;
  }

  Firework.prototype.update = function () {
    this.trail.push({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > 12) this.trail.shift();

    this.x += this.vx;
    this.y += this.vy;

    // Check if reached target area
    var dist = Math.hypot(this.x - this.tx, this.y - this.ty);
    if (dist < 8) {
      this.alive = false;
      explode(this.x, this.y, this.color);
    }

    // Fade trail
    for (var i = 0; i < this.trail.length; i++) {
      this.trail[i].alpha -= 0.08;
    }
  };

  Firework.prototype.draw = function () {
    // Trail
    for (var i = 0; i < this.trail.length; i++) {
      var t = this.trail[i];
      if (t.alpha <= 0) continue;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(t.alpha, 0) * 0.5;
      ctx.fill();
    }
    // Head
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  // --- Particle (explosion piece) ---
  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    var angle = Math.random() * Math.PI * 2;
    var speed = 1 + Math.random() * 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha   = 1;
    this.decay   = 0.008 + Math.random() * 0.015;
    this.gravity = 0.04;
    this.color   = color;
    this.radius  = 1.5 + Math.random() * 2;
  }

  Particle.prototype.update = function () {
    this.vx *= 0.985;
    this.vy *= 0.985;
    this.vy += this.gravity;
    this.x  += this.vx;
    this.y  += this.vy;
    this.alpha -= this.decay;
  };

  Particle.prototype.draw = function () {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  function explode(x, y, baseColor) {
    // Mix of base color + a couple random colors for variety
    var count = 50 + Math.floor(Math.random() * 40);
    for (var i = 0; i < count; i++) {
      var c = (i % 4 === 0) ? colors[Math.floor(Math.random() * colors.length)] : baseColor;
      particles.push(new Particle(x, y, c));
    }
  }

  // --- Launch timing ---
  var launchTimer  = 0;
  var launchRate   = 55; // frames between launches (lower = more frequent)

  function loop() {
    requestAnimationFrame(loop);

    // Semi-transparent clear for trailing effect
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, W, H);

    // Launch new fireworks
    launchTimer++;
    if (launchTimer >= launchRate) {
      launchTimer = 0;
      // Launch 1-2 at a time
      var batch = 1 + Math.floor(Math.random() * 2);
      for (var b = 0; b < batch; b++) {
        fireworks.push(new Firework());
      }
      // Vary the rate slightly
      launchRate = 40 + Math.floor(Math.random() * 40);
    }

    // Update & draw fireworks
    for (var i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (!fireworks[i].alive) fireworks.splice(i, 1);
    }

    // Update & draw particles
    for (var j = particles.length - 1; j >= 0; j--) {
      particles[j].update();
      particles[j].draw();
      if (particles[j].alpha <= 0) particles.splice(j, 1);
    }

    ctx.globalAlpha = 1;
  }

  loop();
})();
