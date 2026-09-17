# PassOP

PassOP is a full-stack password manager built with React and Express. Users can sign in securely, store credentials for their websites, and manage saved entries from a single dashboard.

## Live Demo

[Open PassOP](https://password-manager-one-liart.vercel.app/)

## Features

- Clerk-powered sign-up, sign-in, and sign-out
- User-specific password records
- Add, view, edit, and delete saved credentials
- Show or hide password values
- Copy usernames and passwords to the clipboard
- Toast notifications for successful and failed actions
- MongoDB persistence through Mongoose
- Token-protected backend API routes

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Clerk React SDK for authentication
- React Toastify for notifications
- UUID for password record IDs
- Lordicon for animated interface icons

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Clerk Express middleware for authentication
- CORS
- dotenv for environment configuration

## Clerk Authentication

The login page is provided by Clerk. The application renders Clerk's `SignIn` component when a user is not authenticated. After sign-in, the authenticated user can access the password manager dashboard. Clerk tokens are sent in the `Authorization` header for API requests, and the Express server uses Clerk authentication to associate each password record with its owner.

## Prerequisites

- Node.js 18 or newer
- A MongoDB database, local or hosted
- A Clerk application and its publishable and secret keys

## Installation

1. Install the frontend dependencies:

   ```bash
   npm install
   ```

2. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   cd ..
   ```

3. Create a `.env` file in the project root:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:3000
   ```

4. Create a `.env` file inside `backend/`:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   PORT=3000
   ```

Do not commit either `.env` file. Keep Clerk secret keys and database credentials private.

## Running Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal from the project root:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Available Scripts

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

### Backend

- `npm run dev` - start the Express server with Nodemon

## API Routes

All password routes require a valid Clerk bearer token.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/passwords` | Get the signed-in user's passwords |
| `POST` | `/api/passwords` | Save a new password |
| `DELETE` | `/api/passwords/:id` | Delete one of the signed-in user's passwords |

## Security Note

Authentication and per-user access control are handled with Clerk. Password values are currently stored by the backend as application data; production deployments should add encryption at rest and review secret-management, database, and transport-security practices before storing sensitive credentials.