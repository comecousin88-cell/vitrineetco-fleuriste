# La Fleur du Coin — liste définitive des images et vidéos

Cette liste remplace celle de `proposition.md`. Tous les fichiers vont dans `source/`, avec ces noms exacts.
Je m'occupe ensuite du recadrage, de l'étalonnage commun et de l'export WebP dans `public/`.

## Règles communes à tout le site

- **Lumière** : lumière naturelle de fenêtre, venant de la gauche, matinale, douce et légèrement fraîche
  (balance des blancs vers 5200 K). Ombres nettes mais légères. Jamais de flash ni de lumière de studio visible.
- **Palette du décor** : blanc de chaux légèrement vert, chêne clair, zinc, lin. Pas de couleurs vives hors des fleurs.
- **Aucun texte lisible** dans les images (enseignes, étiquettes, cartes, écrans) : les générateurs déforment les
  lettres. Une carte manuscrite peut apparaître si l'écriture est floue ou hors de la mise au point.
- **Personnes** : des mains et des silhouettes de dos, jamais de visage, sauf le portrait de la fleuriste.
  Pas de bijoux voyants, manches de lin naturel retroussées.
- **Pas de logo, de marque ni d'emballage commercial reconnaissable.**
- Les tailles indiquées sont des minimums. Plus grand est toujours mieux.

## Le décor du catalogue (identique pour les 8 bouquets et la photo des tailles)

À reproduire à l'identique sur chaque image. Conseil : générer d'abord `bouquet-le-coin.jpg`, puis s'en servir
comme image de référence pour toutes les autres.

