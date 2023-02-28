import * as fs from "fs";
import * as path from "path";
import { createCanvas, loadImage, Canvas } from "canvas";

async function addTextToImage(
  inputImagePath: string,
  outputImagePath: string,
  text: string,
  fontFamily: string,
  fontSize: number,
  fontColor: string
) {
  // Load the input image using Canvas
  const image = await loadImage(inputImagePath);

  // Create a new canvas instance with the same size as the input image
  const canvas = createCanvas(image.width, image.height);

  // Draw the input image on the canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Set the font properties
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Calculate the position to draw the text at (the center of the canvas)
  const x = canvas.width / 2;
  const y = canvas.height - 150;

  // Draw the text on the canvas
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#FF6DDF");
  gradient.addColorStop(0.5, "#6D7CFF");
  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);

  // Save the canvas as a PNG file
  const out = fs.createWriteStream(outputImagePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => {
    console.log(`Image saved as ${outputImagePath}`);
  });
}


const FILE = "/Users/mcanuto/Downloads/nan.png";
const inputImagePath = path.join(__dirname, "input.png");

for (let i = 0; i < 10; i++) {
  const outputImagePath = path.join(__dirname, "output_" + i + ".png");
  addTextToImage(FILE, outputImagePath, i.toString(), "Arial", 80, "#000000");
}
