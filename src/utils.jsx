import { SPRITE_BASE_URL } from "./config.jsx";

export function getIdFromUrl(url) {
  // url looks like "https://pokeapi.co/api/v2/pokemon/25/"
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatStatName(statName) {
  return statName
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getAnimatedSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
}

export function getDetailSprite(pokemon) {
  const animatedFront =
    pokemon?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;

  if (animatedFront) {
    return animatedFront;
  }

  return pokemon?.sprites?.other?.["official-artwork"]?.front_default || getSpriteUrl(pokemon?.id);
}

export function getPokemonTypeStyle(type) {
  const typeMap = {
    normal: { background: "#a8a878", color: "#fff" },
    fire: { background: "#f08030", color: "#fff" },
    water: { background: "#6890f0", color: "#fff" },
    electric: { background: "#f8d030", color: "#222" },
    grass: { background: "#78c850", color: "#fff" },
    ice: { background: "#98d8d8", color: "#222" },
    fighting: { background: "#c03028", color: "#fff" },
    poison: { background: "#a040a0", color: "#fff" },
    ground: { background: "#e0c068", color: "#222" },
    flying: { background: "#a890f0", color: "#fff" },
    psychic: { background: "#f85888", color: "#fff" },
    bug: { background: "#a8b820", color: "#fff" },
    rock: { background: "#b8a038", color: "#fff" },
    ghost: { background: "#705898", color: "#fff" },
    dragon: { background: "#7038f8", color: "#fff" },
    dark: { background: "#705848", color: "#fff" },
    steel: { background: "#b8b8d0", color: "#222" },
    fairy: { background: "#ee99ac", color: "#222" },
  };

  return typeMap[type] || { background: "#68a090", color: "#fff" };
}

export function getFavoriteKey() {
  return "pokedex-mini-favorites";
}

export function loadFavorites() {
  try {
    const stored = localStorage.getItem(getFavoriteKey());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(getFavoriteKey(), JSON.stringify(favorites));
}