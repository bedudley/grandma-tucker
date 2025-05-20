import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCGttrUON87gWfU6dMWm1fcA'; // Tucker Carlson

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  // Step 1: Get latest 10 uploads from the channel
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }

  const searchData = await searchRes.json();
  const videoIds = searchData.items
    .filter((item: { id: { kind: string; videoId: string } }) => item.id.kind === 'youtube#video')
    .map((item: { id: { videoId: string } }) => item.id.videoId)
    .join(',');

  if (!videoIds) {
    return NextResponse.json({ error: 'No video IDs found' }, { status: 404 });
  }

  // Step 2: Get video details (durations)
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`;
  const videosRes = await fetch(videosUrl);
  if (!videosRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch video details' }, { status: 500 });
  }

  const videosData = await videosRes.json();
  const fullLengthVideo = videosData.items.find((video: {
    id: string;
    contentDetails: { duration: string };
    snippet: { title: string };
  }) => {
    const duration = video.contentDetails.duration;
    // Parse ISO 8601 duration, e.g., PT5M30S
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || '0', 10);
    const minutes = parseInt(match?.[2] || '0', 10);
    const seconds = parseInt(match?.[3] || '0', 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds > 60; // not a short
  });

  if (!fullLengthVideo) {
    return NextResponse.json({ error: 'No full-length videos found' }, { status: 404 });
  }

  return NextResponse.json({
    videoId: fullLengthVideo.id,
    title: fullLengthVideo.snippet.title,
  });
}