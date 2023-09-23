# Greensfeer (Server Side)

Greensfeer Server is the backend component of the Greensfeer project, providing essential services and APIs to support the functionality of the Greensfeer online marketplace. This server is responsible for handling authentication, data storage, and various backend operations.

## Credits

### Web Developers

- [Travis Martin](https://www.linkedin.com/in/travis-j-martin/)
- [Miguel Lopez](https://www.linkedin.com/in/lopezpedres/)
- [Vincent Luciano](https://www.linkedin.com/in/vincent-luciano-profile/)

## Technologies Used

The Greensfeer Server utilizes the following technologies and dependencies:

- [Express](https://expressjs.com/): A fast and minimalist web framework for Node.js.
- [Firebase](https://firebase.google.com/): A development platform with a wide range of services.
  - Authentication: Firebase Authentication for user authentication.
  - Firestore Database: A NoSQL cloud database for storing application data.
  - Firebase Storage: For managing and serving user-generated content.
  - Firebase Analytics: To gain insights into user behavior and app usage.
  - Firebase Admin: A set of tools for managing Firebase services programmatically.
  - Firebase Functions: Serverless functions to extend and customize Firebase services.
- [body-parser](https://www.npmjs.com/package/body-parser): Middleware for parsing request bodies.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Middleware for parsing cookies.
- [cors](https://www.npmjs.com/package/cors): Middleware for enabling Cross-Origin Resource Sharing.
- [csurf](https://www.npmjs.com/package/csurf): Middleware for adding CSRF protection to routes.
- [ejs](https://www.npmjs.com/package/ejs): A simple templating engine for rendering dynamic content.
- [uuid](https://www.npmjs.com/package/uuid): A library for generating UUIDs (Universally Unique Identifiers).

## Getting Started

To set up and run the Greensfeer Server locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 16 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for Firebase-related commands)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IanDCF/greensfeer-be.git
   ```

2. Change to the project directory:

   ```bash
   cd greensfeer-be
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

### Configuration

- Set up your Firebase project and obtain the necessary configuration keys.
- Configure your Firebase project by creating a keys.json file following the keys.example.json file format.

### Server Hosting

The Greensfeer Server is hosted using [Firebase Functions](https://firebase.google.com/docs/functions). Firebase Functions is a serverless compute service that allows you to run backend code in response to HTTP requests or other events. This approach provides scalability, reliability, and easy deployment for the server component of Greensfeer.

### Local Development

During local development, you can use the Firebase Emulator Suite to test your functions locally before deploying them to the cloud. To start the emulator suite, use the following command:

```bash
npm run serve
```

## Deployment

You can deploy the Greensfeer Server to your preferred hosting platform or use Firebase Hosting and Cloud Functions for deployment. Ensure that you have the Firebase CLI configured for deployment.

To deploy to Firebase, use the following command:

```bash
npm run deploy
```

## Usage

The Greensfeer Server provides a set of APIs and services that are utilized by the Greensfeer front-end UI.

## Contributing

We welcome contributions to the Greensfeer Server. If you'd like to contribute, please follow the standard GitHub workflow:

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, concise messages.
4. Push your branch to your fork on GitHub.
5. Create a pull request (PR) to the main repository.
6. Engage in discussions and address feedback during the review process.
7. Once approved, your changes will be merged into the main branch.

Thank you for contributing to Greensfeer!

## License

This project is licensed under the [MIT License](LICENSE).

---

© 2023 Greensfeer. All Rights Reserved.
