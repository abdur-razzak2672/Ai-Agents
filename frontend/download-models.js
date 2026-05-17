const fs = require('fs');
const https = require('https');
const path = require('path');

const modelsDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const files = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'age_gender_model-weights_manifest.json',
  'age_gender_model-shard1'
];

files.forEach(file => {
  const url = baseUrl + file;
  const dest = path.join(modelsDir, file);
  https.get(url, (response) => {
    response.pipe(fs.createWriteStream(dest));
    console.log(`Downloaded ${file}`);
  }).on('error', (err) => {
    console.error(`Error downloading ${file}:`, err.message);
  });
});
