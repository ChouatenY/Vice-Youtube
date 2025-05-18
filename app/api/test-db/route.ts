'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LOCAL_USER_ID } from '@/lib/local-user';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/test-db - Testing database connection');
    
    // Test database connection
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Database connection test result:', result);
    
    // Test user table
    console.log('Testing user table...');
    try {
      const userCount = await prisma.user.count();
      console.log('User count:', userCount);
      
      // Create a test user if none exists
      if (userCount === 0) {
        console.log('No users found, creating test user...');
        const testUser = await prisma.user.create({
          data: {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User'
          }
        });
        console.log('Test user created:', testUser);
      }
      
      // Find the local user
      console.log('Finding local user with ID:', LOCAL_USER_ID);
      const localUser = await prisma.user.findUnique({
        where: { id: LOCAL_USER_ID }
      });
      console.log('Local user found:', localUser);
      
      return NextResponse.json({
        success: true,
        dbConnectionTest: result,
        userCount,
        localUser
      });
    } catch (userError) {
      console.error('Error testing user table:', userError);
      return NextResponse.json({
        success: false,
        dbConnectionTest: result,
        userError: userError instanceof Error ? userError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing database connection:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test database connection',
      details: errorMessage
    }, { status: 500 });
  }
}
