'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import productDemo from '@/public/images/product-demo.png';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero/Demo Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Unlock the Power of YouTube Content
        </h1>
        
        <p className="mt-3 text-xl text-card-foreground/80 mb-8 max-w-2xl mx-auto">
          Extract and analyze content from YouTube videos with AI. Get summaries, key points, and insights in seconds.
        </p>
        
        <div className="relative aspect-video w-full max-w-3xl mx-auto mb-12 rounded-lg overflow-hidden border shadow-lg">
          <Image
            src={productDemo}
            alt="Product Demo Screenshot"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <Link href="/dashboard">
          <Button size="lg" className="mt-4 bg-lime-500 hover:bg-lime-600">
            Try It Now
          </Button>
        </Link>
      </section>
      
      {/* How to Use Section */}
      <section className="py-16 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Input YouTube Link</h3>
            <p className="text-card-foreground/70">Paste any YouTube video URL into our analyzer</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Click Analyze</h3>
            <p className="text-card-foreground/70">Our AI processes the video content in seconds</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Save & Edit</h3>
            <p className="text-card-foreground/70">Review, edit, and save your analysis for future reference</p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-2">How accurate are the transcripts?</h3>
            <p className="text-card-foreground/70">Our AI-powered transcription system achieves over 95% accuracy for most clear audio. Results may vary based on audio quality, accents, and background noise.</p>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-2">Are there any video length limitations?</h3>
            <p className="text-card-foreground/70">Our standard plan supports videos up to 2 hours in length. For longer videos, you may need to process them in segments.</p>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-2">What does the subscription include?</h3>
            <p className="text-card-foreground/70">Our annual subscription of $19.99 includes unlimited video analyses, saved history, export options, and priority processing. It's the best value for regular users.</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-lg border bg-card p-6">
            <p className="italic mb-4">"This tool has completely transformed how I study YouTube tutorials. I can quickly find the exact information I need without watching hours of content."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-card-foreground/70">Online Educator</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <p className="italic mb-4">"As a researcher, I analyze dozens of video interviews weekly. This tool saves me countless hours and provides accurate transcripts every time."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-semibold">David Chen</p>
                <p className="text-sm text-card-foreground/70">Market Researcher</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <p className="italic mb-4">"The AI summaries are surprisingly insightful. They capture the key points better than I could after watching the full video."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-semibold">Maria Garcia</p>
                <p className="text-sm text-card-foreground/70">Content Creator</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <p className="italic mb-4">"Worth every penny of the subscription. I use it daily for my studies and the time it saves me is invaluable."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-semibold">James Wilson</p>
                <p className="text-sm text-card-foreground/70">Graduate Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="py-12 border-t mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">YouTube Analyzer</h3>
            <p className="text-sm text-card-foreground/70">Transforming how you consume video content with AI-powered analysis.</p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="text-card-foreground/70 hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-card-foreground/70 hover:text-primary">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-card-foreground/70 hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-card-foreground/70 hover:text-primary">Blog</Link></li>
              <li><Link href="/help" className="text-card-foreground/70 hover:text-primary">Help Center</Link></li>
              <li><Link href="/guides" className="text-card-foreground/70 hover:text-primary">User Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-card-foreground/70 hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-card-foreground/70 hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="text-card-foreground/70 hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t text-sm text-card-foreground/70">
          <p>© {new Date().getFullYear()} YouTube Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
