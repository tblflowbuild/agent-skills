---
name: tblflow-filtres-vues
description: >-
  Écrire les filtres, recherches et tris des outils TblFlow (list_records, aggregate_records) et lire
  les vues existantes (list_views). À utiliser pour « retrouve les… dont… », « les lignes où… »,
  « trie par… », « quelles vues existent ».
---

# Filtres, tri et vues

## Filtre (`list_records`, `aggregate_records`)

```json
{
  "conjunction": "and",
  "conditions": [
    { "field": "Statut", "operator": "is", "value": "En cours" },
    { "field": "Montant", "operator": "isGreaterEqual", "value": 1000 }
  ]
}
```

- `field` : nom exact (ou id) du champ, pris dans `describe_base`.
- `conjunction` : `and` (toutes les conditions) ou `or` (au moins une). 20 conditions au plus.
  Pas de groupes imbriqués : pour un « et » combiné à un « ou », faire deux appels.
- Opérateurs : `is`, `isNot`, `contains`, `doesNotContain`, `isGreater`, `isGreaterEqual`, `isLess`,
  `isLessEqual`, `isEmpty`, `isNotEmpty`, `isAnyOf`, `isNoneOf`.
- `isEmpty` / `isNotEmpty` n'ont pas de `value`. `isAnyOf` / `isNoneOf` prennent une liste de choix.
- Les opérateurs acceptés dépendent du type de champ (texte : `contains`; nombre : comparaisons ;
  sélection : `is`, `isAnyOf`…). En cas d'erreur, lire le message, ne pas essayer au hasard.
- Dates : fournir la valeur au format que renvoie la lecture ; en cas de doute, lire une ligne et
  copier son format.

## Recherche texte

`search` + `searchField` (facultatif : tous les champs sinon) garde les lignes qui contiennent le
texte. Utile pour retrouver un nom ; pour un critère précis, préférer un filtre.

## Tri et pagination

`sort` : jusqu'à 5 `{ field, order: "asc" | "desc" }`. `take` ≤ 100, `skip` pour la page suivante.
Continuer tant que le nombre de lignes renvoyées égale `take`.

## Vues

`list_views` renvoie, par table, id, nom, type et le nombre de filtres, tris et regroupements.
C'est **en lecture seule** : le connecteur ne crée ni ne modifie de vues. Pour qu'une vue soit
créée, indiquer à l'utilisateur la configuration à reproduire dans l'interface (filtre, tri,
regroupement, champs visibles).

Les filtres d'une vue ne sont pas appliqués automatiquement par `list_records` : si l'utilisateur
dit « dans la vue À faire », demander ou déduire ses conditions et les passer explicitement.
