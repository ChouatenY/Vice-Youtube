'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Unlock the Power of YouTube Content
          </h2>
          
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Extract and analyze content from YouTube videos with AI. Get summaries, key points, and insights in seconds.
          </p>
          
          <div className="space-y-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Instant Transcripts</h3>
                <p className="text-gray-600 dark:text-gray-400">Get accurate transcripts from any YouTube video with just a URL.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">Our AI breaks down complex videos into digestible summaries and key points.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Save & Share</h3>
                <p className="text-gray-600 dark:text-gray-400">Save your analyses for later reference or share them with colleagues.</p>
              </div>
            </div>
          </div>
          
          <Link href="/dashboard">
            <Button size="lg" className="mt-8">
              Get Started
            </Button>
          </Link>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Choose a plan that works for you
          </p>
        </div>
      </div>
    </div>
  );
}
