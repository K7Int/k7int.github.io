/**
 * K7I Hero Particle Canvas — subtle floating nodes with mouse proximity glow.
 */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.w = this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.h = this.canvas.height = this.canvas.parentElement.offsetHeight;
    const count = window.innerWidth < 768 ? 25 : 50;
    if (this.particles.length !== count) this.createParticles(count);
  }

  createParticles(n) {
    const colors = ['rgba(0,240,255,', 'rgba(112,0,255,', 'rgba(255,255,255,'];
    this.particles = [];
    for (let i = 0; i < (n || 50); i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: Math.random() * 0.4 + 0.15
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); });
    window.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    });
    window.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    const ps = this.particles;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.h) p.vy *= -1;

      // mouse proximity
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < this.mouse.radius) {
          const f = (this.mouse.radius - d) / this.mouse.radius;
          p.x += (dx / d) * f * 1.2;
          p.y += (dy / d) * f * 1.2;
          p.a = Math.min(0.8, p.a + f * 0.3);
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.c + p.a + ')';
      this.ctx.fill();

      // connections
      for (let j = i + 1; j < ps.length; j++) {
        const q = ps[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'rgba(0,240,255,' + ((1 - dist / 110) * 0.12) + ')';
          this.ctx.lineWidth = 0.6;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => { new ParticleSystem('heroCanvas'); });
