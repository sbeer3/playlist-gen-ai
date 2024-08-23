async function generatePlaylistFromWords(listOfWords) {
    const apiKey = "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"; // Replace with your API key
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
    const tools = [
        {
            "type": "function",
            "function": {
                "name": "generate_playlist",
                "description": "Generate a playlist based on a list of descriptive words.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "songs": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "description": "An array of song names that match the artists."
                        },
                        "artists": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "description": "array of artist names that match the song names."
                        }
                    },
                    "required": ["songs", "artists"],
                },
            }
        }
    ];

    const messages = [
        {
            role: "system",
            content: "You are a playlist generator. You receive a list of words that describe an image and use the 'generate_playlist' function to return a JSON array of dictionaries. Each dictionary contains a 'title' and 'artist' key with values corresponding to a song title and artist name. Provide 10 unique songs that fit the theme of the image."
        },
        {
            role: "user",
            content: "Please generate a playlist using these words: " + listOfWords.join(", "),
        }
    ];
        const payload = {
            model: "gpt-4o", // Use your model
            messages: messages,
            tools: tools,
            tool_choice: "auto",
          };
    try {



          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          });
          const data = await response.json();
        console.log("Playlist generation response:", JSON.parse(data.choices[0].message.tool_calls[0].function.arguments));
        return JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
    } catch (error) {
        console.error("Error generating playlist:", error.message);
        return []; // Return an empty array as a fallback in case of error
    }
}

window.generatePlaylistFromWords = generatePlaylistFromWords;