const CTAWave = () => {
  return (
    <>
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      >
        <path
          d="
          M0 160
          C100 105 175 185 260 245
          C340 310 450 300 515 340
          C560 370 575 375 600 375
          C625 375 640 370 685 340
          C750 300 860 310 940 245
          C1025 185 1100 105 1200 160
          L1200 400
          L0 400
          Z
        "
          fill="#D3EAF7"
          opacity="0.75"
        />
        <path
          d="
          M0 280
          C110 220 180 300 265 335
          C360 390 440 375 500 388
          C550 398 570 395 600 395
          C630 395 650 398 700 388
          C760 375 840 390 935 335
          C1020 300 1090 220 1200 280
          L1200 400
          L0 400
          Z
        "
          fill="#A9D8EC"
          opacity="0.6"
        />
      </svg>
    </>
  );
};

export default CTAWave;
