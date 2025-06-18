This is a [Next.js](https://nextjs.org) project with PostgreSQL Vector DB integration for company information management.

## Setup

1. Copy the environment variables:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your actual database credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
OPENAI_API_KEY=your_openai_api_key_here
```

3. Initialize the database:
```bash
npm run init-db
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Company Information Management**: Add and manage company information through the admin interface
- **Vector Database**: Automatically converts text to vectors using OpenAI's text-embedding-ada-002 model
- **PostgreSQL with pgvector**: Stores and searches vectors efficiently
- **Admin Interface**: Available at `/admin` for managing company information

## Usage

1. Visit `/admin` to access the company information management interface
2. Add company information with a title and content
3. The system automatically converts the content to vectors and stores them in the PostgreSQL database
4. View and delete existing company information entries

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
