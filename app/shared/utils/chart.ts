export const generateHeights = (count: number, seed: number) => {
  const heights: number[] = []
  for (let i = 0; i < count; i++) {
    const base =
      25 +
      Math.sin((i + seed) * 0.5) * 20 +
      Math.cos((i + seed * 0.7) * 0.3) * 15
    heights.push(Math.max(10, Math.min(85, base)))
  }
  return heights
}
