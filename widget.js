document.addEventListener("DOMContentLoaded", function () {
    const toggleWidget = document.getElementById("toggleWidget");
    const widget = document.getElementById("widget");
    const closeWidget = document.getElementById("closeWidget");
    const sendButton = document.getElementById("sendButton");
    const userInputField = document.getElementById("userInput");
    const responseContainer = document.getElementById("responseContainer");

    userInputField.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission (if inside a form)
            sendButton.click(); // ✅ Triggers the button click
            userInputField.value = ""; // ✅ Clears input field
        }
    });

    if (!toggleWidget || !widget || !closeWidget || !sendButton || !userInputField || !responseContainer) {
        console.error("One or more required elements are missing in HTML.");
        return;
    }

    // Open widget & hide bubble
    toggleWidget.addEventListener("click", function () {
        widget.classList.remove("hidden");
        toggleWidget.style.display = "none"; // Hide floating button
    });

    // Close widget & show bubble again
    closeWidget.addEventListener("click", function () {
        widget.classList.add("hidden");
        toggleWidget.style.display = "block"; // Show floating button again
    });

    // Send user input to Flask server
    sendButton.addEventListener("click", function () {
        const userMessage = userInputField.value.trim();
        if (!userMessage) {
            responseContainer.innerHTML = "<p>Please enter a description.</p>";
            return;
        }
    
        getRecommendation(userMessage);
        userInputField.value = ""; // ✅ Clears input field
    });
    

    async function getRecommendation(userMessage) {
        console.log("User input being sent:", userMessage);  // Debugging log

        try {
            const response = await fetch("https://98f8-46-193-3-89.ngrok-free.app/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage }) // Send user input as JSON
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch recommendation: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Server response:", data);

            // Display recommendation in the widget
            responseContainer.innerHTML = `<p><strong>Recommendation:</strong> ${data.recommendation}</p>`;
        } catch (error) {
            console.error("Fetch Error:", error);
            responseContainer.innerHTML = "<p>Error fetching recommendation. Please try again.</p>";
        }
    }
});