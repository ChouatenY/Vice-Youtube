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
GEMINI_API_KEY=your_gemini_api_key_here
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
