import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const faviconPath = path.join(process.cwd(), 'public/favicon.ico');
    const faviconBuffer = fs.readFileSync(faviconPath);

    return new NextResponse(faviconBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to serve favicon:', error);
    // 파일이 없으면 204 No Content 반환
    return new NextResponse(null, { status: 204 });
  }
}
