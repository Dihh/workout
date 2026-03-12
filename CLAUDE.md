# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Workout-e** — Vue 3 PWA for personal fitness tracking, designed for smartphone portrait mode. Data is stored client-side in **IndexedDB** and optionally synced to a Google Apps Script backend. No build tools — the app runs directly in the browser using ES6 modules and CDN-hosted dependencies.

## Running and Testing

- **Run**: Serve the project root via any HTTP server (e.g., `python3 -m http.server 8080`) and open `index.html` in a browser. Cannot open `index.html` directly as a file due to ES6 module CORS restrictions.
- **Seed data**: Open `seed.html` in the browser to populate IndexedDB with realistic test data (categories, exercises, workouts and 28 days of sessions). Also has a "Limpar banco" button to reset everything.
- **Tests**: Open `spec/SpecRunner.html` in a browser. Tests use Jasmine 5.1.1 and test the IndexedDB model layer against a `"Test"` database (auto-deleted before each run).

## Architecture

**MVC pattern with Vue 3:**

- `models/indexedDB/` — Database layer. `index.js` exports a singleton `database` instance and the `Database` class. Each entity has its own table file. Migrations are handled in `migrations.js` (current DB version: 5).
- `controllers/` — Business logic. All controllers extend `Controller` (`controllers/controller.js`) which connects to the `database` singleton via `this.store`.
- `components/` — Vue 3 components. Each component is a JS file + HTML template file pair. HTML templates are fetched at startup via `getTemplate()` in `main.js` and injected into `document.body`.

**Routing**: URL query parameter `?page=<name>` with optional extra params (e.g. `?page=day-workout&id=...&date=...`). Navigation calls `changeRoute()` in `index.js`. History managed with `history.pushState`.

**Component registration**: All components registered in `index.js` in the `getComponents()` array (`tag`, `component`, `name`, `path`).

**Key utility exports from `main.js`**:
- `getTemplate(name, path)` — fetches and injects HTML templates
- `getParam(param)` — reads URL query params
- `uuidv4()` — UUID generator for new records
- `requestPost(data, url)` — POST helper for the Google Apps Script API

## Entities / Data Model

- **Category** — exercise categories
- **Exercise** — exercises belonging to a category
- **Workout** — workout plan templates
- **WorkoutExercise** — exercises within a workout (junction)
- **DayWorkout** — logged exercise sessions on specific dates (`date`, `exercise_id`, `weight`, `executed`)
- **Location** — workout locations

Key model note: `days-workouts.js` `select_id` joins exercises and categories, returning `exercise_name`, `category_name` and `category_id`. `select_by_exercise_id` uses the `exercise_id` index and is used for chart data.

## Component Structure Convention

Each component lives in `components/<section>/<name>/` with two files:
- `<name>-component.js` — Vue component definition
- `<name>-component.html` — `<script type="text/x-template" id="...">` with the component HTML

Sections: `forms/`, `list/`, `pages/`, `dashboard/`, `shared/`, `head/`, `footer/`, `index/`, `dates/`.

## Charts (Chart.js)

Detail pages for **exercise**, **day-workout** and **category** render Chart.js line charts. The pattern is:
- Store chart instances as non-reactive component properties (`this._chart`, `this._chartWeight`, etc.)
- Destroy instances in `beforeUnmount()` to avoid canvas re-use errors
- Build charts after `this.loading = false` + `await this.$nextTick()`
- All charts use the purple theme (`#641987`), gradient fill, `tension: 0.4`, no legend

## PWA / Service Worker

`sw.js` uses a versioned cache name (`workout-e-vX.X.X`). On activate, all caches from previous versions are deleted automatically. Fetch strategy: network-first with cache fallback.

**To release a new version**: change `VERSION` in `sw.js` and the version text in `index.html`.

## UI Conventions

- CSS variables in `style.css`: `--primary`, `--primary-dark`, `--primary-darker`, `--radius`, `--footer-height`, `--head-height`, etc.
- Layout: fixed header (`#head`) + scrollable content (`#index`) + fixed footer (`#footer`)
- Card-based lists use `.list-item` / `.list-items`; workout day items use `.workout-item` / `.workout-items`
- Detail pages use `.detail-header`, `.detail-title`, `.detail-actions`, `.detail-info`, `.detail-row`
- Chart cards use `.chart-card`, `.chart-header`, `.chart-title`, `.chart-badge`
- FAB add button is `.add-button`, fixed above the footer

## External Dependencies (all via CDN)

- Vue 3 (`unpkg.com/vue@3`)
- Bootstrap 5.2.0-beta1
- Chart.js 3.9.0
- Font Awesome 6.1.1 (also has a local copy in `fontawesome/`)
