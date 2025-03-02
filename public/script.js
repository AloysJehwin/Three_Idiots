document.querySelectorAll(".image-container").forEach(container => {
    container.addEventListener("mouseenter", function () {
        let textElement = this.querySelector(".typing-text");
        let fullText = textElement.getAttribute("data-text"); // Get full text
        if (!fullText || textElement.dataset.typing) return; // Prevent retriggering

        textElement.dataset.typing = "true"; // Mark as typing
        textElement.textContent = ""; // Clear content
        textElement.style.width = "auto"; // Allow dynamic expansion

        let i = 0;
        function typeEffect() {
            if (i < fullText.length) {
                textElement.textContent += fullText.charAt(i);
                i++;
                setTimeout(typeEffect, 100); // Adjust speed (100ms per letter)
            } else {
                delete textElement.dataset.typing; // Reset for retyping
            }
        }
        typeEffect(); // Start typing effect
    });
});
