import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      console.warn("Missing admin credentials in environment variables.");
      return NextResponse.json(
        { success: false, message: "System configuration error" },
        { status: 500 }
      );
    }

    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set an HTTP-only cookie for the admin session
      // For simplicity in this demo, we're just using a simple token string.
      // In production, consider using JWT.
      response.cookies.set({
        name: 'tannhax_admin_auth',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Tài khoản hoặc mật khẩu không chính xác." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
