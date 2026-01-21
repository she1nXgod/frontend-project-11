[![Actions Status](https://github.com/she1nXgod/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/she1nXgod/frontend-project-11/actions)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=she1nXgod_frontend-project-11&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=she1nXgod_frontend-project-11)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=she1nXgod_frontend-project-11&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=she1nXgod_frontend-project-11)


# RSS Aggregator

RSS feed aggregator built with vanilla JavaScript. Add your favorite RSS feeds and stay updated with the latest posts, all in one convenient interface.

## Live Demo

[**View Live Application**](https://frontend-project-11-sand-nine.vercel.app/)

## Features

- **Real-time Updates** — Automatically fetches new posts every 5 seconds
- **Multiple Feed Support** — Add unlimited RSS feeds
- **Post Preview Modal** — View post descriptions without leaving the page
- **Read Status Tracking** — Visual indication of read/unread posts
- **Multilingual Support** — Interface available in Russian and English (i18next)
- **Input Validation** — URL validation with user-friendly error messages (Yup)
- **Responsive Design** — Built with Bootstrap 5 for mobile-friendly experience
- **CORS Proxy** — Seamless RSS fetching via proxy service

## Installation

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/she1nXgod/frontend-project-11.git

# Navigate to project directory
cd frontend-project-11

# Install dependencies
npm install

# Start development server
npm run dev
