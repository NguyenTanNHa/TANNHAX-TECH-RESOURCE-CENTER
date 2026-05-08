import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const resource = await Resource.findById(params.id);
    if (!resource) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: resource });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const updatedResource = await Resource.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!updatedResource) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedResource });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const deletedResource = await Resource.findByIdAndDelete(params.id);
    
    if (!deletedResource) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
