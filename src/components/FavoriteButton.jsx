function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="favorite-icon">
      <path
        d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.12 6.12 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FavoriteButton({ isFavorite, onToggle, pokemonName }) {
  return (
    <button
      type="button"
      className={`favorite-button ${isFavorite ? "active" : ""}`}
      onClick={onToggle}
      aria-label={
        isFavorite
          ? `Remove ${pokemonName} from favorites`
          : `Add ${pokemonName} to favorites`
      }
      title={
        isFavorite
          ? `Remove ${pokemonName} from favorites`
          : `Add ${pokemonName} to favorites`
      }
    >
      <HeartIcon filled={isFavorite} />
    </button>
  );
}

export default FavoriteButton;
