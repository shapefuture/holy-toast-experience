
const UIOverlay = () => {
  return (
    <>
      <div className="absolute top-4 left-4 text-white z-30">
        <h1 className="text-2xl font-bold mb-2 text-shadow-lg">🍞 Sacred AR Bread Tunnel ✨</h1>
        <p className="text-sm opacity-75">Move your device to explore</p>
      </div>

      <div className="absolute bottom-4 right-4 text-white text-sm opacity-75 z-30">
        <p>📱 Tilt device to look around</p>
        <p>👆 Touch & drag to move</p>
        <p>🎵 Spatial divine audio</p>
      </div>
    </>
  );
};

export default UIOverlay;
