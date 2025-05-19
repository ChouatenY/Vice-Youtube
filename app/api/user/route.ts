// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LOCAL_USER_ID } from '@/lib/local-user';

// Helper function to initialize user if needed
async function ensureUserExists(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('User not found, creating with ID:', userId);
      await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@example.com`,
          name: 'Local User'
        }
      });
      console.log('User created successfully');
    } else {
      console.log('User already exists with ID:', userId);
    }

    return true;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    // Get the user ID from the query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    console.log('User ID from query parameters:', userId || 'Not provided');

    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;

    // Initialize the user if it doesn't exist
    await ensureUserExists(userIdToUse);

    const user = await prisma.user.findUnique({
      where: { id: userIdToUse }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Type-safe response
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('[USER_API_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}