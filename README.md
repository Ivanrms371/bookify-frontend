# Bookify App

Management dashboard for **Bookify**, a multi-tenant SaaS platform for appointment-based businesses such as barbershops, beauty salons, tattoo studios, and spas.

The application provides business owners and staff with a centralized interface to manage appointments, customers, services, professionals, schedules, and business settings.

## Features

- Appointment calendar and management
- Customer management
- Service management
- Professional and team management
- Professional schedules and availability
- Schedule exceptions
- Team invitations
- Business settings
- Multi-step business onboarding
- Dashboard and business statistics
- Multi-tenant business context
- Role-based access control
- Authentication and session handling
- Responsive interface

## Tech Stack

- **React**
- **TypeScript**
- **React Router**
- **Tailwind CSS**
- **TanStack Query**
- **Zustand**

## Application

Bookify App is the authenticated management interface of the Bookify platform.

Users operate within an active business context, with access to features and actions determined by their role and permissions.

Server state and API synchronization are handled with TanStack Query, while Zustand is used for client-side application state.

The dashboard communicates with the Bookify Backend API and integrates with the public Bookify website for customer-facing booking flows.

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

The **Bookify Backend** should also be running locally for features that require API access.

### 1. Clone the repository

```bash id="fks9a3"
git clone <repository-url>
cd bookify-app
```

### 2. Install dependencies

```bash id="e1z6gj"
npm install
```

### 3. Configure environment variables

Create your local environment file:

```bash id="q7ma2e"
cp .env.example .env
```

The default development configuration is:

```env id="4f19ck"
# Backend API
VITE_API_URL=http://localhost:4000/api

# Public booking application
VITE_APP_URL=http://localhost:4321
```

### 4. Start the development server

```bash id="84k4hc"
npm run dev
```

The dashboard will typically be available at:

```text id="y75yqr"
http://localhost:5173
```

## Environment Variables

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | URL of the Bookify Backend API                |
| `VITE_APP_URL` | URL of the public Bookify booking application |

See `.env.example` for the development configuration.

Environment variables prefixed with `VITE_` are exposed to client-side code and therefore must not contain secrets or private credentials.

## Related Applications

Bookify is divided into three applications:

- **Bookify App** — Management dashboard for businesses and staff
- **Bookify Backend** — NestJS API and business logic
- **Bookify Web** — Public website and customer booking experience

Each application is maintained in its own repository.

## Development Status

Bookify is currently under active development.

The project is being developed as a complete SaaS platform and may contain features or interfaces that are still evolving.

## License

Copyright © 2026 Iván Rodríguez. All rights reserved.

This source code is publicly available for viewing and portfolio purposes only.

No permission is granted to copy, modify, distribute, sublicense, sell, or use this software or substantial portions of it for commercial purposes without prior written permission from the author.
