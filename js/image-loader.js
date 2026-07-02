/**
 * K7I Dynamic Illustration & Image Loader
 * Reads environment variables from window.ENV without hardcoding API keys.
 * Supports dynamic Pollinations AI / NVIDIA NIM FLUX generation or falls back to local artistic SVG illustrations in assets/images/.
 */

class K7IImageLoader {
  constructor() {
    this.env = window.ENV || {};
    this.provider = this.env.IMAGE_PROVIDER || 'local'; // Options: 'local', 'pollinations', 'nim'
    this.nimApiKey = this.env.NIM_API_KEY || null;
    
    this.prompts = {
      hero: "abstract dark mode cyberpunk glowing cyan amber particles minimalist 3d glassmorphism geometry vector high quality no text",
      darshana: "dark minimalist futuristic data dashboard interface isometric glowing cyan emerald nodes clean aesthetic high quality no text",
      privacy: "cyberpunk cryptographic security vault shield dark obsidian background glowing cyan rings 3d render no text",
      visualization: "3d isometric abstract network graphs glowing violet cyan lines geometric connected data points dark theme no text",
      workspace: "minimalist developer terminal command line code interface dark obsidian lighting cyberpunk desk ambient glow no text"
    };

    this.localPaths = {
      hero: "assets/images/hero-art.svg",
      darshana: "assets/images/darshana-dashboard.svg",
      privacy: "assets/images/privacy-computing.svg",
      visualization: "assets/images/data-visualization.svg",
      workspace: "assets/images/developer-workspace.svg"
    };

    this.init();
  }

  init() {
    document.querySelectorAll('[data-img-key]').forEach(imgEl => {
      const key = imgEl.getAttribute('data-img-key');
      this.loadImage(imgEl, key);
    });
  }

  async loadImage(imgEl, key) {
    const localSrc = this.localPaths[key];
    
    // Default to our high-performance custom SVGs in assets/images/
    if (this.provider === 'local' || (!this.nimApiKey && this.provider === 'nim')) {
      imgEl.src = localSrc;
      return;
    }

    if (this.provider === 'pollinations') {
      const prompt = encodeURIComponent(this.prompts[key] || "abstract dark glowing technology illustration no text");
      const width = imgEl.clientWidth || 800;
      const height = imgEl.clientHeight || 600;
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&nologo=true`;
      
      // Attempt to load AI image with graceful fallback to local SVG
      const tempImg = new Image();
      tempImg.onload = () => { imgEl.src = pollinationsUrl; };
      tempImg.onerror = () => { imgEl.src = localSrc; };
      tempImg.src = pollinationsUrl;
      return;
    }

    if (this.provider === 'nim' && this.nimApiKey) {
      try {
        const response = await fetch("https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux-1-schnell", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.nimApiKey}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            prompt: this.prompts[key],
            width: 1024,
            height: 768,
            steps: 4
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.artifacts && data.artifacts[0]?.base64) {
            imgEl.src = `data:image/jpeg;base64,${data.artifacts[0].base64}`;
            return;
          }
        }
      } catch (err) {
        console.warn(`[K7I Image Loader] NIM generation failed for ${key}, falling back to local asset:`, err);
      }
      imgEl.src = localSrc;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.k7iImageLoader = new K7IImageLoader();
});
