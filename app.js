const API_URL = 'https://api.vyro.ai/v2/image/generations';
const API_KEY = 'vk-b3a2d1A3mZBVd1FV1o3V6rjBY7qZ3VM9JUZDY2i72jUMwVE'; 

const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const loadingText = document.getElementById("loading");
const imageResult = document.getElementById("imageResult");

promptInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    generateBtn.click();
  }
});


window.addEventListener('DOMContentLoaded',()=> {
    promptInput.focus(); 
  })

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  loadingText.style.display = "block";
  imageResult.innerHTML = "";

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("style", "realistic");
    formData.append("aspect_ratio", "16:9");
    formData.append("seed", "5");

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
  }

  
});
