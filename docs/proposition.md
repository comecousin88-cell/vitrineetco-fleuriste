# La Fleur du Coin — proposition

Fleuriste de quartier fictive, Paris 12e (adresse fictive à fixer, numéros en 01 99 00 xx xx comme le bistrot).
Mardi–samedi 9 h–19 h 30, dimanche 9 h–13 h, fermé le lundi. Livraison le jour même pour toute commande avant 14 h.

Deux directions partagent la même structure, les mêmes outils et les mêmes données. Elles diffèrent par la lumière,
la typographie, la mise en page et le moment fort.

---

## Direction A — « Lumière du matin »

La boutique à 9 h, quand le soleil traverse la vitrine. Le site est clair, aéré, presque silencieux : ce qui bouge,
c'est la lumière. Une vraie vidéo d'ombres de feuillage sur un mur blanc glisse très lentement sur certaines
sections (jamais sur le catalogue ni les formulaires, où elle ne ferait que gêner), comme si la page était posée près de la vitrine.

**Couleurs**

| Nom | Hex | Rôle |
|---|---|---|
| Blanc de chaux | `#F3F4EE` | fond, légèrement vert, plus frais qu'un crème |
| Vert tige | `#24382C` | texte, à la place du noir |
| Sauge | `#9BAE95` | surfaces, filtres actifs, badge « Ouvert » |
| Rose poudré | `#EDCFC8` | fonds de cartes, sélection de taille |
| Terracotta | `#B5603A` | un seul usage : les boutons « Commander » |
| Papier | `#FBFBF8` | champs de formulaire, panneaux |

**Typographie** : Young Serif (titres, un seul poids, rond et végétal, sans le côté « mariage » des Didones) +
Hanken Grotesk (texte, prix en chiffres tabulaires, formulaires). Aucune capitale espacée, aucun script.

**Mise en page** : éditoriale et décalée pour les titres et les photos (colonnes asymétriques, photos qui débordent
la grille), stricte pour le catalogue, les prix et les formulaires (grille de 12 colonnes, chiffres alignés à droite).

```
HERO (ordinateur)                         SÉLECTION
┌───────────────────────────────────────┐ ┌──────────────────────────────────────┐
│ ○ Ouvert jusqu'à 19 h 30   01 99 …  [Commander]│ Ce que j'ai composé ce matin         │
│                                       │ │ [Occasion ▾] [Couleur ▾] [Budget ▾]  │
│  La Fleur     ┌──────────────┐        │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  du Coin      │  vidéo :     │        │ │ │4:5 │ │    │ │    │ │    │          │
│               │  les mains   │        │ │ └────┘ └────┘ └────┘ └────┘          │
│  Des fleurs   │  composent   │        │ │ Nom          Nom     ...              │
│  d'ici, …     │              │        │ │ S 35 M 50 L 70  [+]                   │
│  Livraison aujourd'hui avant 14 h     │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  [Commander]  └──────────────┘        │ │ ...                                   │
└───────────────────────────────────────┘ └──────────────────────────────────────┘
```

**Moment fort** : la vidéo du hero, cadrée comme une fenêtre dans la page, s'agrandit pendant la composition jusqu'à
remplir l'écran au nœud du ruban, puis le bouton « Commander ce bouquet » apparaît sur le bouquet fini.

---

## Direction B — « Aplats de saison »

Le cahier de la fleuriste : de grands aplats de couleur unie (sauge, rose poudré, terracotta pâle) qui changent
d'une section à l'autre, des fleurs détourées posées dessus, une typographie grande et franche. Plus graphique, plus
pop, proche d'une affiche de marché ou d'un sachet de graines.

**Couleurs**

| Nom | Hex | Rôle |
|---|---|---|
| Blanc papier | `#F6F5F1` | fond du catalogue et des formulaires |
| Sauge franche | `#A8BC9F` | aplat principal (hero, univers) |
| Rose poudré | `#F0C9C1` | aplat (abonnement, ateliers) |
| Terracotta pâle | `#D99171` | aplat de saison, boutons « Commander » |
| Vert forêt | `#1F3A2B` | texte |
| Crème de pétale | `#FFF8EF` | cartes sur aplat |

