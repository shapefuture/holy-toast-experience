
interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-yellow-800 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-pulse">🍞</div>
        <div className="text-2xl font-bold mb-2">Constructing Sacred AR Bread Tunnel...</div>
        <div className="text-lg opacity-75">Preparing immersive Cheesus Crust experience</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
