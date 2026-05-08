import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    // We are revalidating the API path that is cached
    revalidatePath('/api/drive/folder');
    
    return NextResponse.json({ success: true, message: 'Cache cleared successfully. Next load will fetch fresh data from Drive.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
