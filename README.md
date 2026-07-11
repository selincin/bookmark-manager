# 🔖 Bookmark Manager

A modern, responsive bookmark management app built with Vue 3 and TypeScript. This is a **frontend-only project** that uses Supabase as a backend-as-a-service for data storage and a REST API.

## 🌐 Live Demo

Deployed with [Vercel](https://vercel.com) – [bookmark-manager-n1qw1px93-selin5.vercel.app](https://bookmark-manager-n1qw1px93-selin5.vercel.app)

## 🎯 Challenge

This project is based on the [Bookmark Manager App](https://www.frontendmentor.io/challenges/bookmark-manager-app) challenge by [Frontend Mentor](https://www.frontendmentor.io).

## ✨ Features

- 📌 Pin & unpin bookmarks (pinned bookmarks always appear first)
- 🗃️ Archive & restore bookmarks
- ✏️ Create, edit and delete bookmarks
- 🔍 Search bookmarks by title, description or tag
- 🏷️ Filter bookmarks by tags via sidebar
- 🔃 Sort bookmarks by recently added, recently visited or most visited
- 👁️ Track visit count per bookmark
- 📅 Display creation and last edited date
- 🌐 Automatic favicon loading via Google Favicon Service
- 📱 Responsive layout (mobile, desktop)

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Vue 3 (Composition API) | UI Framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Pinia | State management |
| Vue Router | Client-side routing |
| PrimeVue (Aura preset) | UI component library |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP client |
| Supabase (PostgREST) | Backend as a Service / REST API |
| VueUse | Composable utilities |
| Day.js | Date formatting |
| Zod | Schema validation |

## ⚠️ Frontend Only

This is a **pure frontend project**. There is no custom backend — Supabase provides the REST API, authentication-free database access and data persistence via PostgREST.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [Supabase](https://supabase.com) account with a `bookmarks` table

### Installation

```sh
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

## 🗄️ Database Schema

```sql
bookmarks (
  id            int8 primary key,
  created_at    timestamptz,
  updated_at    timestamptz,
  title         text,
  url           text,
  description   text,
  tag           text,
  icon          text,
  pinned        bool default false,
  pinned_at     timestamptz,
  archived      bool default false,
  visit_count   int8 default 0
)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── bookmark-card/    # BookmarkCard component
│   ├── dialogs/          # BookmarkDialog (add & edit)
│   └── side-menu/        # SideMenu with tag filters
├── composables/          # useBookmarks, useDateTime, useUtilities
├── lib/                  # Supabase client
├── models/               # Bookmark TypeScript interface
├── store/                # Pinia bookmark store
├── views/                # HomeView, ArchivedView
├── App.vue
├── main.ts
└── router.ts
```