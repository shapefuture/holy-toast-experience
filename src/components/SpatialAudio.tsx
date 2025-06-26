
import { useRef } from 'react';

interface SpatialAudioProps {
  audioStarted: boolean;
}

const SpatialAudio = ({ audioStarted }: SpatialAudioProps) => {
  const audioRef = useRef<HTMLIFrameElement>(null);

  if (!audioStarted) return null;

  return (
    <iframe
      ref={audioRef}
      className="absolute -left-full -top-full opacity-0 pointer-events-none w-1 h-1"
      src="https://www.youtube.com/embed/f6O0Ye5BPBk?autoplay=1&loop=1&playlist=f6O0Ye5BPBk&controls=0&mute=0"
      allow="autoplay"
      title="Sacred Audio"
    />
  );
};

export default SpatialAudio;