| Élément | Consigne |
|---|---|
| Mur | Enduit à la chaux, blanc légèrement vert-gris (proche de #E9ECE4), texture fine et mate, sans joint ni objet. Il occupe tout le fond. |
| Table | Plateau en chêne clair blanchi, fil du bois horizontal, bord avant net et parallèle au cadre. Le bord de la table est à 82 % de la hauteur de l'image ; on voit le plateau sur les 18 % du bas. |
| Vase | Cylindre droit en verre transparent, 25 cm de haut, 12 cm de diamètre, eau claire, tiges visibles. Posé au centre, sa base à 88 % de la hauteur de l'image. |
| Lumière | Fenêtre à gauche, hors champ, lumière du matin diffuse. Ombre douce du bouquet portée sur le mur à droite, toujours au même angle (environ 30°). |
| Appareil | À hauteur du milieu du bouquet, face, objectif 50 mm, profondeur de champ moyenne (mur légèrement flou, bouquet entièrement net). |
| Cadrage | 4:5, bouquet centré. Le haut du bouquet commence à 12 % du haut de l'image. Même distance pour tous : le vase a toujours la même taille à l'écran. |
| Interdits | Aucun autre objet : pas de ciseaux, de ruban, de feuille tombée, de livre, de bougie. |

## La vidéo du hero

Les générateurs tiennent mal un long geste précis : deux plans enchaînés, le second démarrant exactement sur la
dernière image du premier (image vers vidéo). Je les raccorde et je les découpe en images pour le défilement.

| | Consigne |
|---|---|
| Durée totale | 10 à 12 s : plan 1 de 7 à 8 s, plan 2 de 4 à 5 s. Je n'en garde qu'une partie si besoin. |
| Format | 16:9, 1920×1080 minimum (2560×1440 ou 4K si possible), 24 images par seconde. |
| Caméra | Fixe, sur pied, **aucun mouvement, aucun zoom**. À hauteur de poitrine, face au plan de travail. |
| Cadrage | On voit les avant-bras et les mains, jamais le visage ni les épaules. Le bouquet reste toujours dans le tiers central du cadre : il sera recadré en vertical pour le téléphone. |
| Décor | Le même mur à la chaux, flou ; plan de travail en chêne clair dans le bas du cadre. |
| Image de début | Au centre, une main gauche tient verticalement trois tiges d'eucalyptus. La main droite entre par la droite avec une renoncule rose poudré. Sur la table : quelques tiges coupées, un sécateur, une bobine de ruban de soie vert sauge. |
| Déroulé (plan 1) | La main droite ajoute une tige à la fois, en tournant légèrement le bouquet : renoncules rose poudré, tulipes blanches, roses de jardin pêche, lisianthus blanc, une branche fine de graminée. Gestes lents et réguliers. |
| Déroulé (plan 2) | Les deux mains nouent le ruban vert sauge autour des tiges, puis la main droite se retire lentement hors du cadre. |
| Image de fin | Le bouquet « Le Coin » terminé, tenu par la seule main gauche au centre, ruban noué (nœud simple, deux pans qui tombent). Tout est immobile pendant la dernière seconde. C'est le même bouquet que `bouquet-le-coin.jpg`. |

---

## Indispensables

Sans ces fichiers, le site paraît inachevé.

### Hero

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `hero-composition.mp4` | Plan 1 de la vidéo, décrit ci-dessus. | 16:9, 1920×1080, 24 i/s, 7–8 s |
| `hero-ruban.mp4` | Plan 2 de la vidéo, décrit ci-dessus. | 16:9, 1920×1080, 24 i/s, 4–5 s |
| `hero-fin.jpg` | L'image de fin en photo haute définition : bouquet fini tenu par une main, ruban noué. Sert d'affiche, de version sans animation et d'image de partage. | 16:9, 2560×1440 |

### La sélection du moment (décor du catalogue)

| Fichier | Bouquet | Format, taille min. |
|---|---|---|
| `bouquet-le-coin.jpg` | Le Coin : renoncules rose poudré, tulipes blanches, roses pêche, eucalyptus, ruban sauge. Le bouquet du hero. | 4:5, 2000×2500 |
| `bouquet-petit-matin.jpg` | Petit matin : lisianthus et renoncules blancs, gypsophile, feuillage vert tendre. | 4:5, 2000×2500 |
| `bouquet-joue-rose.jpg` | Joue rose : roses framboise, renoncules fuchsia, astrance. | 4:5, 2000×2500 |
| `bouquet-terre-cuite.jpg` | Terre cuite : roses orange brûlé, dahlias café au lait, graminées rousses. | 4:5, 2000×2500 |
| `bouquet-grand-amour.jpg` | Grand amour : roses rouge profond, feuillage sombre, quelques baies. | 4:5, 2000×2500 |
| `bouquet-champ-libre.jpg` | Champ libre : cosmos, matricaire, scabieuses, fleurs des champs, très aérien. | 4:5, 2000×2500 |
| `bouquet-douceur.jpg` | Douceur : lisianthus, renoncules pastel, roses crème et pêche. | 4:5, 2000×2500 |
| `bouquet-sous-bois.jpg` | Sous-bois : feuillages, branchages fins, graminées, une seule fleur blanche. | 4:5, 2000×2500 |

### Nos univers

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `univers-bouquets.jpg` | Le comptoir en chêne de la boutique, vu de face en plan moyen : quatre ou cinq bouquets emballés de kraft et de papier de soie rose, prêts à partir. | 5:4, 2500×2000 |
| `univers-deuil.jpg` | Une gerbe de roses blanches et de feuillage argenté posée sur un banc de pierre claire, lumière très douce et diffuse, beaucoup d'air autour. Rien de funéraire visible. | 4:5, 2000×2500 |
| `univers-mariages.jpg` | Un bouquet de mariée blanc et vert tenu à deux mains devant une robe en lin ivoire, cadré à la taille, sans visage ni épaules. Fond extérieur clair et flou. | 4:5, 2000×2500 |
| `univers-ateliers.jpg` | Vue plongeante sur une grande table d'atelier : six paires de mains composent chacune un petit bouquet, sécateurs, ficelle, seaux de fleurs. Aucun visage. | 5:4, 2500×2000 |

### Les saisons

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `saison-printemps.jpg` | Seaux en zinc au sol devant le mur à la chaux, remplis de tulipes et de renoncules blanches, roses et jaunes. Plan moyen légèrement plongeant. | 4:5, 2000×2500 |
| `saison-ete.jpg` | Même cadrage : pivoines et roses de jardin rose et corail, en profusion. | 4:5, 2000×2500 |
| `saison-automne.jpg` | Même cadrage : dahlias cuivrés et café au lait, feuillages roux, branches de chêne. | 4:5, 2000×2500 |
| `saison-hiver.jpg` | Même cadrage : branchages nus, amaryllis rouges, branches de sapin, quelques baies. | 4:5, 2000×2500 |
| `eclosion-tulipe.mp4` | Accéléré d'une seule tulipe rose poudré qui s'ouvre, du bouton fermé à la fleur ouverte. Caméra fixe, fleur centrée, tige immobile, fond blanc cassé uni et flou. | 1:1, 1080×1080, 4–6 s |
| `eclosion-pivoine.mp4` | Même principe : une pivoine rose corail. | 1:1, 1080×1080, 4–6 s |
| `eclosion-dahlia.mp4` | Même principe : un dahlia café au lait. | 1:1, 1080×1080, 4–6 s |
| `eclosion-amaryllis.mp4` | Même principe : une amaryllis rouge. | 1:1, 1080×1080, 4–6 s |

### Deuil

Décor commun aux cinq compositions : posées sur un socle bas en pierre claire, devant un mur gris-vert très
pâle, lumière diffuse sans ombre marquée, appareil légèrement plongeant, même distance pour toutes.

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `deuil-ouverture.jpg` | Quelques roses blanches et une branche d'olivier posées sur un linge de lin blanc, très lumineux, grand vide sur la gauche pour respirer. | 16:9, 2560×1440 |
| `deuil-bouquet-blanc.jpg` | Bouquet rond blanc et vert. | 4:5, 2000×2500 |
| `deuil-coussin.jpg` | Coussin de roses blanches et rose pâle. | 4:5, 2000×2500 |
| `deuil-gerbe.jpg` | Gerbe longue de roses et de lys blancs, feuillage argenté, vue de trois quarts. | 4:5, 2000×2500 |
| `deuil-couronne.jpg` | Couronne de fleurs blanches et vertes sur un trépied en bois clair. | 4:5, 2000×2500 |
| `deuil-dessus-cercueil.jpg` | Composition longue et basse, blanc et vert tendre, vue de trois quarts. | 4:5, 2000×2500 |

### Mariages & événements

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `mariage-ouverture.jpg` | Une longue table de banquet en bois dans un jardin, chemin de fleurs basses blanches et vertes, bougies, lumière de fin de journée. Sans personne. | 16:9, 2560×1440 |
| `mariage-arche.jpg` | Arche fleurie blanche et verte dans un jardin, sans personne. | 3:2, 2400×1600 |
| `mariage-bouquet.jpg` | Bouquet de mariée en cascade, gros plan, tenu à deux mains. | 4:5, 2000×2500 |
| `mariage-table.jpg` | Détail d'un centre de table bas : fleurs, verres, linge de lin. | 3:2, 2400×1600 |
| `mariage-boutonniere.jpg` | Boutonnière sur le revers d'une veste en lin sauge, très gros plan. | 1:1, 2000×2000 |
| `mariage-ceremonie.jpg` | Allée de cérémonie bordée de bouquets dans des seaux, chaises en bois, sans invités. | 4:5, 2000×2500 |
| `evenement-accueil.jpg` | Grande composition de saison sur le comptoir d'accueil lumineux d'une entreprise, sans logo. | 4:5, 2000×2500 |

### Ateliers floraux

Même grande table en bois que `univers-ateliers.jpg`.

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `ateliers-ouverture.jpg` | La table d'atelier en plan large, vue de côté : six personnes de dos ou cadrées sous les épaules composent, seaux de fleurs au premier plan. | 16:9, 2560×1440 |
| `atelier-couronne.jpg` | Couronne de l'Avent en cours : sapin, eucalyptus, pommes de pin, deux mains. | 4:5, 2000×2500 |
| `atelier-champetre.jpg` | Bouquet champêtre noué main, presque terminé, tenu au-dessus de la table. | 4:5, 2000×2500 |
| `atelier-centre-de-table.jpg` | Centre de table bas dans une coupe en terre cuite, mains qui piquent une dernière tige. | 4:5, 2000×2500 |

### Abonnement

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `abonnement-maison.jpg` | Un bouquet de saison dans un pichet en grès, sur une table de cuisine en bois, lumière du matin, tasse de café floue au premier plan. | 4:5, 2000×2500 |
| `abonnement-entreprise.jpg` | Grand bouquet de saison sur le comptoir d'un petit bureau ou d'un café lumineux, sans logo ni personne. | 4:5, 2000×2500 |

### La fleuriste

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `fleuriste-portrait.jpg` | Louise, la trentaine, tablier de lin, cheveux attachés simplement, au travail derrière son plan de travail. Regard sur ses fleurs, pas vers l'objectif. Plan taille. Visage naturel. | 4:5, 2000×2500 |
| `boutique-interieur.jpg` | L'intérieur de la boutique : seaux en zinc, plantes suspendues, comptoir en chêne, lumière de vitrine. Sans personne. | 16:9, 2560×1440 |
| `producteur-serre.jpg` | Une serre de renoncules en Île-de-France, rangs de fleurs, lumière dorée, sans personne. | 1:1, 1600×1600 |
| `producteur-champ.jpg` | Un champ de dahlias, deux mains coupent une tige au sécateur. | 1:1, 1600×1600 |
| `producteur-verger.jpg` | Branchages et feuillages fraîchement coupés, en botte dans une brouette, campagne. | 1:1, 1600×1600 |

### Infos et contact

| Fichier | Sujet et cadrage | Format, taille min. |
|---|---|---|
| `boutique-facade.jpg` | La façade de la boutique : devanture peinte vert sauge, seaux de fleurs sur le trottoir, rue parisienne calme le matin. Enseigne sans texte lisible. | 3:2, 2400×1600 |

---

## Secondaires

Le site fonctionne sans eux, mais ils le rendent plus vivant et plus crédible.

| Fichier | Section | Sujet et cadrage | Format, taille min. |
|---|---|---|---|
| `lumiere-feuillage.mp4` | Tout le site (signature de la direction A) | Ombres de feuillage qui bougent doucement sur un mur blanc uni, légère brise. Caméra fixe. **Bouclable** : même image au début et à la fin. | 16:9, 1920×1080, 10 s |
| `hero-fin-portrait.jpg` | Hero, sur téléphone | La même image de fin, recadrée ou regénérée en vertical, bouquet centré. | 4:5, 2000×2500 |
| `tailles-le-coin.jpg` | Sélection du moment | Le bouquet Le Coin en trois tailles côte à côte (S, M, L), dans le décor du catalogue, trois vases identiques. Montre ce que représente chaque taille. | 16:9, 2560×1440 |
| `bouquet-le-coin-detail.jpg` à `bouquet-sous-bois-detail.jpg` (8 fichiers) | Sélection du moment, au survol | Gros plan de chaque bouquet dans le même décor : le cœur des fleurs, quelques pétales nets, le reste flou. | 4:5, 2000×2500 |
| `commande-emballage.jpg` | Commander | Deux mains emballent un bouquet dans du kraft et du papier de soie rose sur le comptoir. | 4:5, 2000×2500 |
| `commande-carte.jpg` | Commander, étape « La carte » | Une petite carte en papier ensemencé glissée dans un bouquet, écriture à la plume floue et illisible. | 1:1, 1600×1600 |
| `commande-livraison.jpg` | Commander, confirmation | Un bouquet emballé tendu à bout de bras devant une porte d'immeuble parisien, on ne voit que les mains et les avant-bras. | 4:5, 2000×2500 |
| `deuil-livraison.jpg` | Deuil, livraison | Une couronne blanche posée sur son trépied devant l'entrée en pierre d'une chapelle, sans personne, lumière grise et douce. | 3:2, 2400×1600 |
| `mariage-couronne-cheveux.jpg` | Mariages, galerie | Une couronne de fleurs fraîches dans des cheveux attachés, vue de dos. | 4:5, 2000×2500 |
| `mariage-centre-de-table.jpg` | Mariages, galerie | Centre de table haut dans un vase en verre, sur une nappe en lin, lumière de bougies. | 4:5, 2000×2500 |
| `evenement-vitrine.jpg` | Mariages, galerie | Une vitrine de boutique décorée de fleurs pour un lancement, vue de la rue, sans texte lisible. | 3:2, 2400×1600 |
| `atelier-mains.jpg` | Ateliers | Très gros plan de mains qui nouent la ficelle d'un bouquet. | 1:1, 1600×1600 |
| `atelier-sec.jpg` | Ateliers | Un bouquet de fleurs séchées (atelier d'automne) posé sur la table d'atelier. | 4:5, 2000×2500 |
| `abonnement-livraison.jpg` | Abonnement | Un bouquet de saison emballé, posé sur un paillasson devant une porte, le matin. | 4:5, 2000×2500 |
| `fleuriste-mains.jpg` | La fleuriste | Les mains de Louise qui effeuillent une tige au-dessus d'un seau, très gros plan. | 1:1, 1600×1600 |
| `boutique-ambiance.mp4` | La fleuriste | Plan fixe de l'intérieur de la boutique, la lumière bouge lentement sur les seaux. Bouclable. | 16:9, 1920×1080, 6–8 s |
| `boutique-vitrine.jpg` | Infos et contact | Détail de la vitrine depuis la rue : bouquets derrière la vitre, reflets légers de la rue. | 4:5, 2000×2500 |

## Récapitulatif

- **Indispensables** : 2 vidéos du hero, 4 vidéos d'éclosion, 42 photos.
- **Secondaires** : 2 vidéos d'ambiance, 22 photos (dont les 8 gros plans du catalogue).
- L'image de partage pour les réseaux (1200×630) sera tirée de `hero-fin.jpg` : rien à générer.

---

## État au 10 novembre 2026

Préparation : `python scripts/prepare_images.py` (photos) et `python scripts/prepare_hero.py` (vidéo du hero).
Les deux scripts relisent `source/` à chaque lancement : déposer un fichier sous son nom et relancer suffit.

**Intégrés** : la vidéo du hero (`hero-composition.mp4`, 80 images par série) et sa dernière image comme affiche,
les 8 bouquets, les 4 univers, les 6 photos Deuil, 7 photos Mariages, 4 photos Ateliers, `boutique-interieur`.

**Encore attendus** (emplacements provisoires) : `hero-ruban.mp4` et le nouveau `hero-fin.jpg`, la nouvelle version
de `bouquet-le-coin.jpg`, les 4 saisons et les 4 éclosions, `fleuriste-portrait`, `boutique-facade`,
`abonnement-maison`, `abonnement-entreprise`, les 3 producteurs. Secondaires : `atelier-sec` (emplacement sur la
page Ateliers), et les 3 photos de galerie, qui n'apparaissent qu'une fois fournies.

**Non utilisés** : `hero-debut.jpeg` et l'ancien `hero-fin.jpeg` (bouquet différent de la vidéo).

**Remarques de relecture** (aucun texte lisible, mains réalistes partout) :
- `hero-composition.mp4` est en 1280×720 : en dessous du 1920×1080 prévu. Sur grand écran, l'image est agrandie.
- `deuil-coussin` (sur une dalle basse) et `deuil-couronne` (trépied posé sur un bloc) s'écartent du socle commun
  des trois autres compositions Deuil. À refaire si possible sur le même socle.
- `ateliers-ouverture` montre des visages de profil, petits, alors que la consigne était « aucun visage ».
- `mariage-arche`, `mariage-ceremonie` et `mariage-table` sont en 16:9 au lieu de 3:2 et 4:5 : la galerie suit leur
  format réel, rien à refaire.
