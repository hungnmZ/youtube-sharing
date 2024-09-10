# YouTube Video Sharing Application

## Introduction

This project is a full-stack application that allows users to share and view YouTube videos. It features real-time updates, user authentication, and a beautiful design. The application is built using Next.js for the frontend and Express.js for the backend, with MongoDB as the database.

Key features include:

- User authentication using Clerk
- Real-time video sharing updates using Socket.IO
- Beautiful design with Tailwind CSS
- Server-side rendering with Next.js
- RESTful API with Express.js
- MongoDB database integration
- Docker deployment support

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20 or later) (recommended 20.9.0)
- pnpm
- Docker
- MongoDB

## Installation & Configuration

1. Clone the repository:

   ```
   git clone https://github.com/hungnmz/youtube-sharing.git
   cd youtube-sharing
   ```

2. Install dependencies for both frontend and backend:

   ```
   cd frontend && pnpm install
   cd ../backend && pnpm install
   ```

3. Set up environment variables:
   - For the frontend, create a `.env.local` file in the `frontend` directory:
     ```
      CLERK_SECRET_KEY = sk_test_8LYLbrOonMrPHWF35ntrajqIvoVUrClmIy7CUs2Sii
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_ZW1pbmVudC13ZWV2aWwtOTguY2xlcmsuYWNjb3VudHMuZGV2JA
      NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
      NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
      NEXT_PUBLIC_BACKEND_URL = http://localhost:3000
     ```
   - For the backend, create a `.env.local` file in the `backend` directory:
     ```
      NODE_ENV = development
      CLERK_SECRET_KEY = sk_test_8LYLbrOonMrPHWF35ntrajqIvoVUrClmIy7CUs2Sii
      CLERK_PUBLISHABLE_KEY = pk_test_ZW1pbmVudC13ZWV2aWwtOTguY2xlcmsuYWNjb3VudHMuZGV2JA
      YOUTUBE_API_KEY = AIzaSyAESmgbt33RF4al8K2hsTYlkHR1NptJefY
      FRONTEND_URL = http://localhost:3006
      ORIGIN = http://localhost:3006
     ```

## Database Setup

1. Ensure MongoDB is running on your local machine or update the `MONGO_URL` in the backend `.env.local` file to point to your MongoDB instance.

2. If you don't have any MongoDB instance, you can use the following command to start a MongoDB container:

   ```
   docker run -d -p 27017:27017 --name youtube-sharing-mongo-1 mongo
   ```

3. To seed the database with initial data, run:
   ```
   sh testData/script.sh
   ```

## Running the Application

1. Start the backend server:

   ```
   cd backend
   pnpm dev
   ```

2. In a new terminal, start the frontend development server:

   ```
   cd frontend
   pnpm dev
   ```

3. Access the application in your web browser at `http://localhost:3006`

4. To run the test suite:

- For backend tests:
  ```
  cd backend
  pnpm test
  ```
- For frontend tests:
  ```
  cd frontend
  pnpm test
  ```

## Docker Deployment

To deploy the application using Docker:

1. Build the Docker images:

   ```
   docker-compose build
   ```

2. Start the containers:

   ```
   docker-compose up -d
   ```

3. The application will be available at `http://localhost:3006`

4. To stop the containers:

   ```
   docker-compose down
   ```

## Usage

1. Sign up or sign in using the authentication system.
2. On the home page, you'll see a list of shared videos.
3. To share a new video, click on the "Share a video" button in the header.
4. Paste a YouTube video URL and click "Share".
5. The newly shared video will notify all connected users in real-time.

## Troubleshooting

- If you encounter CORS issues, ensure that the `ORIGIN` in the backend `.env.local` file matches your frontend URL.
- Check that your YouTube API key is valid and has the necessary permissions.
- For database connection issues, verify that MongoDB is running and the `MONGO_URL` is correct in the backend `.env.local` file.
- If real-time updates are not working, check that the WebSocket connection is not being blocked by a firewall or proxy.