**Typographie** : une seule famille, Familjen Grotesk, en très grand pour les titres (serré, gras) et en petit pour
le reste. Les prix en gras tabulaire. Le ton graphique vient de l'échelle, pas d'un effet.

**Mise en page** : blocs pleine largeur, titres énormes qui passent derrière les fleurs détourées, catalogue sur fond
blanc pour que les photos restent homogènes.

```
HERO (ordinateur)                         SÉLECTION
┌───────────────────────────────────────┐ ┌──────────────────────────────────────┐
│█████████████ aplat sauge █████████████│ │ blanc papier                         │
│ LA FLEUR DU COIN (énorme, derrière)   │ │ Ce matin                [filtres]    │
│        ┌──────────────┐               │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│        │ vidéo plein  │  ○ Ouvert     │ │ │    │ │    │ │    │ │    │          │
│        │ centre       │  Livraison    │ │ └────┘ └────┘ └────┘ └────┘          │
│        └──────────────┘  avant 14 h   │ │ ...                                   │
│ [Commander]                           │ │                                      │
└───────────────────────────────────────┘ └──────────────────────────────────────┘
```

**Moment fort** : les fleurs détourées (vraies photos) s'ouvrent et pivotent à l'entrée des sections, et le fond de
toute la page glisse d'un aplat à l'autre au fil du défilement, pas seulement dans les saisons.

---

## Relecture contre les réflexes par défaut

- A frôlait le cliché « fond crème + serif + terracotta ». Corrigé : fond légèrement vert et non crème, serif rond
  plutôt qu'une Didone de magazine, terracotta réservé aux seuls boutons de commande, et la signature vient de la
  lumière filmée, pas de la typographie.
- B frôlait le kit de cartes arrondies identiques. Corrigé : les univers sont des aplats pleine largeur, pas des
  cartes, et seules les cartes du catalogue ont un arrondi (léger).
- Les deux : pas de numéros 01/02/03 (aucune section n'est une suite), sauf les étapes de commande qui en sont une.
- Différent des démos précédentes : le caviste en Libre Caslon, le bistrot en Gloock + Alegreya Sans.

**Ma recommandation : A.** Elle traduit littéralement « baignée de lumière naturelle », vieillit mieux, et laisse
les vraies photos porter la couleur. B est plus spectaculaire mais dépend de détourages parfaits.

---

## Plan technique commun

- **Base** : Next.js (App Router, TypeScript, CSS Modules), comme les deux démos précédentes. Polices auto-hébergées
  par `next/font`. Données dans `src/data/*.ts` (bouquets, livraison, deuil, ateliers, horaires) : le contenu se
  change sans toucher aux composants.
- **Défilement** : Lenis synchronisé sur le ticker de GSAP, ScrollTrigger branché sur Lenis. Désactivé avec
  `prefers-reduced-motion`.
- **Vidéos pilotées par le scroll** : comme au bistrot, la vidéo est découpée en séquence d'images WebP dessinées
  dans un `<canvas>` (plus fluide et plus précis que `video.currentTime`), une série paysage, une série portrait
  recadrée au centre pour le téléphone, une série HD seulement pour les grands écrans. Scripts Python dans
  `scripts/` qui lisent `source/` et écrivent dans `public/`.
- **Motion** : micro-interactions et changements d'état (filtres avec réorganisation animée de la grille, choix de
  taille, étapes du formulaire, confirmation). `MotionConfig reducedMotion="user"`.
- **Ouvert / Fermé** : calculé dans le navigateur à partir des horaires (`useSyncExternalStore`, mis à jour chaque
  minute), avec « Ouvert jusqu'à 19 h 30 », « Ouvre demain à 9 h », et la ligne de livraison qui bascule après 14 h
  en « Livraison demain ».
- **Barres toujours visibles** : ordinateur, barre fixe fine en haut (Commander un bouquet, téléphone, badge) ;
  mobile, barre en bas (Commander · Appeler · Itinéraire), zone sûre iOS respectée.
- **Images** : un même étalonnage appliqué à toutes les photos par script (comme `grade_images.py`), export WebP aux
  tailles utiles, emplacements provisoires neutres (aplat + nom du fichier attendu) en attendant.
