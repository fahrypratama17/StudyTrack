const WaveBackground = () => {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-0 w-full"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="h-35 w-full"
      >
        <path
          d="M0,65 C200,135 350,0 570,75 C770,150 930,0 1110,65 C1250,105 1350,30 1440,60 L1440,160 L0,160 Z"
          fill="#A9D8EC"
          opacity="0.7"
        />
        <path
          d="M0,100 C220,35 400,155 650,95 C880,35 1090,155 1440,80 L1440,160 L0,160 Z"
          fill="#D3EAF7"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export default WaveBackground;
