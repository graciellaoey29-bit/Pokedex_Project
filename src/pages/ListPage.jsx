import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm.jsx";
import PokemonList from "../components/PokemonList.jsx";
import { API_BASE_URL } from "../config.jsx";
import {
  capitalize,
  getAnimatedSpriteUrl,
  getIdFromUrl,
  loadFavorites,
  saveFavorites,
} from "../utils.jsx";

function ListPage() {
  const [featuredPokemon, setFeaturedPokemon] = useState(null);
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    async function loadFeaturedPokemon() {
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=200`);
        if (!response.ok) return;

        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const selected = data.results[randomIndex];

        const pokemonResponse = await fetch(selected.url);
        if (!pokemonResponse.ok) return;

        const pokemonData = await pokemonResponse.json();
        setFeaturedPokemon(pokemonData);
      } catch {
        // ignore featured load failures
      }
    }

    loadFeaturedPokemon();
  }, []);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const favoritePreview = useMemo(() => favorites.slice(0, 3), [favorites]);

  function removeFavorite(name) {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((favorite) => favorite !== name),
    );
  }

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Pokédex archive</p>
          <h2>Explore the world of Pokémon</h2>
          <p>
            Track your favorites, discover new species, and view every key stat in one
            compact encyclopedia.
          </p>
        </div>

        {featuredPokemon ? (
          <Link to={`/pokemon/${featuredPokemon.name}`} className="featured-card">
            <div className="featured-sprite-wrap">
              <img
                src={
                  featuredPokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated
                    ?.front_default ||
                  getAnimatedSpriteUrl(String(featuredPokemon.id))
                }
                alt={featuredPokemon.name}
                className="featured-sprite"
              />
            </div>
            <div className="featured-text">
              <span className="featured-badge">Featured Pokémon</span>
              <strong>{capitalize(featuredPokemon.name)}</strong>
              <span>
                #{String(getIdFromUrl(featuredPokemon.species.url)).padStart(3, "0")}
              </span>
            </div>
          </Link>
        ) : null}
      </section>

      <SearchForm />

      <section className="info-grid">
        <div className="info-card favorites-card">
          <button
            type="button"
            className="favorites-trigger"
            onClick={() => setIsFavoritesOpen((open) => !open)}
          >
            <span className="info-label">Favorites</span>
            <strong>{favorites.length}</strong>
            <small>{favorites.length ? "View saved Pokémon" : "No favorites yet"}</small>
          </button>

          {isFavoritesOpen ? (
            <div className="favorites-modal" role="dialog" aria-label="Favorite Pokémon list">
              <div className="favorites-modal-header">
                <span>Saved Pokémon</span>
                <button type="button" className="favorites-close" onClick={() => setIsFavoritesOpen(false)}>
                  Close
                </button>
              </div>

              {favorites.length > 0 ? (
                <ul className="favorites-modal-list">
                  {favorites.map((name) => (
                    <li key={name} className="favorites-modal-item">
                      <Link to={`/pokemon/${name}`} onClick={() => setIsFavoritesOpen(false)} className="favorites-modal-link">
                        {capitalize(name)}
                      </Link>

                      <button
                        type="button"
                        className="favorites-remove"
                        onClick={() => removeFavorite(name)}
                        aria-label={`Remove ${capitalize(name)} from favorites`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="favorites-empty">No favorites saved yet.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="info-card">
          <span className="info-label">Pokédex</span>
          <strong>National</strong>
          <small>Classic archive</small>
        </div>

        <div className="info-card accent">
          <span className="info-label">Quick access</span>
          <strong>{favoritePreview.length}</strong>
          <small>{favoritePreview.length ? "Recent favorites" : "No favorites yet"}</small>
        </div>
      </section>

      {favoritePreview.length > 0 ? (
        <section className="favorites-strip">
          <div className="section-header">
            <h3>Favorite team</h3>
          </div>
          <div className="favorite-preview-list">
            {favoritePreview.map((name) => (
              <Link key={name} to={`/pokemon/${name}`} className="favorite-preview-item">
                <span className="favorite-dot">★</span>
                <span>{capitalize(name)}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <PokemonList />
    </>
  );
}

export default ListPage;