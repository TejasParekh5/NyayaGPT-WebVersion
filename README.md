# Welcome to NyaySetu - Legal Chatbot Application

NyaySetu is a multilingual legal assistance chatbot designed to provide basic legal information to users in India. It supports multiple Indian languages using Bhashini API with Azure services integration as a fallback.

## Features

- **Multilingual Support**: Communicate in 10 Indian languages
- **Speech Recognition**: Ask questions using voice input
- **Text-to-Speech**: Listen to responses in your chosen language
- **Legal Information**: Access basic legal information about FIRs, legal rights, property registration, and more
- **Azure Integration**: Fallback to Azure services when Bhashini is unavailable

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

# step 5: Follow the steps to commit the changes from vs code to github repo. follow this steps after cloning repo
git init

# step 6: Replace "your name" and "your-email@example.com" with the name and email you use for your GitHub account.
git config --global user.name "your name"
git config --global user.email "your-email@example.com"

# step 7: Make Your Changes in VS Code then do this.
git add .
git commit -m "Your commit message"
git push origin main
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# NyayaGPT Legal Assistant

A multilingual legal assistance chatbot to provide legal information and guidance to users in multiple Indian languages.

## Features

- **Multilingual Support**: Interface available in multiple Indian languages including Hindi, Bengali, Tamil, and more.
- **Voice Input**: Speech-to-text functionality for hands-free interaction.
- **Text-to-Speech**: Listen to the chatbot's responses with text-to-speech conversion.
- **Legal Information**: Access to common legal information about FIRs, legal rights, consumer complaints, and more.
- **Simple Chat Interface**: Easy-to-use chat interface with typing indicators and message history.

## Technologies Used

This project is built with:

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express
- **Speech Services**: Ready for integration with Bhashini APIs or Google Cloud Speech Services

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Running the Application

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd NyayaGPT-WebVersion

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start both frontend and backend servers
npm run dev
```

The application will be available at `http://localhost:5173/` (frontend) with the backend API running at `http://localhost:5000`.

## Bhashini API Integration

The application is designed to be integrated with Bhashini APIs for enhanced multilingual capabilities. To integrate with Bhashini:

1. Sign up for Bhashini API access at [bhashini.gov.in](https://bhashini.gov.in)
2. Update the `.env` file with your Bhashini API credentials
3. Uncomment and implement the Bhashini API calls in the backend `server.js` file

## Google Cloud Integration (Alternative)

For development purposes, you can also use Google Cloud Speech-to-Text and Text-to-Speech APIs:

1. Create a Google Cloud project and enable Speech-to-Text and Text-to-Speech APIs
2. Create a service account and download the JSON credentials file
3. Update the `.env` file with the path to your credentials file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
   ```

## Directory Structure

- `/backend`: Node.js/Express server for handling API requests
- `/src`: React frontend code
  - `/components`: UI components
  - `/pages`: Page components including Chatbot.tsx
  - `/hooks`: Custom React hooks

## How to Edit the Code

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

# step 5: Follow the steps to commit the changes from vs code to github repo. follow this steps after cloning repo
git init

# step 6: Replace "your name" and "your-email@example.com" with the name and email you use for your GitHub account.
git config --global user.name "your name"
git config --global user.email "your-email@example.com"

# step 7: Make Your Changes in VS Code then do this.
git add .
git commit -m "Your commit message"
git push origin main
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.
