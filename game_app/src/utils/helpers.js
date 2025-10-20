export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
