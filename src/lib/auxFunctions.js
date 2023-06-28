export const secondsToHHMMSS = (seconds, ajustar) => {
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor(seconds / 60) % 60;
  const ss = Math.floor(seconds % 60);

  if (ajustar) {
    return [hh, mm, ss]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  } else {
    return [hh, mm, ss].map((v) => (v < 10 ? "0" + v : v)).join(":");
  }
};
