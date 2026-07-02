/**
 * K7I Darshana Interactive Centerpiece Simulator
 * Simulates a local-first personal data aggregator with zero telemetry.
 */

const DARSHANA_DATA = {
  all: [
    { id: 1, source: 'Bank', icon: 'dollar', color: '#00f0ff', title: 'Salary Deposit: K7I Corp', sub: 'AES-256 Encrypted Local DB', val: '+$8,500.00', time: '2 mins ago' },
    { id: 2, source: 'Spotify', icon: 'music', color: '#10b981', title: 'Listened: Cyberpunk Lofi Beats', sub: 'Local Media History • Zero Tracking', val: '4h 12m', time: '1 hour ago' },
    { id: 3, source: 'Strava', icon: 'activity', color: '#f59e0b', title: 'Morning Run: Golden Gate Loop', sub: 'GPS Trajectory Indexed Offline', val: '10.4 km', time: '3 hours ago' },
    { id: 4, source: 'Email', icon: 'mail', color: '#a855f7', title: 'Invoice Receipt: Cloudflare API', sub: 'OCR Parsed & Vectorized Offline', val: '-$20.00', time: 'Yesterday' },
    { id: 5, source: 'Calendar', icon: 'calendar', color: '#ec4899', title: 'Deep Work: Architecture Sync', sub: 'CalDAV Local Cache', val: '2h 00m', time: 'Yesterday' },
    { id: 6, source: 'AI Insights', icon: 'sparkles', color: '#00f0ff', title: 'Local LLM Summary Generated', sub: '30-Day Spending & Fitness Correlation Analysis', val: '0 Telemetry', time: 'Just now' }
  ],
  bank: [
    { id: 1, source: 'Bank', icon: 'dollar', color: '#00f0ff', title: 'Salary Deposit: K7I Corp', sub: 'AES-256 Encrypted Local DB', val: '+$8,500.00', time: '2 mins ago' },
    { id: 7, source: 'Bank', icon: 'dollar', color: '#00f0ff', title: 'Grocery Supermarket', sub: 'Categorized via Local AI Classifier', val: '-$142.30', time: 'Yesterday' },
    { id: 8, source: 'Bank', icon: 'dollar', color: '#00f0ff', title: 'Annual Savings Yield', sub: 'Automated Compound Growth Tracker', val: '+$320.15', time: '3 days ago' }
  ],
  spotify: [
    { id: 2, source: 'Spotify', icon: 'music', color: '#10b981', title: 'Listened: Cyberpunk Lofi Beats', sub: 'Local Media History • Zero Tracking', val: '4h 12m', time: '1 hour ago' },
    { id: 9, source: 'Spotify', icon: 'music', color: '#10b981', title: 'Podcast: Developer Tea #492', sub: 'Audio Transcript Indexed via Whisper Local', val: '45m 10s', time: 'Yesterday' },
    { id: 10, source: 'Spotify', icon: 'music', color: '#10b981', title: 'Album: Synthwave Classics', sub: 'Offline Playback Count: 14', val: '1h 18m', time: '2 days ago' }
  ],
  strava: [
    { id: 3, source: 'Strava', icon: 'activity', color: '#f59e0b', title: 'Morning Run: Golden Gate Loop', sub: 'GPS Trajectory Indexed Offline', val: '10.4 km', time: '3 hours ago' },
    { id: 11, source: 'Strava', icon: 'activity', color: '#f59e0b', title: 'Evening Cycle: Hill Climb', sub: 'Heart Rate Peak: 172 bpm • Offline Graph', val: '24.8 km', time: '2 days ago' },
    { id: 12, source: 'Strava', icon: 'activity', color: '#f59e0b', title: 'Recovery Stretch & Yoga', sub: 'Apple Health Kit Local Bridge', val: '30.0 mins', time: '4 days ago' }
  ],
  ai: [
    { id: 6, source: 'AI Insights', icon: 'sparkles', color: '#00f0ff', title: 'Local LLM Summary Generated', sub: '30-Day Spending & Fitness Correlation Analysis', val: '0 Telemetry', time: 'Just now' },
    { id: 13, source: 'AI Insights', icon: 'sparkles', color: '#a855f7', title: 'OCR Search: Tax Document 2025', sub: 'Found 4 receipts matching "Hardware Deduction"', val: '0.04s SQL', time: '5 mins ago' },
    { id: 14, source: 'AI Insights', icon: 'sparkles', color: '#10b981', title: 'Productivity Trend: Optimal Sleep', sub: 'Correlated Calendar Focus Blocks with Oura Local', val: '+18% Focus', time: 'Today' }
  ]
};

class DarshanaSimulator {
  constructor() {
    this.container = document.getElementById('darshanaSimContent');
    this.queryText = document.getElementById('simQueryText');
    this.statusText = document.getElementById('simStatusText');
    this.tabButtons = document.querySelectorAll('.sim-tab-btn');
    
    if (!this.container) return;
    this.currentTab = 'all';
    this.init();
  }

  init() {
    this.renderRecords(DARSHANA_DATA.all);
    
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    const data = DARSHANA_DATA[tab] || DARSHANA_DATA.all;
    
    // Update SQL query text simulation
    if (this.queryText) {
      if (tab === 'all') this.queryText.textContent = "SELECT * FROM timeline ORDER BY timestamp DESC LIMIT 10;";
      if (tab === 'bank') this.queryText.textContent = "SELECT * FROM transactions WHERE source = 'Bank' AND encrypted = true;";
      if (tab === 'spotify') this.queryText.textContent = "SELECT * FROM media_log WHERE app = 'Spotify' AND telemetry = 0;";
      if (tab === 'strava') this.queryText.textContent = "SELECT activity, distance FROM fitness WHERE gps_stored = 'local';";
      if (tab === 'ai') this.queryText.textContent = "SELECT insight FROM llm_summary WHERE mode = 'offline_zero_cloud';";
    }

    // Flash status
    if (this.statusText) {
      this.statusText.style.color = "#00f0ff";
      this.statusText.textContent = `● QUERY EXECUTED IN 0.002ms • 0 BYTES CLOUD TELEMETRY`;
      setTimeout(() => {
        this.statusText.style.color = "#10b981";
        this.statusText.textContent = `● SQLITE ONLINE • 100% LOCAL-FIRST VAULT`;
      }, 600);
    }

    // Animate out and render new records
    this.container.style.opacity = '0';
    this.container.style.transform = 'translateY(10px)';
    setTimeout(() => {
      this.renderRecords(data);
      this.container.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      this.container.style.opacity = '1';
      this.container.style.transform = 'translateY(0)';
    }, 150);
  }

  renderRecords(records) {
    if (!this.container) return;
    this.container.innerHTML = records.map(rec => {
      const iconSvg = window.renderIcon ? window.renderIcon(rec.icon) : '';
      return `
        <div class="data-row">
          <div class="data-row-left">
            <div class="data-icon-box" style="background: ${rec.color}18; color: ${rec.color}; border: 1px solid ${rec.color}33;">
              ${iconSvg || '⚡'}
            </div>
            <div>
              <div class="data-row-title">${rec.title}</div>
              <div class="data-row-sub">${rec.sub} • <span style="color: #64748b;">${rec.time}</span></div>
            </div>
          </div>
          <div class="data-row-value" style="color: ${rec.color};">${rec.val}</div>
        </div>
      `;
    }).join('');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new DarshanaSimulator();
});
