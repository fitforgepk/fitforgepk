// Node.js script to reframe product images for online store look
// Usage: node reframe-images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const collections = [
  {
    src: path.join(__dirname, 'src/assets/mens-collection'),
    dest: path.join(__dirname, 'src/assets/mens-collection-framed'),
  },
  {
    src: path.join(__dirname, 'src/assets/womens-collection'),
    dest: path.join(__dirname, 'src/assets/womens-collection-framed'),
  },
];

const TARGET_WIDTH = 1000;
const TARGET_HEIGHT = 1250;

function getDominantEdgeColor(imageBuffer, width, height) {
  // Sample pixels from the edges and return the most common color
  // For simplicity, sample corners and average them
  return sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const channels = info.channels;
      const getPixel = (x, y) => {
        const idx = (y * info.width + x) * channels;
        return [data[idx], data[idx + 1], data[idx + 2]];
      };
      const samples = [
        getPixel(0, 0),
        getPixel(info.width - 1, 0),
        getPixel(0, info.height - 1),
        getPixel(info.width - 1, info.height - 1),
      ];
      const avg = samples.reduce(
        (acc, val) => acc.map((c, i) => c + val[i]),
        [0, 0, 0]
      ).map((c) => Math.round(c / samples.length));
      return { r: avg[0], g: avg[1], b: avg[2] };
    });
}

async function processImage(srcPath, destPath) {
  const image = sharp(srcPath);
  const metadata = await image.metadata();
  const buffer = await image.toBuffer();
  const bgColor = await getDominantEdgeColor(buffer, metadata.width, metadata.height);

  // Special zoom-out for specific images
  const fileName = path.basename(srcPath);
  const isBeigeBoy = ["beigeboyfront.jpg", "beigeboyback.jpg"].includes(fileName);

  let resizeOptions;
  if (isBeigeBoy) {
    // Zoom out: fit to 80% of canvas height
    resizeOptions = {
      width: Math.round(TARGET_WIDTH * 0.8),
      height: Math.round(TARGET_HEIGHT * 0.8),
      fit: 'contain',
      background: { r: bgColor.r, g: bgColor.g, b: bgColor.b, alpha: 1 },
    };
  } else {
    resizeOptions = {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      fit: 'contain',
      background: { r: bgColor.r, g: bgColor.g, b: bgColor.b, alpha: 1 },
    };
  }

  // Create a blank canvas
  const canvas = sharp({
    create: {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      channels: 3,
      background: { r: bgColor.r, g: bgColor.g, b: bgColor.b },
    },
  });

  // Resize the image
  const resizedBuffer = await image.resize(resizeOptions).toBuffer();
  const resizedMeta = await sharp(resizedBuffer).metadata();

  // Composite the resized image onto the center of the canvas
  await canvas
    .composite([
      {
        input: resizedBuffer,
        left: Math.round((TARGET_WIDTH - resizedMeta.width) / 2),
        top: Math.round((TARGET_HEIGHT - resizedMeta.height) / 2),
      },
    ])
    .toFile(destPath);
  console.log(`Processed: ${destPath}`);
}

async function processCollection({ src, dest }) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
  const files = fs.readdirSync(src).filter(f => f.match(/\.(jpe?g|png)$/i));
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file.replace(/\.(jpe?g)$/i, '.png'));
    await processImage(srcPath, destPath);
  }
}

(async () => {
  for (const collection of collections) {
    await processCollection(collection);
  }
  console.log('All images processed.');
})(); 