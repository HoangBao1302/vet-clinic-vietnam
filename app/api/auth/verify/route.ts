import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ 
      valid: true, 
      user: {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role
      }
    });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
