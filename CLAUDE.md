# AutoDive — Car Marketplace

A car listing marketplace inspired by [GrabaCar](https://grabacar.xyz). Sellers post vehicle listings; buyers browse, filter, and contact sellers. No online payment — contact-based transactions only.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13 (PHP 8.4) |
| Frontend | React 19 + TypeScript + Inertia.js v3 |
| Styling | Tailwind CSS v4 |
| Auth | Laravel Fortify (passkeys + 2FA + email verification) |
| Routes (typed) | Laravel Wayfinder |
| DB | MySQL 8.0 |
| Cache / Sessions | Redis |
| Queue | Redis |
| Dev server | Vite 8 (separate Docker container) |

---

## Docker Architecture

Six containers, all on the `inertia` network:

```
nginx (:8080) → app (PHP-FPM :9000) → db (MySQL :3306)
                                     → redis (:6379)
queue (PHP worker) → redis
vite (:5173) — serves JS assets in dev
```

**Key facts about the Docker setup:**
- `app` and `queue` share the same Dockerfile (`docker/php/Dockerfile`, PHP 8.4-fpm)
- `node_modules` in the `vite` container live in a named Docker volume (`vite_node_modules`) — NOT the Windows mount — because native binaries differ between Windows and Linux
- SSR is **disabled** (`config/inertia.php` → `ssr.enabled = false`) — the Inertia SSR warmup deadlocks in Docker
- The wayfinder Vite plugin uses a fake PHP stub in the Vite container (`printf '#!/bin/sh\nexit 0'`); run `php artisan wayfinder:generate --with-form` manually from the app container when routes change

---

## Daily Commands

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# Run migrations
docker exec inertia_app php artisan migrate

# Rebuild JS assets (production build — use when Vite dev server has issues)
docker exec inertia_vite sh -c "cd /var/www && npm run build"

# Regenerate Wayfinder route types (after adding/changing routes)
docker exec inertia_app php artisan wayfinder:generate --with-form

# Tail all logs
docker compose logs -f

# Run artisan commands
docker exec inertia_app php artisan <command>

# Open a shell in app container
docker exec -it inertia_app bash

# Clear all caches
docker exec inertia_app php artisan optimize:clear
```

---

## Database Schema

### Current tables (already migrated)
- `users` — authentication, name, email, password
- `passkeys` — WebAuthn passkey credentials
- `cache` — Laravel cache (Redis used instead in practice)
- `jobs` / `job_batches` / `failed_jobs` — queue system

### Planned tables (to be created)

```
makes          id, name, slug
               (Chevrolet, Ford, Honda, Toyota...)

models         id, make_id (FK), name, slug
               (Camry, Accord, F-150...)

cars           id, user_id (FK — seller)
               make_id (FK), model_id (FK)
               year, price, mileage
               fuel_type (gasoline|diesel|electric|hybrid)
               body_type (sedan|suv|pickup|coupe|hatchback|van)
               transmission (automatic|manual)
               condition (new|used)
               color
               description
               city, state, country
               status (active|sold|draft)
               timestamps

car_images     id, car_id (FK), path, order, is_primary
               timestamps

favorites      id, user_id (FK), car_id (FK)
               timestamps

messages       id, car_id (FK), sender_id (FK → users), seller_id (FK → users)
               body
               read_at, timestamps
```

### Key relationships
```
User    hasMany Cars (seller)
User    hasMany Favorites
Car     belongsTo User (seller)
Car     belongsTo Make
Car     belongsTo Model
Car     hasMany CarImages
Car     hasMany Messages
Make    hasMany Models
```

---

## Application Pages

| Route | Page | Auth required |
|---|---|---|
| `/` | Home — hero + search + recent listings | No |
| `/cars` | Search results with filters | No |
| `/cars/{car}` | Single listing — photos, details, contact | No |
| `/cars/create` | Post a new listing | Yes |
| `/cars/{car}/edit` | Edit listing | Yes (owner) |
| `/dashboard` | Seller dashboard — my listings | Yes |
| `/favorites` | Saved cars | Yes |
| `/messages` | Inbox — buyer/seller thread | Yes |

Auth pages (already exist via Fortify):
`/login`, `/register`, `/forgot-password`, `/email/verify`

---

## Feature Roadmap

### Phase 1 — Core listing (start here)
- [ ] Migrations for `makes`, `models`, `cars`, `car_images`
- [ ] Seed makes and models (at minimum: top 10 brands)
- [ ] `Car` model + `Make` model + `Model` model with relations
- [ ] Home page — hero section + search bar + recent listings grid
- [ ] Search/filter page (`/cars`) — filter by make, model, fuel, body type, price range, location
- [ ] Single listing page (`/cars/{car}`) — image gallery, specs, seller info
- [ ] Post listing form (`/cars/create`) — with image upload (multiple photos)
- [ ] Seller dashboard (`/dashboard`) — list, edit, mark as sold, delete

### Phase 2 — Engagement
- [ ] Favorites (save a listing)
- [ ] Buyer-to-seller messaging
- [ ] "Related listings" on car detail page
- [ ] Seller public profile (`/sellers/{user}`)

### Phase 3 — Polish
- [ ] Image optimization on upload (resize + webp conversion)
- [ ] Infinite scroll or pagination on listings
- [ ] Map view (optional)
- [ ] Admin panel for moderation

---

## Architecture — Service Layer Pattern

**The rule:** Controllers are thin. Services hold all business logic.

```
Request → Controller → Service → Model → Database
```

| Layer | Responsibility | Location |
|---|---|---|
| Controller | Receive request, call service, return Inertia response | `app/Http/Controllers/` |
| Form Request | Validate input | `app/Http/Requests/` |
| Service | Business logic (create car, upload images, search...) | `app/Services/` |
| Model | Eloquent relations, scopes, casts | `app/Models/` |
| Policy | Authorization (can this user edit this car?) | `app/Policies/` |

**Example — storing a listing:**
```php
// CarController.php — thin, no logic
public function store(StoreCarRequest $request): RedirectResponse
{
    $car = $this->carService->create($request->validated(), $request->user());
    return redirect()->route('cars.show', $car);
}

// CarService.php — all the logic
public function create(array $data, User $seller): Car
{
    $car = $seller->cars()->create($data);
    // handle images, notifications, etc.
    return $car;
}
```

**Services to create:**
- `CarService` — create, update, delete, mark as sold
- `CarImageService` — upload, reorder, delete images
- `CarSearchService` — filter/search logic (keep DB queries out of controllers)

---

## Coding Conventions

### PHP / Laravel
- Models live in `app/Models/`
- Controllers in `app/Http/Controllers/` — resource controllers, **no business logic**
- Services in `app/Services/` — one service per domain (Car, Image, Search)
- Form Requests for validation (`app/Http/Requests/`)
- Policies for authorization (`app/Policies/`) — never check `auth()->id() === $car->user_id` inline
- Use PHP 8.4 attribute syntax for `#[Fillable]` and `#[Hidden]` (already used in `User` model)
- Enums for `fuel_type`, `body_type`, `transmission`, `status` — define in `app/Enums/`
- Inject services via constructor in controllers (not `new CarService()` inline)

### TypeScript / React
- Pages in `resources/js/pages/` — one file per route, PascalCase
- Reusable components in `resources/js/components/`
- Types/interfaces in `resources/js/types/`
- Use Wayfinder for all route references — never hardcode URLs
- Use Inertia `useForm` for all forms

### Inertia data passing
- Keep page props lean — only pass what the page needs
- Shared data (auth user, flash messages) goes through `HandleInertiaRequests` middleware

---

## Environment

```bash
# .env key values for Docker
DB_HOST=db
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

REDIS_HOST=redis          # NOT 127.0.0.1 — that's the bug that broke everything
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis

APP_URL=http://localhost   # port 8080 via nginx
```

**Critical:** Never duplicate keys in `.env`. If you copy from `.env.example`, remove any key that already exists — the last value wins and will silently override the correct one.

---

## Known Issues & Workarounds

| Issue | Workaround |
|---|---|
| Vite SSR warmup deadlocks in Docker (no browser on startup) | `inertia({ ssr: false })` in `vite.config.ts` + `config/inertia.php` SSR disabled |
| Wayfinder needs PHP but Vite container is Node-only | Fake PHP stub in container; run `wayfinder:generate` manually from app container |
| `node_modules` Windows binaries don't run in Linux container | `vite_node_modules` Docker volume holds Linux binaries (separate from host mount) |
| First `npm run build` takes ~150 minutes | Only on cold start. Subsequent builds use Rolldown cache and take ~30s |
| Vite dev server SSR transport timeout | Build assets with `npm run build` instead of relying on dev server |

---

## File Structure (key files)

```
autodive/
├── app/
│   ├── Enums/              # FuelType, BodyType, Transmission, CarCondition, CarStatus
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CarController.php       (thin — calls CarService)
│   │   │   ├── FavoriteController.php
│   │   │   └── Settings/
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   ├── Services/           # ALL business logic lives here
│   │   ├── CarService.php
│   │   ├── CarImageService.php
│   │   └── CarSearchService.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Car.php
│   │   ├── Make.php
│   │   ├── CarModel.php    (named CarModel to avoid conflict with Eloquent Model class)
│   │   └── CarImage.php
│   └── Policies/
│       └── CarPolicy.php
├── database/
│   ├── migrations/
│   └── seeders/
│       └── MakeSeeder.php              (to create)
├── resources/js/
│   ├── pages/
│   │   ├── welcome.tsx                 (becomes Home page)
│   │   ├── cars/
│   │   │   ├── index.tsx               (listing/search — to create)
│   │   │   ├── show.tsx                (car detail — to create)
│   │   │   └── create.tsx              (post listing — to create)
│   │   └── dashboard.tsx               (seller dashboard)
│   └── components/
│       ├── car-card.tsx                (to create)
│       ├── search-bar.tsx              (to create)
│       └── image-gallery.tsx           (to create)
├── docker/
│   ├── php/
│   │   ├── Dockerfile                  (PHP 8.4-fpm + Node.js)
│   │   └── php.ini
│   └── nginx/
│       └── default.conf
├── docker-compose.yml
├── vite.config.ts                      # SSR disabled, wayfinder command overridden
└── config/
    └── inertia.php                     # SSR disabled
```
