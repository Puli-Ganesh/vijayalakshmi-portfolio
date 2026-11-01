export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { powerPreference: 'low-power' }) || canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}
export function safePixelRatio(): number { return Math.min(window.devicePixelRatio || 1, window.innerWidth < 850 ? 1.3 : 1.75) }
