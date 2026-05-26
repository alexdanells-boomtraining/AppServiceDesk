# AppServiceDesk — Claude Code Guide

## Project Overview
A Service Desk for managing Apprenticeships. Learner Success Coaches raise requests (learning status changes, first-30-day concerns, learner detail changes, etc.). Backend users (Compliance Team, Managers) view and action those requests like a simple ticket system.

## Stack
- **HTML** — `index.html` (single entry point)
- **CSS** — `style.css`
- **JavaScript** — `app.js`

No build tools, no frameworks, no package manager. Everything lives in these three files only.

## Constraints
- **No new libraries** without asking the user first.
- **No new files** — all logic stays in `index.html`, `style.css`, and `app.js`.
- **LocalStorage only** — there is no backend. All data is read from and written to `localStorage`.
- **GitHub Pages compatible** — open `index.html` directly in a browser; no server required.

## Running the App
Open `index.html` in any browser. No build step, no dev server.

## Data Layer
All persistence goes through `localStorage`. Key naming convention: `asd_<entity>` (e.g. `asd_tickets`, `asd_users`).

## Roles
| Role | Description |
|------|-------------|
| `coach` | Learner Success Coach — raises requests |
| `admin` | Compliance / Manager — views and actions requests |

## Ticket Types
- Learning status change
- First-30-day concern
- Learner detail change

## Ticket Statuses
`open` → `in_progress` → `resolved` / `closed`

## Git & GitHub Workflow
The repository is hosted on GitHub and deployed via GitHub Pages.

**Branch strategy (simple):**
- `main` — always deployable; only merge working code here
- `feature/<short-name>` — one branch per feature or change

**Recommended flow for each change:**
```
git checkout -b feature/<name>   # create a feature branch
# make changes, test in browser
git add <files>
git commit -m "short description"
git push origin feature/<name>
# open a PR on GitHub, merge into main when happy
```

**Never commit directly to `main`** (except the initial scaffold).

## Commit Style
Short imperative sentences, lower-case, no period:
```
add ticket creation form
fix status filter not resetting
style admin dashboard layout
```
