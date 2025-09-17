# Next Talk Chat App Server

A real-time chat server built with Express, Socket.io, and TypeScript. This backend powers the Next Talk chat application, enabling instant messaging and user connectivity.

## Features

- Real-time communication using Socket.io
- RESTful API with Express
- CORS support for cross-origin requests
- Environment variable management with dotenv
- TypeScript for type safety

## Tech Stack

- Node.js
- Express
- Socket.io
- TypeScript
- MongoDB (planned)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the server in development mode:

```bash
npm run dev
```

### Production

Build and start the server:

```bash
npm start
```

### Environment Variables

Create a `.env` file in the root directory and set your environment variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## API Endpoints

- `GET /` — Health check endpoint

## Socket.io Events

- `connection` — Triggered when a client connects
- `disconnect` — Triggered when a client disconnects

## Project Structure

```
src/
  index.ts           # Entry point
  controllers/       # Route controllers
  models/            # Database models
  routes/            # API routes
  services/          # Business logic
  utils/             # Utility functions
  config/            # Configuration files
  constants/         # Constant values
```

## License

MIT
