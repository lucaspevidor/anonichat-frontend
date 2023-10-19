# AnoniChat Frontend

The AnoniChat Frontend is the client-side component of my anonymous chat application built with Next.js and React, enabling users to engage in real-time chat without the need for email or phone verification. It offers features like easy account creation and deletion, channel creation, and messaging with other users.

## Features

- **Anonymous Chat**: Chat with other users without email or phone verification.
- **Easy User Account Deletion**: Easily delete your account to remove all data from servers and databases.
- **Channel Creation**: Create channels and invite other users for group communication.

## Technologies Used

- Next.js: A popular React framework for building server-rendered React applications.
- Socket.io: Provides real-time, bidirectional communication using WebSockets.

## Getting Started

These instructions will help you set up and run the frontend locally for development and testing purposes.

### Prerequisites

- Node.js: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- An environment capable of hosting with SSL certificates enabled.
- The [backend](https://github.com/lucaspevidor/anonichat-backend) server already running locally.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/lucaspevidor/anonichat-frontend.git
   cd anonichat-frontend
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file to store environment variables, such as the backend API URL:

   ```env
   NEXT_PUBLIC_API_URL="https://<your_backend_url>"
   NEXT_PUBLIC_SOCKET_URL="https://<your_backend_url>"
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The frontend application should now be running locally and accessible in your browser at `http://localhost:3007` by default.

## Contact

If you have questions or need assistance, you can reach me out at lucas.pevidor@gmail.com.
