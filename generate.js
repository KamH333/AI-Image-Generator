const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn")
        // Set the image source to the ai-generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // when the image is loaded, remove the loading class and set download attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        //send a request to the OpenAI API to generate images based on their inputs
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(response.status === 429) {
            setTimeout(() => generateAiImages(userPrompt, userImgQuantity), 60000);
        } else if(!response.ok) {
            const errorData = await response.json;
        throw new Error("failed to generate images! please try again");
        } else {
        const {data} = await response.json(); //get data from response
        updateImageCard([...data]);
        }
    } catch (error) {
        alert(error.message);
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();

    // Get user input and image quantity values from the form
    
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.target.querySelector(".img-quantity").value;

// Creating HTML markup for image cars with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
        ` <div class="img-card loading">
        <img src="walk.gif" alt="image">
        <a href="#" class="download-btn">
            <img src="download.png" alt="download icon">
        </a>
        </div>`
    ).join("");
    
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}


generateForm.addEventListener("submit", handleFormSubmission);