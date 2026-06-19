const form = document.getElementById("eventForm");
const eventDateInput = document.getElementById("eventDate");
const eventNameInput = document.getElementById("eventName");
const messageBox = document.getElementById("messageBox");
const calendarButton = document.getElementById("viewCalendar");

const today = new Date().toISOString().split("T")[0];
eventDateInput.min = today;

function showMessage(message, type) {
    messageBox.style.display = "block";
    messageBox.textContent = message;

    if (type === "error") {
        messageBox.style.backgroundColor = "#f8d7da";
        messageBox.style.color = "#721c24";
        messageBox.style.borderColor = "#f5c6cb";
    } else {
        messageBox.style.backgroundColor = "#d4edda";
        messageBox.style.color = "#155724";
        messageBox.style.borderColor = "#c3e6cb";
    }

    setTimeout(function(){
        messageBox.style.display = "none";
    }, 3000);
}

form.addEventListener("submit", async function(event){
    event.preventDefault();
    
    const eventTitle = eventNameInput.value.trim();
    const eventDate = eventDateInput.value;

    if (!eventTitle || !eventDate) {
        showMessage("Please enter both event title and event date.", "error");
        return;
    }

    try {
        const response = await fetch("/events", {
            method : "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                title: eventTitle,
                date: eventDate
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || "Failed to save event");
        }

        form.reset();
        eventDateInput.min = today;
        showMessage("Event Added Successfully", "success");
    } catch (error) {
        showMessage(error.message, "error");
    }
});


calendarButton.addEventListener("click", function(){
    window.location.href = "calendar.html";
});
