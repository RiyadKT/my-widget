document.addEventListener("DOMContentLoaded", function () {
    const toggleWidget = document.getElementById("toggleWidget");
    const widget = document.getElementById("widget");
    const closeWidget = document.getElementById("closeWidget");
    const notes = document.querySelectorAll(".note"); // Select all note buttons
    const sendButton = document.getElementById("findPerfumeButton"); // Send button
    const responseContainer = document.getElementById("responseContainer");

    let selectedNotes = []; // Array to store selected notes

  

    // Handle Note Selection
    notes.forEach(button => {
        button.addEventListener("click", function () {
            const note = this.getAttribute("data-value"); // Get the note value

            if (selectedNotes.includes(note)) {
                // If the note is already selected, deselect it
                selectedNotes = selectedNotes.filter(n => n !== note);
                this.classList.remove("selected");
                this.style.backgroundColor = ""; // Reset background color
                this.style.color = ""; // Reset text color
            } else {
                // If the note is not selected, select it
                selectedNotes.push(note);
                this.classList.add("selected");
                this.style.backgroundColor = "black"; // Set background to black
                this.style.color = "white"; // Set text to white
            }
        });
    });

    // Send Selection to Backend
    sendButton.addEventListener("click", async function () {
        if (selectedNotes.length === 0) {
            // If no notes are selected, show an error message
            responseContainer.innerHTML = "<p>Please select at least one note.</p>";
            return;
        }

        // Call the getRecommendation function with the selected notes
        await getRecommendation(selectedNotes.join(", ")); // Join notes into a comma-separated string

        // Reset Selection
        selectedNotes = [];
        notes.forEach(button => {
            button.classList.remove("selected");
            button.style.backgroundColor = ""; // Reset background color
            button.style.color = ""; // Reset text color
        });
    });

    // Function to fetch recommendation from the backend
    async function getRecommendation(userMessage) {
        console.log("User input being sent:", userMessage); // Debugging log

        try {
            const response = await fetch("https://a564-46-193-3-89.ngrok-free.app/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
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