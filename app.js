const API_KEY = "put_ur_own_key";
const API_URL = 'https://api.vyro.ai/v2/image/generations';

const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn"); 
const loadingText = document.getElementById("loading");
const imageResult = document.getElementById("imageResult");

const styleOptions = ["realistic", "anime", "fantasy", "3d", "digital-art", "cyberpunk"];
const randomPrompts = [
  "A futuristic robot chef cooking noodles",
  "A majestic lion wearing sunglasses",
  "A castle floating in the sky",
  "Cute cat astronaut on Mars",
  "Underwater city made of crystals",
  "A panda surfing in Hawaii"
];

promptInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    generateBtn.click();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  promptInput.focus(); 
});

randomBtn.addEventListener("click", () => {
  const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
  const randomStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
  const randomSeed = Math.floor(Math.random() * 10000).toString();

  promptInput.value = randomPrompt;
  promptInput.dataset.randomStyle = randomStyle;
  promptInput.dataset.randomSeed = randomSeed;

  generateBtn.click(); 
});

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  const style = promptInput.dataset.randomStyle || "realistic";
  const seed = promptInput.dataset.randomSeed || "5";

  loadingText.innerText = ``;
  loadingText.style.display = "block";
  imageResult.innerHTML = "";

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("style", style);
    formData.append("aspect_ratio", "16:9");
    formData.append("seed", seed);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to generate image");

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = "Generated Image";
    imgElement.style.maxWidth = "100%";
    imageResult.appendChild(imgElement);

    const downloadBtn = document.createElement("a");
    downloadBtn.href = imageUrl;
    downloadBtn.download = "generated-image.png";
    downloadBtn.textContent = "⬇️ Download Image";
    downloadBtn.className = "download-btn";
    imageResult.appendChild(downloadBtn);

  } catch (err) {
    alert("Failed to generate image: " + err.message);
    console.error(err);
  } finally {
    loadingText.style.display = "none";

    delete promptInput.dataset.randomStyle;
    delete promptInput.dataset.randomSeed;
  }
});
