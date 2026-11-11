import type Lenis from "lenis";

// Une seule instance pour tout le site. Elle n'existe pas si le visiteur demande moins d'animations.
let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export function scrollToY(y: number, duration = 1.2) {
  if (lenis) lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y });
}

// Glisse jusqu'à une section, juste sous la barre du haut. De loin (par-dessus les saisons, par exemple),
// on saute d'abord près de l'arrivée : traverser toute la page en accéléré serait plus confus que rapide.
// Le titre de la section reçoit ensuite le focus, pour les lecteurs d'écran et le clavier.
export function scrollToSection(id: string, duration = 1.1) {
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector("header")?.offsetHeight ?? 0;
  const y = target.getBoundingClientRect().top + window.scrollY - header;
  const far = Math.abs(y - window.scrollY) > window.innerHeight * 2.5;
  if (lenis) {
    if (far) lenis.scrollTo(y + (y > window.scrollY ? -1 : 1) * window.innerHeight * 0.6, { immediate: true });
    lenis.scrollTo(y, { duration: far ? 0.8 : duration });
  } else {
    window.scrollTo({ top: y });
  }
  const heading = target.querySelector<HTMLElement>("h2[tabindex]");
  heading?.focus({ preventScroll: true });
}

// Bloque le défilement de la page (une visionneuse ouverte par-dessus), puis le rend.
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
