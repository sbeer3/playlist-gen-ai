async function fetchImageAnalysis(imageFile) {
    const apiKey = "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"; // Replace with your API key
  

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1]; // Extract base64 part after comma
  
        const payload = {
          model: "gpt-4o-mini", // Use your model
          messages: [
            {role: "system", content: "You are an image sentiment analyzer, you recieve an image and return only a list of words that best describe the mood, tone, and theme of the image."},
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Give me a list of words that best describe the mood, tone, and theme of this image.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        };
  
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        };
  
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          });
  
          const data = await response.json();
          resolve(data.choices[0].message.content.trim()); // Resolve the promise with the content
        } catch (error) {
          console.error("Error fetching the response from OpenAI:", error);
          resolve("Sorry, there was an error processing your request.");
        }
      };
    });
  }

  window.fetchImageAnalysis = fetchImageAnalysis;