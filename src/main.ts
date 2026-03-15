import './style.css';
import { Game } from './types';

let games: Game[] = [];
let selectedGame: Game | null = null;
let searchQuery: string = '';

async function init(): Promise<void> {
  try {
    const response = await fetch('/src/data/games.json');
    games = await response.json();
    render();
  } catch (error) {
    console.error('Failed to load games:', error);
  }
}

function render(): void {
  const mainContent = document.getElementById('main-content');
  const searchContainer = document.getElementById('search-container');
  
  if (!mainContent || !searchContainer) return;

  if (selectedGame) {
    searchContainer.classList.add('hidden');
    mainContent.innerHTML = renderPlayer(selectedGame);
  } else {
    searchContainer.classList.remove('hidden');
    const filtered = games.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    mainContent.innerHTML = renderGrid(filtered);
  }
}

function renderGrid(filteredGames: Game[]): string {
  if (filteredGames.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center py-32 text-center animate-fade-up">
        <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
          <svg class="text-zinc-600 w-10 h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 class="text-2xl font-bold mb-3">No results found</h3>
        <p class="text-zinc-500 max-w-xs mx-auto">We couldn't find any games matching your search. Try different keywords.</p>
        <button onclick="window.clearSearch()" class="mt-8 px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:scale-105 transition-all">Clear Search</button>
      </div>
    `;
  }

  return `
    <div class="game-grid animate-fade-up">
      ${filteredGames.map(game => `
        <div class="game-card group cursor-pointer" onclick="window.playGame('${game.id}')">
          <div class="aspect-[16/10] overflow-hidden relative">
            <img
              src="${game.thumbnail}"
              alt="${game.title}"
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
            <div class="play-button-overlay">
              <div class="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <svg class="text-black w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
          <div class="p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-display text-lg font-bold group-hover:text-emerald-400 transition-colors">${game.title}</h3>
              <span class="mono-label text-[9px] px-2 py-1 bg-white/5 rounded border border-white/5">WEBGL</span>
            </div>
            <p class="text-zinc-500 text-sm line-clamp-2 leading-relaxed">${game.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPlayer(game: Game): string {
  return `
    <div class="flex flex-col gap-8 animate-fade-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <button onclick="window.backToGrid()" class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-emerald-500/50 transition-all group">
            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h2 class="font-display text-3xl font-bold tracking-tight">${game.title}</h2>
              <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">LIVE</span>
            </div>
            <p class="text-zinc-500 text-sm">Playing in high-performance mode</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-emerald-500 transition-colors">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
          <button class="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-emerald-500 transition-colors">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          </button>
          <a href="${game.iframeUrl}" target="_blank" class="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:scale-105 transition-all">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            <span>Fullscreen</span>
          </a>
        </div>
      </div>

      <div class="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <iframe
          src="${game.iframeUrl}"
          class="w-full h-full border-none"
          title="${game.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 glass-panel p-8">
          <h3 class="font-display text-xl font-bold mb-4">Description</h3>
          <p class="text-zinc-400 leading-relaxed text-lg">${game.description}</p>
        </div>
        <div class="glass-panel p-8">
          <h4 class="mono-label mb-6">Technical Info</h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-white/5">
              <span class="text-zinc-500 text-sm">Platform</span>
              <span class="text-sm font-medium">Web Browser</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-white/5">
              <span class="text-zinc-500 text-sm">Engine</span>
              <span class="text-sm font-medium">WebGL / JS</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-zinc-500 text-sm">Performance</span>
              <span class="text-emerald-500 text-sm font-bold">OPTIMIZED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global functions for HTML event handlers
(window as any).playGame = (id: string) => {
  selectedGame = games.find(g => g.id === id) || null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
};

(window as any).backToGrid = () => {
  selectedGame = null;
  render();
};

(window as any).clearSearch = () => {
  searchQuery = '';
  const input = document.getElementById('search-input') as HTMLInputElement;
  if (input) input.value = '';
  render();
};

(window as any).handleSearch = (e: Event) => {
  searchQuery = (e.target as HTMLInputElement).value;
  render();
};

document.addEventListener('DOMContentLoaded', init);