- **Formulaires simulés mais branchables** : chaque formulaire passe par une interface (`OrderGateway`,
  `QuoteGateway`, `BookingGateway`, `SubscriptionGateway`) dont la version actuelle est simulée (délai, numéro de
  commande, rien n'est envoyé). Plus tard : Stripe ou SumUp pour le paiement, Resend pour les e-mails, Cal.com ou un
  Google Sheet pour les ateliers, sans changer l'interface.

### Pages et sections

| # | Section | Où | Technique |
|---|---|---|---|
| 1 | Hero | `/` | Section épinglée (≈ 2,5 écrans de défilement), séquence d'images sur canvas, infos visibles dès le premier écran et pendant toute la composition, bouton « Commander ce bouquet » sur la dernière image (préremplit le bouquet signature). Sans animation : photo finale fixe. |
| 2 | La sélection du moment | `/#selection` | 8 bouquets, grille 4×2 (2×4 au téléphone), photos 4:5 identiques. Prix S/M/L en chiffres tabulaires, sélecteur de taille, bouton d'ajout rapide qui préremplit la commande et y amène. Filtres occasion, couleur, budget en boutons bascule, réorganisation animée (Motion `layout`), état vide utile (« Rien sous 30 € en rouge : essayez Joue rose en S à 38 € »). |
| 3 | Nos univers | `/#univers` | 4 grandes entrées photo : Bouquets (vers la sélection), Deuil, Mariages & événements, Ateliers (pages dédiées). Parallaxe douce de la photo dans son cadre. |
| 4 | Les saisons | `/#saisons` | Défilement horizontal épinglé (GSAP `containerAnimation`), fond qui passe d'une couleur de saison à l'autre, et dans chaque panneau la fleur de la saison qui s'ouvre (vraie vidéo en accéléré, pilotée par la position du panneau). Sans animation : 4 blocs empilés. |
| 5 | Commander | `/#commander` | Une seule colonne en 4 étapes : bouquet et taille, retrait ou livraison (quartier → tarif), date et créneau (créneaux passés ou après 14 h grisés, lundi fermé), message pour la carte (compteur de caractères), récapitulatif aligné, confirmation à l'écran avec numéro. |
| 6 | Deuil | `/deuil` | Page sobre : sans parallaxe ni vidéo, téléphone direct en grand en haut, 5 compositions avec prix, livraison au funérarium ou à l'église (nom du lieu, heure de la cérémonie), même tunnel de commande en version deuil. |
| 7 | Mariages & événements | `/mariages-evenements` | Galerie en mosaïque (formats mélangés), visionneuse au clic, demande de devis (date, lieu, nombre d'invités, budget, envies, photo d'inspiration en option). |
| 8 | Ateliers floraux | `/ateliers` | Prochaines dates en liste alignée (date, thème, durée, prix, places restantes), réservation de 1 à n places dans la limite des places, « complet » désactivé. |
| 9 | Abonnement | `/#abonnement` | Particuliers / entreprises en bascule, rythme hebdo ou toutes les deux semaines, taille, prix par livraison calculé, demande d'abonnement simulée. |
| 10 | La fleuriste | `/#fleuriste` | Portrait, 2 phrases à la première personne, 3 producteurs (photo carrée, nom, lieu, distance), photo de la boutique. |
| 11 | Infos et contact | `/#infos` + pied de page | Adresse, horaires détaillés (jour courant mis en évidence), Itinéraire (Google Maps), téléphone cliquable, Instagram, bandeau « Projet concept », lien vers `/mentions-legales` (éditeur Côme Cousin – Vitrine & Co, vitrineetco@gmail.com, hébergeur Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis, comme sur le bistrot). |

---

## Images et vidéos à générer

> **Remplacée par la liste définitive : [medias.md](medias.md).** Celle-ci est gardée pour l'historique.

Tout va dans `source/`, avec ces noms exacts. Je m'occupe ensuite du recadrage, de l'étalonnage commun et de
l'export. Lumière commune à tout le site : **lumière naturelle de fenêtre, venant de la gauche, matinale, douce,
légèrement fraîche, ombres nettes mais légères**. Aucun texte lisible dans les images (les IA déforment les
lettres) ; pas de visages sauf la fleuriste.

### 1. Hero — la composition (vidéo)

Les générateurs tiennent mal 10 secondes de gestes précis : je propose **deux plans** enchaînés, le second démarrant
de la dernière image du premier (image vers vidéo). Je les raccorde par script.

| Fichier | Contenu |
|---|---|
| `hero-composition.mp4` | 16:9, 1920×1080 (ou la plus haute définition possible), 24 i/s, 6–8 s. **Caméra fixe sur pied, aucun mouvement**, à hauteur de poitrine, face au plan de travail. On ne voit que des mains et des avant-bras (manches de lin retroussées, pas de visage, pas de bijoux). Au centre du cadre, une main gauche tient un bouquet vertical qui grandit ; la main droite ajoute une tige à la fois : eucalyptus, renoncule rose poudré, tulipe blanche, rose de jardin pêche, lisianthus blanc, une branche de mimosa ou de graminée. Fond : mur enduit à la chaux blanc légèrement verdâtre, flou. Plan de travail en chêne clair au bas du cadre, quelques tiges coupées dessus. **Le bouquet reste dans le tiers central** (il sera recadré en vertical pour le téléphone). |
| `hero-ruban.mp4` | Même cadre, même lumière, 4–5 s, démarre sur la dernière image du plan 1. Les deux mains nouent un ruban de soie vert sauge autour des tiges, puis se retirent lentement ; le bouquet fini reste tenu par une main, immobile, pendant la dernière seconde. |
| `hero-fin.jpg` | La dernière image en photo, 16:9, 2400 px de large : sert d'affiche et de version sans animation. |
| `hero-fin-portrait.jpg` | Même image recadrée ou regénérée en 4:5 pour le téléphone (optionnel si le recadrage suffit). |

Le bouquet fini est le bouquet signature « Le Coin » : il doit aussi apparaître dans le catalogue (photo 2.1).

### 2. Catalogue — 8 bouquets, décor unique

**Décor identique pour les 8** : bouquet posé debout dans un vase cylindrique en verre transparent, sur une table en
chêne clair blanchi, devant un mur enduit à la chaux blanc légèrement verdâtre, sans aucun autre objet. Lumière de
fenêtre venant de la gauche, ombre douce portée à droite sur le mur. Appareil à hauteur du bouquet, face, focale
50 mm, même distance : le bouquet occupe environ 65 % de la hauteur, marge de 12 % au-dessus, vase coupé à la même
hauteur dans toutes les photos. **4:5, 2000×2500.** Conseil : générer d'abord le n° 1, puis s'en servir d'image de
référence pour les 7 autres afin de verrouiller le décor.

| Fichier | Bouquet | Couleur (filtre) | Occasions | Prix S / M / L |
|---|---|---|---|---|
| `bouquet-le-coin.jpg` | Le Coin : renoncules rose poudré, tulipes blanches, roses pêche, eucalyptus, ruban sauge (celui du hero) | rose | merci, anniversaire | 35 / 50 / 70 € |
| `bouquet-petit-matin.jpg` | Petit matin : lisianthus et renoncules blancs, gypsophile, feuillage vert tendre | blanc | naissance, merci | 32 / 45 / 62 € |
| `bouquet-joue-rose.jpg` | Joue rose : roses framboise, renoncules fuchsia, astrance | rose vif | amour, anniversaire | 38 / 55 / 78 € |
| `bouquet-terre-cuite.jpg` | Terre cuite : roses orange brûlé, dahlias café au lait, graminées rousses | orange | anniversaire, merci | 36 / 52 / 72 € |
| `bouquet-grand-amour.jpg` | Grand amour : roses rouge profond, feuillage sombre, quelques baies | rouge | amour | 45 / 65 / 90 € |
| `bouquet-champ-libre.jpg` | Champ libre : fleurs champêtres mélangées, cosmos, matricaire, scabieuses, très aérien | multicolore | anniversaire, merci | 30 / 44 / 60 € |
| `bouquet-douceur.jpg` | Douceur : rose très pâle, pêche, crème, lisianthus, renoncules pastel | pastel | naissance, amour | 34 / 48 / 66 € |
| `bouquet-feuillages.jpg` | Sous-bois : feuillages, branchages fins, graminées, une seule fleur blanche | vert | merci | 28 / 40 / 55 € |

Budget : moins de 40 €, 40 à 60 €, plus de 60 € (un bouquet correspond si l'une de ses tailles y entre).

### 3. Nos univers — 4 photos

Même lumière que le site. **Bouquets et Ateliers en 5:4, 2500×2000** (les deux grands tirages, en largeur) ; **Deuil et Mariages en 4:5, 2000×2500**.

| Fichier | Sujet et cadrage |
|---|---|
| `univers-bouquets.jpg` | Le comptoir de la boutique vu de face, plusieurs bouquets emballés de papier kraft et de papier de soie rose en attente, plan moyen. |
| `univers-deuil.jpg` | Une gerbe blanche (roses blanches, lys, feuillage argenté) posée sur un banc de pierre clair, lumière très douce et diffuse, rien de funéraire visible. Plan rapproché, calme, beaucoup d'air. |
| `univers-mariages.jpg` | Bouquet de mariée blanc et vert tenu à deux mains devant une robe en lin ivoire, on ne voit ni visage ni épaules, fond extérieur flou lumineux. |
| `univers-ateliers.jpg` | Vue plongeante sur une grande table d'atelier : six paires de mains composent chacune un petit bouquet, sécateurs, ficelle, seaux de fleurs. Aucun visage. |

### 4. Les saisons — 4 photos + 4 éclosions (vidéo)

Photos **4:5, 2000×2500**, natures mortes dans la boutique, seaux en zinc au sol devant le même mur à la chaux,
plan moyen légèrement plongeant.

| Fichier | Sujet |
|---|---|
| `saison-printemps.jpg` | Seaux de tulipes et de renoncules, tons blancs, roses et jaunes. |
| `saison-ete.jpg` | Seaux de pivoines et de roses de jardin, profusion, rose et corail. |
| `saison-automne.jpg` | Seaux de dahlias et de feuillages roux, branches de chêne, tons cuivre. |
| `saison-hiver.jpg` | Branchages nus, amaryllis rouges, branches de sapin, quelques baies, tons rouge et vert sombre. |

Vidéos d'éclosion : **accéléré d'une seule fleur qui s'ouvre**, caméra fixe, fleur centrée, fond uni blanc cassé
(même mur, très flou), **1:1, 1080×1080, 4–6 s**, du bouton fermé à la fleur ouverte, sans mouvement de tige.

| Fichier | Fleur |
|---|---|
| `eclosion-tulipe.mp4` | Tulipe rose poudré |
| `eclosion-pivoine.mp4` | Pivoine rose corail |
| `eclosion-dahlia.mp4` | Dahlia café au lait |
| `eclosion-amaryllis.mp4` | Amaryllis rouge |

### 5. Commander

Aucune image nouvelle : le tunnel réutilise les photos du catalogue.

### 6. Deuil — 1 photo d'ouverture + 5 compositions

Décor commun aux 5 compositions : posées sur un socle bas en pierre claire, devant un mur gris-vert très pâle,
lumière diffuse, sans ombre marquée, appareil légèrement plongeant. **4:5, 2000×2500.**

| Fichier | Composition | Prix |
|---|---|---|
| `deuil-ouverture.jpg` | 16:9, 2400 px : quelques roses blanches et une branche d'olivier posées sur un linge de lin, très lumineux, grand vide. | — |
| `deuil-bouquet-blanc.jpg` | Bouquet rond blanc et vert | 60 € |
| `deuil-coussin.jpg` | Coussin de roses blanches et rose pâle | 120 € |
| `deuil-gerbe.jpg` | Gerbe longue, roses et lys blancs, feuillage argenté | 150 € |
| `deuil-couronne.jpg` | Couronne de fleurs blanches et vertes sur trépied | 220 € |
| `deuil-dessus-cercueil.jpg` | Composition longue et basse, blanc et vert tendre, vue de trois quarts | 260 € |

### 7. Mariages & événements — 6 photos

| Fichier | Format | Sujet |
|---|---|---|
| `mariage-arche.jpg` | 3:2, 2400 px | Arche fleurie blanche et verte dans un jardin, sans personne. |
| `mariage-bouquet.jpg` | 4:5 | Bouquet de mariée cascade, gros plan, mains seules. |
| `mariage-table.jpg` | 3:2 | Longue table de banquet en bois, chemin de fleurs basses, bougies, lumière de fin de journée. |
| `mariage-boutonniere.jpg` | 1:1 | Boutonnière sur un revers de veste en lin sauge, très gros plan. |
| `evenement-accueil.jpg` | 4:5 | Grande composition sur un comptoir d'accueil d'entreprise lumineux, sans logo. |
| `mariage-ceremonie.jpg` | 4:5 | Allée de cérémonie bordée de bouquets dans des seaux, chaises en bois, sans invités. |

### 8. Ateliers — 3 photos

**4:5, 2000×2500**, sur la même table d'atelier que `univers-ateliers.jpg`.

| Fichier | Thème |
|---|---|
| `atelier-couronne.jpg` | Couronne de l'Avent en cours : sapin, eucalyptus, pommes de pin, mains seules. |
| `atelier-champetre.jpg` | Bouquet champêtre noué main, presque terminé. |
| `atelier-centre-de-table.jpg` | Centre de table bas dans une coupe en terre cuite. |

### 9. Abonnement — 2 photos

| Fichier | Format | Sujet |
|---|---|---|
| `abonnement-maison.jpg` | 4:5 | Bouquet du « Coin » dans un pichet, sur une table de cuisine en bois, lumière du matin, tasse de café floue au premier plan. |
| `abonnement-entreprise.jpg` | 4:5 | Grand bouquet de saison sur le comptoir d'un petit bureau lumineux ou d'un café, sans logo. |

### 10. La fleuriste — 5 photos

| Fichier | Format | Sujet |
|---|---|---|
| `fleuriste-portrait.jpg` | 4:5 | La fleuriste, la trentaine, tablier de lin, au travail derrière son plan de travail, regard sur ses fleurs (pas vers l'objectif), plan taille. Visage naturel, sans maquillage marqué. |
| `boutique-interieur.jpg` | 16:9, 2400 px | Intérieur de la boutique, seaux en zinc, plantes suspendues, comptoir en chêne, lumière de vitrine. |
| `producteur-serre.jpg` | 1:1 | Serre de renoncules en Île-de-France, rangs de fleurs, lumière dorée, sans personne. |
| `producteur-champ.jpg` | 1:1 | Champ de dahlias, mains qui coupent une tige au sécateur. |
| `producteur-verger.jpg` | 1:1 | Branchages et feuillages fraîchement coupés en botte dans une brouette, campagne. |

### 11. Infos et contact — 1 photo

| Fichier | Format | Sujet |
|---|---|---|
| `boutique-facade.jpg` | 3:2, 2400 px | Façade de la boutique, devanture peinte vert sauge, seaux de fleurs sur le trottoir, rue parisienne calme, matin. **Enseigne sans texte lisible** (je poserai le nom en HTML si besoin). |

### Selon la direction choisie

| Fichier | Direction | Sujet |
|---|---|---|
| `lumiere-feuillage.mp4` | A | Ombres de feuillage mouvant sur un mur blanc uni, légère brise, 16:9, 1920×1080, 10 s, **bouclable** (même image au début et à la fin), caméra fixe. |
| `detoure-renoncule.png`, `detoure-tulipe.png`, `detoure-pivoine.png`, `detoure-dahlia.png`, `detoure-eucalyptus.png`, `detoure-amaryllis.png` | B | Une fleur seule, tige courte, **fond transparent** (ou fond uni à détourer), 1:1, 2000×2000, lumière de la gauche. |

**Total** : 3 vidéos (A) ou 2 vidéos + 6 détourages (B), 4 éclosions, 41 photos.

---

## Questions ouvertes

1. Direction A ou B (ou A avec un élément de B) ?
2. Quartier : Paris 12e, avec livraison 12e (8 €), 11e et 20e (10 €), Vincennes et Saint-Mandé (12 €) ?
3. Un prénom pour la fleuriste ?
