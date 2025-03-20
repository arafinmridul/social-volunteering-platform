# Social Volunteering Platform

A full-stack web application designed to connect volunteers with social causes and events. This platform allows users to create, join, and manage volunteering events and community posts, fostering community engagement and collaboration.

## Tech Stack

### Frontend

-   **React**: For building the user interface.
-   **TypeScript**: For type-safe development.
-   **Material-UI**: For responsive and accessible UI components.

### Backend

-   **Node.js**: For server-side logic.
-   **Express.js**: For building RESTful APIs.
-   **MongoDB**: For database management.
-   **Mongoose**: For object data modeling (ODM).

### Other Tools

-   **JWT**: For secure authentication.
-   **Bcrypt**: For password hashing.
-   **Postman**: For API testing.
-   **Git**: For version control.

## Features

-   **User Authentication**: Secure login and registration system with access control (e.g., admin, volunteer).
-   **User Profile**: Users can create, manage, update their profiles and have their details, skills, interests, contribution history in the profiles.
-   **Event Management**: Create, update, and delete events with detailed titles, descriptions, dates, and locations.
-   **Volunteer Participation**: Users can join events, track their participation, and view event details.
-   **Community Posts**: Create, update, and delete posts with detailed titles, descriptions, urgency level.
-   **Community Participation**: Users can comment on posts, see other comments, and view post details.
-   **Responsive Design**: Fully responsive UI for seamless usage across desktop, tablet, and mobile devices.
-   **RESTful API**: Backend API for managing users, events, posts, and profiles with secure data handling.

## Database Schema Structure

+----------------+ +----------------+ +----------------+ +----------------+
| User | | Event | | Post | | Comment |
+----------------+ +----------------+ +----------------+ +----------------+

## Setup & Installation

Follow these steps to set up the project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/arafinmridul/social-volunteering-platform.git
    cd social-volunteering-platform
    ```

2. Install dependencies for both frontend and backend:

    ```bash
    # Navigate to the backend folder
    cd server
    npm install

    # Navigate to the frontend folder
    cd ../client
    npm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the `server` folder with the following:
        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```

4. Start the development servers:

    ```bash
    # Start the backend server
    cd server
    npm start

    # Start the frontend server
    cd ../client
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:5173`.

## API Endpoints

### Authentication

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in a user.

### Events

-   `GET /api/events`: Fetch all events.
-   `GET /api/events/:id`: Fetch an event.
-   `POST /api/events`: Create a new event (user only).
-   `PUT /api/events/:id`: Update an event (admin user only).
-   `DELETE /api/events/:id`: Delete an event (admin user only).

### Posts

-   `GET /api/posts`: Fetch all posts.
-   `GET /api/posts/:id`: Fetch an post.
-   `POST /api/posts`: Create a new post (user only).
-   `PUT /api/posts/:id`: Update an post (admin user only).
-   `DELETE /api/posts/:id`: Delete an post (admin user only).

### Users

-   `GET /api/users/:id`: Fetch user profile.
-   `PUT /api/users/:id`: Update user profile.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, feel free to reach out:

-   **Email**: mridularafin@gmail.com
-   **GitHub**: [arafinmridul](https://github.com/arafinmridul)
