// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LOCAL_USER_ID } from '@/lib/local-user';
import { initializeLocalUser } from '@/lib/server-actions';

export async function GET(request: Request) {
  try {
    // Get the user ID from the query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    console.log('User ID from query parameters:', userId || 'Not provided');

    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;

    // Initialize the user if it doesn't exist
    await initializeLocalUser(userIdToUse);

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