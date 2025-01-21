const videoInput = document.getElementById("videoInput");
const mainVideo = document.getElementById("mainVideo");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const corruptionSlider = document.getElementById("corruptionLevel");
const corruptionValue = document.getElementById("corruptionValue");
const glitchRGBCheckbox = document.getElementById("glitchRGB");
const invertColorsCheckbox = document.getElementById("invertColors");
const apocalypseBtn = document.getElementById("apocalypseBtn");

const frameBuffer = [];
const bufferSize = 50;
let isProcessing = false;
let apocalypseMode = false;
let invertToggle = false;

// Automatically toggle color inversion every second
setInterval(() => {
  if (invertColorsCheckbox.checked) {
    invertToggle = !invertToggle;
  }
}, 1000);

videoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  mainVideo.src = url;
  mainVideo.crossOrigin = "anonymous";

  mainVideo.addEventListener("loadeddata", () => {
    canvas.width = mainVideo.videoWidth;
    canvas.height = mainVideo.videoHeight;
    mainVideo.play();
    corruptVideo();
  });
});

corruptionSlider.addEventListener("input", () => {
  corruptionValue.textContent = corruptionSlider.value;
});

apocalypseBtn.addEventListener("click", () => {
  apocalypseMode = !apocalypseMode;
  if (apocalypseMode) {
    apocalypseBtn.textContent = "😱 The Chaos Has Begun! 😱";
    apocalypseBtn.style.background = "red";
  } else {
    apocalypseBtn.textContent = "🔥 Start the Apocalypse 🔥";
    apocalypseBtn.style.background = "";
  }
});

function corruptVideo() {
  function draw() {
    if (mainVideo.paused || mainVideo.ended) return;

    // Draw the video first
    ctx.drawImage(mainVideo, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    frameBuffer.push(frame);

    if (frameBuffer.length > bufferSize) {
      frameBuffer.shift();
    }

    let corruptionIntensity = apocalypseMode ? 15 : parseInt(corruptionSlider.value);

    // Show the video even in apocalypse mode, but with extreme corruption
    if (frameBuffer.length > 5) {
      for (let i = 0; i < corruptionIntensity; i++) {
        const randomFrame = frameBuffer[Math.floor(Math.random() * frameBuffer.length)];

        const sw = Math.random() * (canvas.width / (apocalypseMode ? 2 : 2));
        const sh = Math.random() * (canvas.height / (apocalypseMode ? 2 : 2));
        const sx = Math.random() * (canvas.width - sw);
        const sy = Math.random() * (canvas.height - sh);
        const dx = Math.random() * (canvas.width - sw);
        const dy = Math.random() * (canvas.height - sh);

        ctx.putImageData(randomFrame, dx, dy, sx, sy, sw, sh);
      }
    }

    // Apply effects depending on the mode
    if (glitchRGBCheckbox.checked || apocalypseMode) {
      glitchRGB();
    }

    if (invertToggle || apocalypseMode) {
      invertColors();
    }

    if (apocalypseMode) {
      crazyColors();
      motionBlur();
      screenNoise();
    }

    requestAnimationFrame(draw);
  }

  if (!isProcessing) {
    isProcessing = true;
    draw();
  }
}

// Extreme RGB glitch
function glitchRGB() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const shiftAmount = Math.floor(Math.random() * (apocalypseMode ? 20 : 10)) - 5;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i + shiftAmount] || data[i];
    data[i + 1] = data[i + 1 - shiftAmount] || data[i + 1];
    data[i + 2] = data[i + 2 + shiftAmount] || data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);
}

// Color inversion
function invertColors() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);
}

// Crazy colors
function crazyColors() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = (data[i] + Math.random() * 255) % 255;
    data[i + 1] = (data[i + 1] + Math.random() * 255) % 255;
    data[i + 2] = (data[i + 2] + Math.random() * 255) % 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

// Motion blur effect
function motionBlur() {
  ctx.globalAlpha = 0.7;
  ctx.drawImage(canvas, 0, 0);
  ctx.globalAlpha = 1.0;
}

// Constant screen noise
function screenNoise() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Add random noise to color channels
    data[i] += Math.floor(Math.random() * 20) - 10;
    data[i + 1] += Math.floor(Math.random() * 20) - 10;
    data[i + 2] += Math.floor(Math.random() * 20) - 10;
  }

  ctx.putImageData(imageData, 0, 0);
}
