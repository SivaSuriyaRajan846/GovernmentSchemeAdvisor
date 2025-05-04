# Government Scheme Recommender

An India-specific Government Scheme Recommender that matches users with relevant schemes based on personal attributes and provides downloadable application forms.

## Project Setup

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/scheme_recommender
   ```

4. Push the database schema:
   ```
   npm run db:push
   ```

5. Seed the database:
   ```
   npm run db:seed
   ```

6. Start the development server:
   ```
   npm run dev
   ```

## Features
- User profile form to collect personal information
- Scheme recommendation algorithm based on eligibility criteria
- Scheme details view with application information
- Responsive design for all devices

## Technologies Used
- React with TypeScript
- Express.js backend
- PostgreSQL database with Drizzle ORM
- Tailwind CSS for styling
- Shadcn UI components