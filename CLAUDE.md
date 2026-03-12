# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vue 3 PWA for personal fitness tracking. Data is stored client-side in **IndexedDB** and optionally synced to a Google Apps Script backend. No build tools — the app runs directly in the browser using ES6 modules and CDN-hosted dependencies.

## Running and Testing

- **Run**: Serve the project root via any HTTP server (e.g., `python3 -m http.server 8080`) and open `index.html` in a browser. Cannot open `index.html` directly as a file due to ES6 module CORS restrictions.
- **Tests**: Open `spec/SpecRunner.html` in a browser. Tests use Jasmine 5.1.1 and test the IndexedDB model layer against a `"Test"` database (auto-deleted before each run).

## Architecture

**MVC pattern with Vue 3:**

- `models/indexedDB/` — Database layer. `index.js` exports a singleton `database` instance and the `Database` class. Each entity has its own table file (`categories.js`, `exercises.js`, `workouts.js`, `workouts_exercises.js`, `days-workouts.js`). Migrations are handled in `migrations.js` (current DB version: 5).
- `controllers/` — Business logic. All controllers extend `Controller` (`controllers/controller.js`) which connects to the `database` singleton via `this.store`.
- `components/` — Vue 3 components. Each component is a JS file + HTML template file pair (e.g., `head-component.js` + `head-component.html`). HTML templates are fetched at startup via `getTemplate()` in `main.js` and injected into `document.body`.

**Routing**: URL query parameter `?page=<name>`. Navigation calls `changeRoute()` in `index.js` which reads `params.page` from the URL. History is managed with `history.pushState`.

**Component registration**: All components are registered in `index.js` in the `getComponents()` array, which specifies `tag`, `component` module, `name`, and `path` (relative to `components/`).

**Key utility exports from `main.js`**:
- `getTemplate(name, path)` — fetches and injects HTML templates
- `getParam(param)` — reads URL query params
- `requestPost(data, url)` — POST helper for the Google Apps Script API
- `uuidv4()` — UUID generator for new records
- `API_URL` — Google Apps Script endpoint

## Entities / Data Model

- **Category** — exercise categories
- **Exercise** — exercises belonging to a category
- **Workout** — workout plans
- **WorkoutExercise** — exercises within a workout (junction)
- **DayWorkout** — logged workout sessions on specific dates
- **Location** — workout locations

## Component Structure Convention

Each component lives in `components/<section>/<name>/` with two files:
- `<name>-component.js` — Vue component definition
- `<name>-component.html` — `<template id="...">` tag with the component HTML

Sections: `forms/`, `list/`, `pages/`, `dashboard/`, `shared/`, `head/`, `footer/`, `index/`, `dates/`.

## External Dependencies (all via CDN)

- Vue 3 (`unpkg.com/vue@3`)
- Bootstrap 5.2.0-beta1
- Chart.js 3.9.0
- Font Awesome 6.1.1 (also has a local copy in `fontawesome/`)
