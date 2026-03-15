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
      <div class="text-center py-20">
        <div class="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
          <svg class="text-zinc-600 w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">No games found</h3>
        <p class="text-zinc-500">Try searching for something else or browse our collection.</p>
        <button onclick="window.clearSearch()" class="mt-6 text-emerald-500 hover:underline font-medium">Clear search</button>
      </div>
    `;
  }

  return `
    <div class="game-grid">
      ${filteredGames.map(game => `
        <div class="glass-card rounded-2xl overflow-hidden group cursor-pointer" onclick="window.playGame('${game.id}')">
          <div class="aspect-[4/3] overflow-hidden relative">
            <img
              src="${game.thumbnail}"
              alt="${game.title}"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerpolicy="no-referrer"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span class="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-lg font-bold text-sm">PLAY NOW</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-display text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors">${game.title}</h3>
            <p class="text-zinc-500 text-sm line-clamp-2">${game.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPlayer(game: Game): string {
  return `
    <div class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex items-center justify-between">
        <button onclick="window.backToGrid()" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          <span>Back to Games</span>
        </button>
        <div class="flex items-center gap-4">
          <h2 class="font-display text-2xl font-bold">${game.title}</h2>
          <div class="h-4 w-px bg-white/10"></div>
          <a href="${game.iframeUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        </div>
      </div>

      <div class="relative aspect-video w-full glass-card rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/5">
        <iframe
          src="${game.iframeUrl}"
          class="w-full h-full border-none"
          title="${game.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <div class="glass-card p-6 rounded-2xl">
        <h3 class="text-lg font-semibold mb-2">About ${game.title}</h3>
        <p class="text-zinc-400 leading-relaxed">${game.description}</p>
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
