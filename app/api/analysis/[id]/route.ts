import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
