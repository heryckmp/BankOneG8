import { deleteAllUsers } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await deleteAllUsers();
    
    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in delete users route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 