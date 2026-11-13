const DashboardWave = () => {
  return (
    <svg
      viewBox="0 0 1200 320"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20"
    >
      <path
        d="
      M0 310
      C150 290 230 260 340 280
      C470 310 530 330 650 230
      C770 130 810 260 950 120
      C1050 20 1120 150 1200 40
      L1200 320
      L0 320
      Z
    "
        fill="#FFFFFF"
      />

      <path
        d="
      M0 320
      C180 310 280 290 400 305
      C550 325 620 280 740 265
      C880 250 920 150 1040 180
      C1120 200 1160 210 1200 170
      L1200 320
      L0 320
      Z
    "
        fill="#BDE0F0"
      />
    </svg>
  );
};

export default DashboardWave;
