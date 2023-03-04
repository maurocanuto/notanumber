import * as fs from 'fs'
import { createCanvas, loadImage, Canvas } from 'canvas'

export async function addTextToImage(
  inputImagePath: string,
  outputImagePath: string,
  text: string,
  fontFamily: string,
  fontSize: number,
  fontColor: string
): Promise<string> {
  const image = await loadImage(inputImagePath)
  const canvas = createCanvas(image.width, image.height)

  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, image.width, image.height)

  // Set the font properties
  ctx.font = `${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Calculate the position to draw the text at (the center of the canvas)
  const x = canvas.width / 2
  const y = canvas.height - 150

  // Draw the text on the canvas
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, '#FF6DDF')
  gradient.addColorStop(0.5, '#6D7CFF')
  ctx.fillStyle = gradient
  ctx.fillText(text, x, y)

  // Save the canvas as a PNG file
  const out = fs.createWriteStream(outputImagePath)
  const stream = canvas.createPNGStream()
  stream.pipe(out)

  return await new Promise((resolve, reject) => {
    out
      .on('finish', () => {
        console.log(`Image saved as ${outputImagePath}`)
        resolve(outputImagePath)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}
