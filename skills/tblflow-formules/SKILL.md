---
name: tblflow-formules
description: >-
  Écrire et corriger des formules de champs TblFlow : calculs, textes, dates, conditions, listes.
  À utiliser pour « calcule le total », « concatène nom et prénom », « nombre de jours entre… »,
  « si… alors… », « ma formule renvoie une erreur ».
---

# Formules TblFlow

Une formule est un champ de type `formula` créé avec `create_field` :
`{ "name": "Total", "type": "formula", "options": { "expression": "{Prix} * {Quantité}" } }`.

## Syntaxe

- Un champ se cite **par son nom entre accolades** : `{Date de livraison}`. Le nom doit être exact
  (majuscules, accents, espaces) : le relire avec `describe_base`.
- Texte entre apostrophes : `'texte'`. Opérateurs : `+ - * /`, comparaisons, `&` pour concaténer
  si le serveur l'accepte, sinon `CONCATENATE(...)`.
- Les fonctions s'écrivent en majuscules ; la liste complète, par famille, est dans
  [references/fonctions.md](references/fonctions.md), **générée depuis le code de TblFlow**.
  N'employer que ces fonctions : une fonction d'un autre outil (autre tableur) n'existe peut-être pas.

## Recettes

- Condition : `IF({Montant} > 1000, 'Grand compte', 'Standard')` ; plusieurs cas : `SWITCH(...)`.
- Champ vide : `IF(IS_BLANK({Date}), '', ...)`, ou `IF_BLANK({Remise}, 0)`.
- Texte : `CONCATENATE({Prénom}, ' ', {Nom})`, `UPPER`, `LEFT`, `TRIM`, `SUBSTITUTE`.
- Arrondi : `ROUND({Total} * 1.2, 2)`.
- Dates : `DATETIME_DIFF`, `DATE_ADD`, `TODAY()`, `YEAR`, `DATETIME_FORMAT`. Vérifier l'ordre des
  arguments dans la référence du serveur avant de livrer un calcul de dates.
- Listes issues d'une liaison : `ARRAY_JOIN`, `ARRAY_UNIQUE`, `ARRAY_LENGTH`. Pour un total sur les
  lignes liées, préférer un champ de **cumul** (`rollup`) à une formule.

## Méthode

1. Écrire la formule, la **tester sur une ligne** : créer le champ, puis `get_record` pour lire le
   résultat, comparer à un calcul fait à la main sur 2 ou 3 lignes (dont une avec champ vide).
2. Si le résultat est une erreur : champ renommé, type inattendu (texte au lieu de nombre : `VALUE()`),
   champ vide non géré, fonction qui n'existe pas.
3. Une formule est calculée par le serveur : ne jamais écrire de valeur dans ce champ.
4. Changer une formule existante n'est pas possible depuis le connecteur (pas de modification des
   options) : créer un nouveau champ, comparer, puis proposer de supprimer l'ancien (aperçu, accord).
