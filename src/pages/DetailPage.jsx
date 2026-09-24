import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { API_BASE_URL } from "../config.jsx";
import {
  capitalize,
  formatStatName,
  getDetailSprite,
  getPokemonTypeStyle,
  loadFavorites,
  saveFavorites,
} from "../utils.jsx";

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }

        const data = await response.json();

        if (isCurrent) {
          setPokemon(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrent = false;
    };
  }, [name]);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = setTimeout(() => {
      setToastMessage("");
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [toastMessage]);

  const isFavorite = useMemo(
    () => favorites.includes(name),
    [favorites, name],
  );

  function toggleFavorite() {
    const nextIsFavorite = !isFavorite;

    setFavorites((currentFavorites) => {
      const updatedFavorites = nextIsFavorite
        ? [name, ...currentFavorites.filter((favorite) => favorite !== name)]
        : currentFavorites.filter((favorite) => favorite !== name);

      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });

    setToastMessage(
      nextIsFavorite
        ? `${capitalize(name)} saved to favorites`
        : `${capitalize(name)} removed from favorites`,
    );
  }

  if (isLoading) return <p className="status">Loading {name}…</p>;
  if (error) return <p className="status status-error">{error}</p>;

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  return (
    <div className="detail-page">
      {toastMessage ? <div className="favorite-toast">{toastMessage}</div> : null}

      <Link to="/" className="back-link">← Back to list</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-identity">
            <span className="detail-id">#{String(pokemon.id).padStart(3, "0")}</span>
            <h2>{capitalize(pokemon.name)}</h2>
          </div>

          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={toggleFavorite}
            pokemonName={pokemon.name}
          />
        </div>

        <div className="detail-visuals">
          <img
            src={getDetailSprite(pokemon)}
            alt={pokemon.name}
            className="detail-image"
          />

          <div className="mini-details">
            <div className="detail-metric">
              <label>Height</label>
              <strong>{heightInMeters} m</strong>
            </div>
            <div className="detail-metric">
              <label>Weight</label>
              <strong>{weightInKg} kg</strong>
            </div>
            <div className="detail-metric">
              <label>Base total</label>
              <strong>{totalStats}</strong>
            </div>
          </div>
        </div>

        <div className="type-row">
          {pokemon.types.map((type) => {
            const style = getPokemonTypeStyle(type.type.name);

            return (
              <span
                key={type.type.name}
                className="type-badge"
                style={{ background: style.background, color: style.color }}
              >
                {capitalize(type.type.name)}
              </span>
            );
          })}
        </div>

        <div className="detail-grid">
          <section className="detail-panel">
            <h3>Base stats</h3>
            <ul className="stat-list">
              {pokemon.stats.map((s) => (
                <li key={s.stat.name}>
                  <span className="stat-name">{formatStatName(s.stat.name)}</span>
                  <span className="stat-value">{s.base_stat}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-panel">
            <h3>Pokédex notes</h3>
            <ul className="info-list">
              <li>
                <span>Species</span>
                <strong>{capitalize(pokemon.name)}</strong>
              </li>
              <li>
                <span>Abilities</span>
                <strong>
                  {pokemon.abilities.map((ability) => capitalize(ability.ability.name)).join(", ")}
                </strong>
              </li>
              <li>
                <span>Moves</span>
                <strong>{pokemon.moves.length} known moves</strong>
              </li>
              <li>
                <span>Favorite</span>
                <strong>{isFavorite ? "Saved" : "Not saved"}</strong>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;