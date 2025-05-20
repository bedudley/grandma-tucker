import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type Episode = {
  title: string;
  audioUrl: string;
  description: string;
};

const RSS_FEED_URL = 'https://feeds.megaphone.fm/RSV1597324942';

export async function GET() {
  const parser = new Parser();
  const feed = await parser.parseURL(RSS_FEED_URL);
  const latest = feed.items[0];

  const episode: Episode = {
    title: latest.title ?? 'Untitled Episode',
    audioUrl: latest.enclosure?.url ?? '',
    description: latest.contentSnippet ?? '',
  };

  return NextResponse.json(episode);
}