# Event Reservation

Symfony application for event booking with JWT authentication, user space, admin space, and reservation management.

## Overview

This project allows users to:

- create a user or admin account
- log in with email and password
- access a dashboard based on their role
- browse available events
- reserve an event
- view and delete their own reservations
- manage events as an administrator
- review reservations from the admin side

The project uses Symfony 7.4, Doctrine ORM, MySQL, Twig, Asset Mapper, Lexik JWT Authentication, and Mailpit for local email testing.

## Features

### User side

- registration with role selection from the home page
- JWT login
- dedicated user dashboard
- event cards display
- `Reserve` button on each event
- personal reservations list
- reservation deletion

### Admin side

- admin registration
- admin dashboard
- create an event
- update an event
- delete an event
- view all reservations

### Technical features

- JWT-protected REST API
- `ROLE_USER` and `ROLE_ADMIN`
- Twig-based interface
- Docker Compose setup for PHP, Nginx, MySQL, and Mailpit
- WebAuthn bundle already installed for future passkey support

## Tech Stack

- PHP 8.2+
- Symfony 7.4
- Doctrine ORM
- MySQL 8
- Twig
- Symfony Asset Mapper
- Lexik JWT Authentication Bundle
- Nelmio Cors Bundle
- Symfony Mailer
- Docker / Docker Compose

## Useful Structure

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

## Local Installation

### 1. Clone the project

```bash
git clone <repository-url>
cd MiniProjet-EventReservation
```

### 2. Install dependencies

```bash
composer install
```

### 3. Configure the environment

The project currently uses:

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/event_db?serverVersion=8.0"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=123456
MAILER_DSN=smtp://localhost:1025
```

Adjust `.env` or `.env.local` to match your local machine.

### 4. Create the database

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 5. Start the Symfony server

```bash
symfony server:start
```

Or with PHP:

```bash
php -S 127.0.0.1:8000 -t public
```

## Run with Docker

The project includes a `docker-compose.yml` file with:

- `php`
- `nginx`
- `db`
- `mailer` via Mailpit

### Start services

```bash
docker compose up -d
```

### Useful access points

- application: `http://localhost:8080`
- Mailpit: `http://localhost:8025`
- MySQL: port `3307`

## Authentication and Roles

Two main roles are supported:

- `ROLE_USER`
- `ROLE_ADMIN`

User registration endpoint:

- `POST /api/register`

Admin registration endpoint:

- `POST /api/registerAdmin`

JWT login endpoint:

- `POST /api/login_check`

Once logged in, the JWT token is used to access protected endpoints.

## Main Endpoints

### Auth

- `POST /api/register`
- `POST /api/registerAdmin`
- `POST /api/login_check`

### Events

- `GET /api/events`: list events for authenticated users
- `POST /api/events`: create a new event as admin
- `PUT /api/events/{id}`: update an event as admin
- `DELETE /api/events/{id}`: delete an event as admin

### Reservations

- `POST /api/reservations`: reserve an event
- `GET /api/reservations/my`: list the current user's reservations
- `DELETE /api/reservations/my/{id}`: delete one of the current user's reservations
- `GET /api/reservations`: list all reservations as admin

## Available Interfaces

### Home page

The home page allows users to:

- register
- log in
- access either the user dashboard or the admin dashboard after authentication

### User dashboard

- view personal reservations
- view events
- reserve an event
- delete a reservation

### Admin dashboard

- manage events
- add events
- update events
- delete events
- review reservations

## Email

When a reservation is created, a confirmation email is sent through Symfony Mailer.

In local development, emails can be viewed with Mailpit:

- `http://localhost:8025`

## Symfony Forms

The following `FormType` classes are available in `src/Form`:

- `EventType`
- `RegistrationFormType`
- `ReservationType`

These forms provide a base for deeper integration with standard Symfony form workflows.

## Passkeys / WebAuthn

The WebAuthn bundle is already installed:

- `web-auth/webauthn-symfony-bundle`

Full passkey integration is not finished yet, but the technical foundation is already present for future development.

## Quick Checks

Useful validation commands:

```bash
php -l src/Controller/AuthController.php
php -l src/Controller/EventController.php
php -l src/Controller/ReservationController.php
php -l src/Controller/AdminController.php
```

## Authors

Symfony event reservation project created as a learning / mini project.
