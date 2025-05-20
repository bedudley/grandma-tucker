'use client';

import { useEffect, useState } from 'react';

type Episode = {
  title: string;
  audioUrl: string;
  description: string;
};

export default function Home() {
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    fetch('/api/episode')
      .then((res) => res.json())
      .then(setEpisode)
      .catch((err) => console.error('Failed to fetch episode', err));
  }, []);

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Tucker’s Latest Episode</h1>

      {!episode && <p>Loading episode...</p>}

      {episode && (
        <>
          <h2 style={{ fontSize: '1.5rem' }}>{episode.title}</h2>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '2rem' }}>Watch Video</h3>

          {/* Video Embed */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '560px', aspectRatio: '16/9' }}>
              <iframe
                style={{ width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/7KufJvBEYZQ"
                title="Tucker Carlson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '2rem' }}>Listen to Audio</h3>

          {/* Audio Player */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
            <audio controls style={{ width: '100%', maxWidth: 500 }}>
              <source src={episode.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </>
      )}
    </main>
  );
}