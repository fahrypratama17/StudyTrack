const TaskWave = () => {
  return (
    <svg
      viewBox="0 0 500 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-35"
    >
      <path
        d="
      M180 200
      C230 200 265 155 320 135
      C380 110 435 135 500 65
      L500 200
      Z
    "
        fill="#D3EAF7"
      />

      <path
        d="
      M260 200
      C320 200 365 170 405 155
      C450 135 475 165 500 125
      L500 200
      Z
    "
        fill="#A9D8EC"
      />
    </svg>
  );
};

export default TaskWave;
