import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: resources });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const newResource = await Resource.create(body);
    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
