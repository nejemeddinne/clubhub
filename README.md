<<<<<<< HEAD
# ClubHub

## TP2

### Fonctionnalités réalisées

- Recherche insensible à la casse et aux accents, filtre par club, compteur de résultats et message quand aucun événement ne correspond.
- Validation complète du formulaire d'inscription, messages immédiats, focus du premier champ invalide et attribut `aria-invalid`.
- Compteur de caractères de la motivation avec indication à partir de 90 % de la limite.
- Mode sombre persistant sur toutes les pages, tri par date ou par nombre de places.
- Défi favoris : les étoiles et la case « Seulement mes favoris » utilisent `localStorage`.
- Défi cartes générées : les cinq cartes sont créées depuis le tableau `events` dans `js/app.js`. C'est une étape vers le serveur, car les données pourront ensuite venir d'une API sans modifier la structure HTML.
- Défi accents : la recherche utilise `normalize('NFD')`, donc « echecs » trouve « Échecs ».
- Défi pas de flash : un petit script dans le `<head>` applique le thème mémorisé avant le chargement du CSS, ce qui évite l'affichage temporaire du thème clair.

### Erreur de console rencontrée

Au début, le script tentait d'ajouter des écouteurs à des éléments absents des pages qui ne contiennent pas de formulaire ou de liste d'événements. Cela provoquait une erreur `Cannot read properties of null`. J'ai corrigé le problème en testant la présence de chaque conteneur avant d'initialiser sa fonctionnalité (`if (!form) return` et `if (!list) return`).
=======
nejemeddinne mehedbi
>>>>>>> 20bb22cdd2618ccd1ff146f2d1c129ab536f0731
