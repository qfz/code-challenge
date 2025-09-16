# Origin Energy Coding Test

This is a solution to Origin Energy's coding test.

## Introduction
This is a full stack solution to Origin Energy's coding test. Due to time limit, not all acceptance criteria are implemented.

The ACs not implemented are:
- Account balance in payment modal
- "Payment successful" view
- "History of payments" view
- Account search by address

## Project Structure
This project is built with React Router framework mode, it provides server side rendering and allows the frontend to interact with the backend via "loaders" and "actions" instead of JSON APIs, so this project doesn't have any traditional API endpoints.

The files most relevant to the soluiton are:
- `app/routes/accounts.tsx` this implements the main UI and the loader and action functions needed to the UI to read and update data
- `app/accounts/AccountCard.tsx` this file contains the UI to display an energy account
- `app/misc/Errors.tsx` UI view for displaying errors
- `app/repositories/*` these classes implement the business logic, they are named "Repository"s but some might call them "Service"s

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---