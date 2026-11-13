const AuthWave = () => {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="h-60 w-full md:h-80"
      >
        <path
          d="M0,100 C200,250 350,25 580,160 C800,290 1050,40 1440,140 L1440,300 L0,300 Z"
          fill="#D3EAF7"
          opacity="0.7"
        />
        <path
          d="M0,190 C240,50 400,320 730,180 C1000,60 1210,280 1440,100 L1440,300 L0,300 Z"
          fill="#A9D8EC"
          opacity="0.55"
        />
      </svg>
    </div>
  );
};

export default AuthWave;
