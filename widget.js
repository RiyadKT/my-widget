document.addEventListener('DOMContentLoaded', () => {
    const toggleWidgetButton = document.getElementById('toggleWidget');
    const widget = document.getElementById('widget');
    const closeWidget = document.getElementById("closeWidget");
    const widgetBubble = document.getElementById("widgetBubble");
    const toggleWidget = document.getElementById("toggleWidget");
    const findPerfumeButton = document.getElementById('findPerfumeButton');
    const noteContainer = document.getElementById('note-container');
    const perfumeDisplay = document.getElementById('perfumeDisplay');
    const goBackButton = document.getElementById('goBackButton');   
    const notes = document.querySelectorAll(".note"); // Select all note buttons
    const responseContainer = document.getElementById("responseContainer");
    
    
    let selectedNotes = []; // Track selected notes

  
    
    // Open the widget when clicking the bubble
    widgetBubble.addEventListener("click", function() {
        widget.classList.remove("hidden");
        widgetBubble.classList.add("hidden"); // Hide bubble when widget is open
    });

    // Close the widget when clicking the close button
    closeWidget.addEventListener("click", function() {
        widget.classList.add("hidden");
        widgetBubble.classList.remove("hidden"); // Show bubble when widget is closed
    });
    

    // Go back to notes
    goBackButton.addEventListener('click', () => {
        noteContainer.style.display = 'flex';
        findPerfumeButton.classList.remove("hidden")
        perfumeDisplay.classList.add('hidden');
        responseContainer.innerHTML = ""; // Clear any error message
        selectedNotes = []; // Clear selected notes array
        notes.forEach(button => {
            button.classList.remove("selected"); // Remove selected state
        });
    });

    // Handle Note Selection
    notes.forEach(button => {
        button.addEventListener("click", function () {
            const note = this.getAttribute("data-value"); // Get note value

            if (selectedNotes.includes(note)) {
                // Deselect the note
                selectedNotes = selectedNotes.filter(n => n !== note);
                this.classList.remove("selected");
            } else {
                // Select the note
                selectedNotes.push(note);
                this.classList.add("selected");
            }
        });
    });

    // Find perfume
    findPerfumeButton.addEventListener('click', async () => {
        const selectedNotes = Array.from(document.querySelectorAll('.note.selected')).map(note => note.dataset.value);
        const userMessage = `I'm looking for a perfume with the following notes: ${selectedNotes.join(', ')}`;
        
        if (selectedNotes.length === 0) {
            responseContainer.innerHTML = "<p>Please select at least one note.</p>";
            return;
        }
        
        responseContainer.innerHTML = ""; // Clear error if valid selection

        try {
            const response = await fetch('https://68d3-46-193-3-89.ngrok-free.app/recommend', {
                method: 'POST',
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

            // Hide note buttons and show perfume display
            noteContainer.style.display = "none"; // Hide note buttons
            findPerfumeButton.classList.add("hidden"); // Hide button
            perfumeDisplay.classList.remove("hidden"); // Show perfume display

            // Update perfume name and image
            const perfumeName = document.getElementById("perfumeName");
            const perfumeImage = document.getElementById("perfumeImage");
            perfumeName.textContent = data.recommendation;
            perfumeImage.src = getPerfumeImage(data.recommendation); // Get image URL based on recommendation
        } catch (error) {
            console.error("Fetch Error:", error);
            displayError("Error fetching recommendation. Please try again.");
        }
    });

    // Function to get perfume image URL based on recommendation
    function getPerfumeImage(recommendation) {
        const perfumeImages = {
            "Chanel No. 5": "images/chanel-no5.jpg",
            "YSL La Nuit de l'Homme": "images/ysl-opium.jpg",
            "Acqua di Gio.": "images/acqua-di-gio.jpg",
            "Dior Sauvage": "images/dior-sauvage.jpg",
            "Mugler Angel": "images/mugler-angel.jpg"
        };

        return perfumeImages[recommendation] || "images/default.jpg"; // Fallback to a default image
    }

    // Function to display error messages inside the widget
    function displayError(message) {
        responseContainer.innerHTML = `<p style="color: red;">${message}</p>`;
    }
});
