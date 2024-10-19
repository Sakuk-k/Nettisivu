// Lataa tallennetut viestit LocalStoragesta
function loadMessages() {
    let storedMessages = localStorage.getItem("chatMessages");
    let messagesContainer = document.getElementById("messages");

    if (storedMessages) {
        messagesContainer.innerHTML = storedMessages;
    }
}

// Tallenna uusi viesti ja päivitä LocalStorage
function sendMessage() {
    let username = document.getElementById("username").value;
    let message = document.getElementById("message").value;
    let messagesContainer = document.getElementById("messages");

    if (username === "" || message === "") {
        alert("Täytä nimimerkki ja viesti!");
        return;
    }

    let newMessage = `
        <div class="message">
            <p><strong>${username}</strong>: ${message}</p>
            <small>${new Date().toLocaleString()}</small>
        </div>
    `;

    messagesContainer.innerHTML += newMessage;
    localStorage.setItem("chatMessages", messagesContainer.innerHTML);

    document.getElementById("message").value = "";
}

// Funktio chatin tyhjentämiseen koodilla
function clearChat() {
    let code = prompt("Syötä koodi tyhjentääksesi chatti (esim. 1234):");

    if (code === "1234") {  // Oikea koodi
        localStorage.removeItem("chatMessages"); // Tyhjennä LocalStorage
        document.getElementById("messages").innerHTML = ""; // Tyhjennä viestit sivulla
        alert("Chatti on tyhjennetty!");
    } else {
        alert("Väärä koodi, chattiä ei tyhjennetty.");
    }
}

// Lataa viestit, kun sivu ladataan
window.onload = loadMessages;
