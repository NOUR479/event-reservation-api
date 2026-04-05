# Event Reservation

Application Symfony de reservation d'evenements avec authentification JWT, espace utilisateur, espace administrateur et gestion des reservations.

## Apercu

Ce projet permet de :

- creer un compte utilisateur ou administrateur
- se connecter avec email et mot de passe
- afficher un dashboard adapte au role
- consulter les evenements disponibles
- reserver un evenement
- consulter et supprimer ses propres reservations
- administrer les evenements
- consulter les reservations cote admin

Le projet utilise Symfony 7.4, Doctrine ORM, MySQL, Twig, Asset Mapper, Lexik JWT Authentication et Mailpit pour les emails en local.

## Fonctionnalites

### Cote utilisateur

- inscription avec choix de role depuis l'accueil
- connexion JWT
- affichage d'un dashboard utilisateur
- consultation des evenements sous forme de cartes
- bouton `Reserver` sur chaque evenement
- consultation de ses reservations
- suppression d'une reservation personnelle

### Cote administrateur

- inscription admin
- dashboard admin
- ajout d'un evenement
- modification d'un evenement
- suppression d'un evenement
- consultation de toutes les reservations

### Technique

- API REST protegee par JWT
- roles `ROLE_USER` et `ROLE_ADMIN`
- templates Twig pour l'interface
- Docker Compose pour PHP, Nginx, MySQL et Mailpit
- bundle WebAuthn installe pour une future evolution passkeys

## Stack technique

- PHP 8.2+
- Symfony 7.4
- Doctrine ORM
- MySQL 8
- Twig
- Symfony Asset Mapper
- Lexik JWT Authentication Bundle
- Nelmio Cors Bundle
- Mailer Symfony
- Docker / Docker Compose

## Structure utile

```text
src/
  Controller/
  Entity/
  Form/
  Repository/

templates/
  admin/
  auth/
  event/
  home/
  reservation/

assets/
  app.js
  styles/
```

## Installation locale

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd MiniProjet-EventReservation
```

### 2. Installer les dependances

```bash
composer install
```

### 3. Configurer l'environnement

Le projet utilise par defaut :

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/event_db?serverVersion=8.0"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=123456
MAILER_DSN=smtp://localhost:1025
```

Adaptez `.env` ou `.env.local` selon votre machine.

### 4. Creer la base de donnees

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 5. Lancer le serveur Symfony

```bash
symfony server:start
```

Ou avec PHP :

```bash
php -S 127.0.0.1:8000 -t public
```

## Lancement avec Docker

Le projet contient un `docker-compose.yml` avec :

- `php`
- `nginx`
- `db`
- `mailer` via Mailpit

### Demarrer les services

```bash
docker compose up -d
```

### Acces utiles

- application : `http://localhost:8080`
- Mailpit : `http://localhost:8025`
- MySQL : port `3307`

## Authentification et roles

Deux roles principaux sont geres :

- `ROLE_USER`
- `ROLE_ADMIN`

L'inscription utilisateur utilise :

- `POST /api/register`

L'inscription administrateur utilise :

- `POST /api/registerAdmin`

La connexion JWT utilise :

- `POST /api/login_check`

Une fois connecte, le token JWT est utilise pour acceder aux endpoints proteges.

## Endpoints principaux

### Auth

- `POST /api/register`
- `POST /api/registerAdmin`
- `POST /api/login_check`

### Evenements

- `GET /api/events` : liste des evenements pour utilisateur connecte
- `POST /api/events` : creation d'un evenement par l'admin
- `PUT /api/events/{id}` : modification d'un evenement par l'admin
- `DELETE /api/events/{id}` : suppression d'un evenement par l'admin

### Reservations

- `POST /api/reservations` : reserver un evenement
- `GET /api/reservations/my` : afficher les reservations de l'utilisateur connecte
- `DELETE /api/reservations/my/{id}` : supprimer sa reservation
- `GET /api/reservations` : afficher toutes les reservations cote admin

## Interfaces disponibles

### Accueil

L'accueil permet :

- de s'inscrire
- de se connecter
- d'afficher un dashboard utilisateur ou admin apres connexion

### Dashboard utilisateur

- voir ses reservations
- voir les evenements
- reserver un evenement
- supprimer sa reservation

### Dashboard admin

- voir les evenements
- ajouter un evenement
- modifier un evenement
- supprimer un evenement
- consulter les reservations

## Email

Lorsqu'une reservation est creee, un email de confirmation est envoye via le composant Mailer.

En local, vous pouvez consulter les emails avec Mailpit :

- `http://localhost:8025`

## Formulaires Symfony

Des `FormType` sont presents dans `src/Form` :

- `EventType`
- `RegistrationFormType`
- `ReservationType`

Ils preparent la structure pour une integration plus poussee avec des formulaires Symfony classiques.

## Passkeys / WebAuthn

Le bundle WebAuthn est deja installe dans le projet :

- `web-auth/webauthn-symfony-bundle`

L'integration complete des passkeys n'est pas encore finalisee, mais la base technique est deja presente pour une evolution future.

## Verification rapide

Quelques commandes utiles :

```bash
php -l src/Controller/AuthController.php
php -l src/Controller/EventController.php
php -l src/Controller/ReservationController.php
php -l src/Controller/AdminController.php
```

## Ameliorations possibles

- finaliser l'integration passkeys
- ajouter la validation avancee des formulaires
- ajouter des tests fonctionnels
- ajouter la pagination et la recherche d'evenements
- enrichir les dashboards avec statistiques et filtres
- gerer l'upload d'image pour les evenements

## Auteurs

Projet Symfony de reservation d'evenements realise dans un cadre d'apprentissage / mini projet.
