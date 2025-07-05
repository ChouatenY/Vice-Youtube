# YouTube Video Analyzer

A modern web application built with Next.js that extracts and analyzes YouTube video content using AI.

## Features

- YouTube URL input with validation
- Transcript extraction using youtubei.js package
- AI-powered content analysis with Google's Gemini API
- Clean, user-friendly interface with responsive design
- Loading states with progress indicators and skeleton loaders
- Error handling for various scenarios
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Gemini API key
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/youtube-video-analyzer.git
cd youtube-video-analyzer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:

```
GOOGLE_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_database_url_here
DIRECT_URL=your_direct_database_url_here
```

You can get a Gemini API key by signing up at [Google AI Studio](https://ai.google.dev/).

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment on Vercel

### Prerequisites

1. A Vercel account
2. A PostgreSQL database (e.g., Neon, Vercel Postgres, Supabase, or any other provider)
3. A Google API key with access to the Gemini API

### Environment Variables Setup

**IMPORTANT**: You must set these environment variables in your Vercel project settings before deployment:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
DIRECT_URL=postgresql://username:password@host:port/database?sslmode=require

# Google API Key
GOOGLE_API_KEY=your_google_api_key_here
```

### Deployment Steps

1. **Connect your repository** to Vercel
2. **Set environment variables** as described above
3. **Deploy** - Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build the Next.js application
4. **Initialize database** (first deployment only):
   - After successful deployment, run: `npx prisma db push` locally or use Vercel CLI
   - This creates the required database tables

### Troubleshooting

**Database Connection Issues:**
- Ensure your DATABASE_URL is correctly formatted
- Check that your database allows connections from Vercel's IP ranges
- Verify SSL mode is set correctly (`sslmode=require` for most providers)

**API Key Issues:**
- Verify your Google API key has Gemini API access enabled
- Check that the API key is correctly set in Vercel environment variables

### Environment Variables

Set the following environment variables in your Vercel project:

```
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database

# Google API
GOOGLE_API_KEY=your_google_api_key
```

### Important Notes for Vercel Deployment

1. **API Timeouts**: The application is configured to work within Vercel's free tier 10-second function timeout limit. If you're analyzing long videos or experiencing timeouts, consider upgrading to a paid plan or optimizing your requests.

2. **Database Connection**: Make sure both `DATABASE_URL` and `DIRECT_URL` are properly configured for Prisma to work correctly on Vercel.

3. **Vercel Configuration**: The project includes a `vercel.json` file that configures the serverless functions for optimal performance.

### Build for Production

```bash
npm run build
# or
yarn build
```

## Usage

1. Enter a valid YouTube URL in the input field (e.g., https://www.youtube.com/watch?v=pcC4Dr6Wj2Q&t=1s)
2. Click "Analyze Video" to extract the transcript and analyze the content
3. View the embedded YouTube video
4. Read the AI-generated analysis of the video content
5. Click "Analyze Another Video" to start over

## Iframe Embedding

This application is designed to be embedded in iframes. You can embed it in your own projects using:

### Basic Embedding
```html
<iframe
  src="https://your-deployment-url.vercel.app/dashboard"
  width="100%"
  height="800px"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

### Dedicated Embed Route
For a cleaner iframe experience, use the dedicated embed route:
```html
<iframe
  src="https://your-deployment-url.vercel.app/embed"
  width="100%"
  height="800px"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

### Features for Iframe Embedding
- ✅ **X-Frame-Options**: Set to `ALLOWALL` to allow embedding from any domain
- ✅ **Content Security Policy**: Configured with `frame-ancestors *;`
- ✅ **Responsive Design**: Automatically adjusts to iframe dimensions
- ✅ **Cross-Origin Support**: CORS headers configured for iframe communication
- ✅ **Iframe Detection**: Automatically detects when running in iframe and adjusts layout
- ✅ **Dedicated Embed Route**: `/embed` route optimized for iframe usage

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- youtubei.js package
- Google Gemini API
- React Icons
- React Markdown
- PostgreSQL with Prisma ORM

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [youtubei.js](https://github.com/LuanRT/YouTube.js)
- [Google Gemini API](https://ai.google.dev/)
