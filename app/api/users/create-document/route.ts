import { createUserDocument } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'userId and email are required' },
        { status: 400 }
      );
    }

    const result = await createUserDocument({ userId, email });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in create user document route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 