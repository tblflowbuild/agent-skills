---
name: tblflow-champs-et-liens
description: >-
  Choisir le bon type de champ TblFlow et créer ou renommer des champs : texte, nombre, date,
  sélection, case à cocher, liaison entre tables, formule, cumul. À utiliser pour « ajoute une
  colonne… », « relie ces deux tables », « quel type pour… », « renomme ce champ ».
---

# Champs et liaisons

Outils : `describe_base` (lire), `create_field` (ajouter), `update_field` (renommer ou décrire),
`delete_field` (aperçu puis `confirm`, corbeille restaurable). **Le connecteur ne change ni le type
ni les options d'un champ existant** : pour changer de type, créer un nouveau champ, recopier les
valeurs, puis (après accord) supprimer l'ancien.

## Types disponibles (`type`)

| Besoin | Type |
|---|---|
| Nom, titre, référence courte | `singleLineText` |
| Description, notes | `longText` |
| Quantité, montant, pourcentage | `number` |
| Date ou date-heure | `date` |
| Durée | `duration` |
| Un choix dans une liste (statut, catégorie) | `singleSelect` |
| Plusieurs choix (étiquettes) | `multipleSelect` |
| Oui / non | `checkbox` |
| Note de 1 à 5 | `rating` |
| Courriel, téléphone, lien | `email`, `phoneNumber`, `url` |
| Personne de l'espace | `user` |
| Fichiers, images | `attachment` |
| Lien vers une autre table | `link` |
| Calcul à partir de la ligne | `formula` (voir `tblflow-formules`) |
| Total, moyenne… sur les lignes liées | `rollup` |
| Numéro séquentiel | `autoNumber` |
| Dates et auteurs automatiques | `createdTime`, `lastModifiedTime`, `createdBy`, `lastModifiedBy` |

D'autres types existent (`button`, `ai`, `canvas`, `conditionalRollup`, `rowId`, `password`) ; ne les
proposer que si l'utilisateur les demande, et vérifier le résultat avec `describe_base`.

## Options (`options`) : formes usuelles

- Sélection : `{ "choices": [{ "name": "À faire" }, { "name": "En cours" }, { "name": "Fini" }] }`.
  Si le serveur exige une couleur par choix, l'ajouter et réessayer.
- Liaison : `{ "relationship": "manyOne", "foreignTableId": "tbl…" }`. Valeurs de `relationship` :
  `manyOne` (beaucoup de lignes d'ici vers une ligne de là-bas : « chaque tâche a un projet »),
  `oneMany` (l'inverse), `manyMany`, `oneOne`.
- Formule : `{ "expression": "{Prix} * {Quantité}" }` (champs entre accolades, par leur nom).

Ces formes viennent du modèle de champs ; **toujours relire le champ créé avec `describe_base`**
et corriger si le serveur a normalisé autre chose que prévu.

## Bonnes pratiques

- Le premier champ d'une table est son champ principal : un nom lisible, pas un nombre.
- Une catégorie qui revient souvent est un `singleSelect` ou, mieux si elle porte ses propres
  informations, **une table liée**.
- Ne pas recopier une valeur d'une table dans une autre : créer une liaison, puis un cumul ou une
  formule. Ne pas simuler une liaison avec du texte.
- Nommer les champs comme l'utilisateur parle (« Date de livraison »), sans abréviation.
- Créer les champs un par un et vérifier (`describe_base`) avant d'écrire des données dedans.
- Renommer un champ casse les formules et filtres écrits avec l'ancien nom : prévenir.
