---
name: tblflow-base-depuis-un-besoin
description: >-
  Concevoir et créer une base TblFlow à partir d'un besoin métier : suivi de clients, de
  commandes, de projets, de stocks, de recrutements. À utiliser pour « monte-moi un CRM »,
  « crée un suivi de… », « il me faut des tables pour… ».
---

# Construire une base à partir d'un besoin

Outils : `list_workspaces`, `describe_base`, `create_table`, `create_field`, puis
`create_records`. Le connecteur **ajoute** (tables, champs) mais ne supprime rien de lui-même.

## 1. Comprendre avant de créer

Poser au plus trois questions utiles, pas un questionnaire : que suit-on (les « choses »), qui s'en
sert, quelles questions la base doit permettre de répondre (« combien de commandes en retard ? »).
Si le besoin est clair, ne pas poser de question : décider et le dire.

## 2. Proposer le plan, le faire valider

Avant tout appel d'écriture, présenter en quelques lignes :

- les **tables** (une par type de chose : Clients, Commandes, Produits…) ;
- pour chacune, ses **champs** (nom, type) ;
- les **liaisons** (une commande appartient à un client : liaison `manyOne` de Commandes vers
  Clients) ;
- les **calculs** à faire par formule ou cumul plutôt que saisis à la main (total d'une commande,
  nombre de commandes d'un client).

Attendre l'accord. Dire dans quelle base (et quel espace) on crée : `list_workspaces` d'abord ; si
plusieurs bases conviennent, demander laquelle. Ne rien créer dans une base sans la nommer.

## 3. Créer dans le bon ordre

1. Tables **de référence** d'abord (celles vers lesquelles on pointe), avec leurs champs simples.
2. Tables qui pointent vers elles ensuite, avec leurs champs de liaison (`foreignTableId` = id
   renvoyé à la création de la table de référence).
3. Champs calculés en dernier (formule, cumul), quand tous les champs qu'ils utilisent existent.
4. `describe_base` pour **vérifier** que tout correspond au plan.
5. Quelques lignes d'exemple seulement si l'utilisateur le souhaite, clairement identifiables
   (pas de fausses données mêlées à de vraies).

## Garde-fous

- Une table par appel `create_table` ; elle n'est pas idempotente : en cas d'erreur réseau,
  relire `describe_base` avant de réessayer pour ne pas créer un doublon.
- 50 tables et 100 champs au plus par appel.
- Ne pas créer de table « fourre-tout » pour contourner une liaison.
- Pas de modèles de métier imposés : adapter aux mots de l'utilisateur.
- Pour récupérer des données existantes, voir `tblflow-import-csv` ; le CSV peut aussi créer la table.

## Gabarit de plan (exemple)

« Suivi de devis » : Clients (Nom, Courriel, Téléphone) ← Devis (Référence, Date, Statut
`singleSelect`, Client `link`, Montant HT `number`) ; Clients gagne « Nombre de devis » (cumul) et
« Montant total » (cumul de Montant HT) ; Devis gagne « Montant TTC » (formule).
