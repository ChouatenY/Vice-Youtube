'use client';

import { useState, useEffect } from 'react';

export default function TestDbPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the user ID from local storage
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('localUserId');
      setUserId(storedUserId);
      
      // If no user ID exists, create one
      if (!storedUserId) {
        const newUserId = 'user-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('localUserId', newUserId);
        setUserId(newUserId);
      }
    }
  }, []);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        setLoading(true);
        
        // Test the database connection
        const response = await fetch('/api/test-db');
        const data = await response.json();
        
        setResult(data);
        setError(null);
      } catch (err) {
        console.error('Error testing database:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    testDatabase();
  }, []);

  const testAnalysesApi = async () => {
    try {
      setLoading(true);
      
      // Get the user ID from local storage
      const storedUserId = localStorage.getItem('localUserId');
      console.log('User ID from local storage:', storedUserId);
      
      // Add the user ID as a query parameter if available
      const url = storedUserId ? `/api/analysis?userId=${storedUserId}` : '/api/analysis';
      console.log('Fetching analyses with URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Analyses API response:', data);
      
      setResult({
        ...result,
        analysesApiTest: data
      });
      setError(null);
    } catch (err) {
      console.error('Error testing analyses API:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className="mb-4">
        <p>User ID from local storage: {userId || 'Not found'}</p>
      </div>
      
      <div className="mb-4">
        <button 
          onClick={testAnalysesApi}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Analyses API
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : result ? (
        <div className="p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
