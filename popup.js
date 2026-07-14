let popup = null;

export function showPopup(type, message, onClose = null) {
    if (popup) {

        popup.remove();

    }

    popup = document.createElement("div");
    popup.className = "popup-overlay";

    let icon = "ℹ️";
    let title = "Melding";

    if (type === "success") {

        icon = "✅";
        title = "Gelukt";

    }

    if (type === "error") {

        icon = "❌";
        title = "Oeps";

    }

    if (type === "warning") {

        icon = "⚠️";
        title = "Opgelet";

    }

    popup.innerHTML = `

        <div class="popup">

            <div class="popup-icon">${icon}</div>

            <h2>${title}</h2>

            <p>${message}</p>

            <button id="popup-close" class="button">

                OK

            </button>

        </div>

    `;

    document.body.appendChild(popup);

    document
        .getElementById("popup-close")
        .addEventListener("click", () => {
    
            closePopup();
    
            if(typeof onClose === "function"){
    
                onClose();
    
            }
    
        });

}

export function closePopup() {

    if (!popup) return;

    popup.remove();

    popup = null;

}
