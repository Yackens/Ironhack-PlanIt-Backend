# Backend Repository for PlanIt Application
Welcome to the backend repository of the PlanIt project management application! This repository houses the server-side code and configurations that power the backend of our full-stack project management application. PlanIt is designed to facilitate project planning, scheduling, and change management. It enables users to efficiently organize their projects into categories and tasks, providing features for creation, updating, and deletion. Additionally, the backend supports user authentication and authorization through sign-up and log-in pages.

## Components
### Middleware
We have incorporated middleware for JWT authentication within our ExpressJS application. This middleware is responsible for handling token extraction from headers and user authentication.
***
To integrate this middleware into your routes, simply follow this example:

```
const { isAuthenticated } = require("./middleware/jwt.middleware");

// Example of using isAuthenticated middleware
app.get("/api/secure-route", isAuthenticated, (req, res) => {
  // Your secure route logic here
});
```

### Models
We have defined three crucial database models: Category, Task, and User. These models embody distinct aspects of our application's functionality.

#### Category Model
The Category model represents a category for tasks. Each category can house multiple tasks associated with it.

#### Task Model
The Task model represents an individual task within a category. Tasks possess attributes such as title, description, due date, status, and a reference to the category they belong to.

#### User Model
The User model represents an application user. Users have attributes like email, password, and username.

### Routes
We've meticulously crafted various routes that serve as the primary means of interacting with our application's data through the REST API.
***
**/auth**: Authentication routes for user sign-up, log-in, log-out, and verification.
***
**/api/username**: Retrieve the username of the authenticated user.
***
**/api/categories**: CRUD routes for managing categories.
***
**/api/categories/search**: Search categories by name.
***
**/api/tasks**: CRUD routes for managing tasks within categories.

## Server Setup
The App.js and Server.js files orchestrate the server setup and route handling. We utilize ExpressJS to create the app instance, configuring it with various middleware and routes.

## Deployment
To deploy the backend, follow these steps:
***
In the terminal, run npm install.
***
Execute: npm run dev.
***
The server will listen on the specified port (default is 5005).
***
Alternatively, you can deploy it remotely through Git to Adaptable.io.

## Authors
The backend of the PlanIt application has been developed by Joaquin Maroto, Alexander Alexy, and Jazz Rodrigues De Sousa.

