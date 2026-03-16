# GJ Concierge Staff

Staff-facing app for GJ Concierge. Staff can view and update service and product requests assigned to them.

## Features

- **Login** - Staff authentication via OAuth2 (same as business/admin)
- **Dashboard** - Overview of assigned requests count
- **Requests** - List of service and product requests assigned to the logged-in staff, with ability to update status

## Setup

1. Copy `.env` and configure `VITE_APP_URL` to point to your backend (default: `http://localhost:10020`)
2. Ensure backend `gj-concierge-service` is running
3. Run `npm install` and `npm run dev`
4. App runs on port 3002

## Backend Requirements

- Staff must have a user account with `ROLE_STAFF`
- Staff must exist in `staffs` table linked to user via `user_id`
- Staff endpoints: `/v1/staff/{staffId}/service-request`, `/v1/staff/{staffId}/product-request`
- After login, the app fetches staff profile via `GET /v1/staff/user/{userId}` to obtain `staffId`

## Tech Stack

- Vite + React 19
- MUI (Material UI)
- React Router v7
- TanStack Query
- Formik + Yup
- Axios
