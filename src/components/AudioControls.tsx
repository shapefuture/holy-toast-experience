
interface AudioControlsProps {
  audioStarted: boolean;
  isLoading: boolean;
  onStartAudio: () => void;
}

const AudioControls = ({ audioStarted, isLoading, onStartAudio }: AudioControlsProps) => {
  if (audioStarted || isLoading) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="text-center text-white p-8 rounded-lg bg-gradient-to-b from-orange-800 to-yellow-700">
        <div className="text-4xl mb-4">🍞✨</div>
        <h2 className="text-2xl font-bold mb-4">Enter the Sacred AR Bread Realm</h2>
        <p className="mb-6">Move your device to explore the divine tunnel</p>
        <button
          onClick={onStartAudio}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          🎵 Enter Sacred AR Tunnel 🍞
        </button>
      </div>
    </div>
  );
};

export default AudioControls;
