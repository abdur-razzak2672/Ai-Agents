# Agent AI Website Replicator

This application allows you to input a website URL and uses GPT-4o to analyze the design and content, then generates a React/Tailwind component that replicates it.

## Features
- **URL Analysis**: Scrapes metadata and content from any URL.
- **AI Design Replication**: Generates professional code based on the source site.
- **Live Preview**: See the generated design in real-time.
- **Code Editor**: Edit the generated code and save changes.
- **History**: View previous generations and company information.

## Tech Stack
- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL, OpenAI.
- **Frontend**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

## Getting Started

### 1. Database Setup
Ensure PostgreSQL is running. The project uses the following credentials (defined in `backend/.env`):
- **DB Name**: `goengage`
- **User**: `postgres`
- **Password**: `razzak72`

### 2. Backend Setup
```bash
cd backend
npm install
# Add your OpenAI API Key to .env
# OPENAI_API_KEY=your_key_here
npx prisma db push
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
In `backend/.env`:
- `DATABASE_URL`: PostgreSQL connection string.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `PORT`: 3001
# Ai-Agents
