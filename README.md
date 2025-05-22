# QuizIn - Simple Quiz App

QuizIn is a straightforward quiz application that allows users to test their knowledge on various topics.

## Features

- **User Authentication**: Login and register functionality powered by Firebase
- **Progress Tracking**: Automatically saves user progress in local storage
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- Frontend: ReactJS, ShadcnUI
- Backend: Firebase Authentication
- Storage: Local Storage for progress, Firebase for user data
- API : [OpentDB](https://opentdb.com)

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase account

### Installation

1. Clone the repository
  ```
  git clone https://github.com/yourusername/quizin.git
  cd quizin
  ```

2. Install dependencies
  ```
  npm install
  ```

3. Configure Firebase
  - Create a Firebase project
  - Add your Firebase configuration to the project
  - Enable Firebase Authentication (Email & Google Provider)

4. Run the application
  ```
  npm run dev
  ```

## Usage

1. Register for an account or log in with existing credentials
2. Select a quiz category
3. Answer questions to test your knowledge
4. View your results
