

import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UC8r8Riyf4NTojG3eB6Efcuw'; // Tucker Carlson Network
const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`;

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const res = await fetch(YOUTUBE_API_URL);
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch from YouTube API' }, { status: 500 });
  }

  const data = await res.json();
  const latestVideo = data.items?.find((item: any) => item.id.kind === 'youtube#video');

  if (!latestVideo) {
    return NextResponse.json({ error: 'No videos found' }, { status: 404 });
  }

  return NextResponse.json({
    videoId: latestVideo.id.videoId,
    title: latestVideo.snippet.title,
  });
}