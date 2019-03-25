export function genOTC() {
  let text = ''
  for (let i = 0; i < 8; i++) {
    text += Math.floor(Math.random() * 10).toString()
  }
  return text
}
