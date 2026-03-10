/**
 * 将 hex 颜色 + 透明度 转为 rgba 字符串
 * @param {string} hex  - 如 "#409eff"
 * @param {number} opacity - 0~100
 */
export function hexToRgba(hex, opacity = 100) {
  if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${opacity / 100})`
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return `rgba(0,0,0,${opacity / 100})`
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}
