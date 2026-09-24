import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.jsx";
import { getIdFromUrl, capitalize, getAnimatedSpriteUrl } from "../utils.jsx";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=20`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setPokemons(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemons();
  }, []);

  if (isLoading) {
    return <p className="status">Loading Pokémon…</p>;
  }

  if (error) {
    return <p className="status status-error">Couldn't load the list: {error}</p>;
  }

  return (
    <section className="list-panel">
      <div className="section-header">
        <h3>Pokémon roster</h3>
      </div>

      <ul className="pokemon-list">
        {pokemons.map((pokemon) => {
          const id = getIdFromUrl(pokemon.url);

          return (
            <li key={pokemon.name} className="pokemon-list-item">
              <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
                <img
                  className="pokemon-sprite"
                  src={getAnimatedSpriteUrl(id)}
                  alt={pokemon.name}
                  width={48}
                  height={48}
                />
                <span className="pokemon-id">#{id.padStart(3, "0")}</span>
                <span className="pokemon-name">{capitalize(pokemon.name)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default PokemonList;