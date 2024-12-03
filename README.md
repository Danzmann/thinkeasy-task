# ThinkEasy Post Management App Test Task

A feature-rich **Post Management Application** built with **Next.js** and **Chakra UI**, providing seamless user authentication, post creation, and search functionality. This project leverages **Recoil** for state management, **react-hook-form** for form handling and validation, and **react-toastify** for user-friendly notifications. The application supports advanced search with dynamic highlighting and author filtering for an intuitive user experience.
This app was built as a test task for [ThinkEasy s.r.o](https://thinkeasy.cz/)

## Features

### Core Functionality
- **Authentication**:
  - Login and signup forms with full validation, password confirmation, and "remember me" functionality.
  - Stores access tokens using `localStorage` or session-based management.

- **Post Management**:
  - View all published posts or filter posts by specific authors.
  - Create new posts.
  - Redirect to individual post pages for detailed views.

- **Search**:
  - Dynamic post search by title or content with matched portions highlighted.
  - Search posts by author ID with an auto-complete dropdown.

### UI and UX
- Fully responsive design using **Chakra UI**.
- Full-page spinner for loading states.
- User-friendly error messages and success notifications with **react-toastify**.

### State Management
- Global state managed with **Recoil**, including token handling and loading state.
- Persistent authentication across sessions with token validation.

---

## Installation and Setup

### Prerequisites
Ensure the following tools are installed:
- **Node.js**: v16 or above
- **npm**: v7 or above (or **yarn**)


### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory and configure the following environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=<API base URL>
```

### Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Project Structure

```
src/
├── api/                # API functions
├── components/         # Reusable React components
├── constants/          # API endpoints and other constants
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages
├── state/              # Recoil atoms and selectors (only atoms being used currently)
├── styles/             # Global CSS
├── themes/             # Chakra theme overrides
├── types/              # TypeScript type definitions
├── utils/              # General utility functions
```

---

## Tech architecture decicions

### Pages routing
This application uses the "old" pages routing of Next.js instead of the new `app` routing. This was chosen
due to the stability and maturity of pages routing, making the implementation of a simple app like this easier and faster.
Furthermore, it has more and better compatibility with libraries.

---

## Key Components

### Authentication (`withAuth`)
- **`src/components/withAuth.tsx`**:
  A Higher-Order Component (HOC) that enforces authentication by redirecting unauthenticated users to the login page. It displays a full-page spinner during loading states.

### NewPostModal
- **`src/components/NewPostModal.tsx`**:
  - A modal dialog for creating new posts.
  - Validates user input and triggers the creation of a new post on submission.

### PostCard
- **`src/components/PostCard.tsx`**:
  - A reusable card component for displaying individual posts.
  - Includes a **"green background animation"** for newly created posts to make them stand out.

## Pages

### `/`
- **Description**: The home page where users can view, search, and filter published posts.
- **Key Features**:
  - Search posts by title, content, or author ID with dynamic highlighting.
  - Create new posts using the **NewPostModal**.
  - Reset filters to view all posts.
  - Navigate to individual post pages by clicking on a post.

### `/posts/[id]`
- **Description**: The detailed view for a specific post.
- **Key Features**:
  - Displays the full content of the selected post.
  - Provides metadata such as the author and creation date.

### `/auth`
- **Description**: The authentication page where users can log in or sign up.
- **Key Features**:
  - Separate tabs for login and signup.
  - Form validation for required fields, including password confirmation during signup.
  - "Remember Me" functionality for persistent authentication.
  - Displays toast notifications for errors or successful actions.


## Usage Guide

### Login or Signup
1. Application index `/` redirects to `/auth` to log in or create a new account.
2. Use the "Remember Me" option for persistent sessions.

### Search for Posts
- Use the **Search by Title/Content** field to find posts dynamically.
- Search results highlight matched terms and redirect to the post upon selection.

### Filter by Author
- Use the **Search by Author ID** dropdown to filter posts by specific authors.

### Create a New Post
- Click the **New Post** button to open the post creation modal.
- Newly created posts are highlighted with a green animation.

---

## Technologies Used

### Frontend
- [Next.js](https://nextjs.org/) - React-based framework for server-side rendering and routing.
- [Chakra UI](https://chakra-ui.com/) - Accessible and customizable UI components.
- [chakra-autocomplete](https://www.npmjs.com/package/@choc-ui/chakra-autocomplete) - Robust and up-to-date library for Chakra-based Autocomplete component
- [Recoil](https://recoiljs.org/) - State management for React.
- [react-hook-form](https://react-hook-form.com/) - Form validation and handling.
- [react-toastify](https://fkhadra.github.io/react-toastify/) - Toast notifications for feedback.

### Backend
- API integration with endpoints for authentication and post management.
  - Swagger: https://frontend-test-be.stage.thinkeasy.cz/api#/
---

## Known Issues

- **API Security**:
  - Backend API does not support cookie-based authentication, persistance relies on localStorage which is vulnerable to XSS.
  - Refresh-token requires authentication token, which defeats the purpose of the refresh-token in the first place.
  - Access token has too long of a lifetime
- **Performance**:
  - GET `/posts` has no pagination nor filter/sort query parameters
  - Filtering and search of posts is done in front-end
- **Testing**
  - Automated testing was attempted but did not work. Something in Chakra prevents react-testing-library `render()` from working. Needs investigating.

---

