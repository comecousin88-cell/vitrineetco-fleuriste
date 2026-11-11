// L'envol vers le panier : une miniature de la photo part de la carte et se pose sur l'icône du panier.
// Une seule animation, faite par le navigateur (Web Animations) : rien à charger, et elle tient sur téléphone.

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// L'icône du panier visible à l'écran : celle de la barre du haut, sur ordinateur comme sur téléphone.
function cartTarget() {
  return [...document.querySelectorAll<HTMLElement>("[data-cart-target]")].find((element) => element.offsetParent !== null) ?? null;
}

export function flyToCart(source: HTMLElement | null, onLanded: () => void) {
  const target = cartTarget();
  if (!source || !target || reduced()) {
    onLanded();
    return;
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  // La miniature : une copie de la photo (ou de son emplacement provisoire), réduite à un petit carré arrondi.
  const size = Math.min(from.width, from.height, 140);
  const ghost = source.cloneNode(true) as HTMLElement;
  ghost.removeAttribute("id");
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left + (from.width - size) / 2}px`,
    top: `${from.top + (from.height - size) / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    margin: "0",
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: "80",
    pointerEvents: "none",
    boxShadow: "0 12px 30px -12px rgba(36, 56, 44, 0.45)",
    willChange: "transform, opacity",
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const end = 28 / size; // la miniature finit à la taille de l'icône
  // Trois points : elle s'élève un peu avant de filer vers le panier, comme lancée à la main.
  const animation = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "12px" },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 60}px) scale(0.55)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${end})`, opacity: 0.2, borderRadius: "50%" },
    ],
    { duration: 720, easing: "cubic-bezier(0.45, 0, 0.2, 1)" },
  );
  let done = false;
  const land = () => {
    if (done) return;
    done = true;
    ghost.remove();
    onLanded();
  };
  animation.onfinish = land;
  animation.oncancel = land;
  // Si l'onglet passe en arrière-plan pendant le vol, le panier est tout de même mis à jour.
  window.setTimeout(land, 1200);
}
