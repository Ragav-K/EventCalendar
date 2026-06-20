const API_URL = "https://eventcalendar-pode.onrender.com";

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const modalDate = document.getElementById("modalDate");
const eventList = document.getElementById("eventList");
const viewEventModal = document.getElementById("viewEventModal");

const today = new Date();

let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let events = [];

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function formatDate(year, month, day) {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
}

function getEventsForDate(date) {
    return events.filter(function(event) {
        return event.date === date;
    });
}

function addEventTitles(dateBox, dayEvents) {
    dayEvents.forEach(function(event) {
        const eventTitle = document.createElement("div");
        eventTitle.classList.add("calendar-event-title");
        eventTitle.textContent = event.title;
        dateBox.appendChild(eventTitle);
    });
}

function showEventsForDate(day, date, dayEvents) {
    modalDate.textContent = `${day} ${monthNames[currentMonth]} ${currentYear}`;
    eventList.innerHTML = "";

    if (dayEvents.length === 0) {
        eventList.textContent = "No events for this day.";
    } else {
        dayEvents.forEach(function(event) {
            const eventItem = document.createElement("div");
            eventItem.classList.add("event-card");
            eventItem.textContent = event.title;
            eventList.appendChild(eventItem);
        });
    }

    viewEventModal.style.display = "block";
}

function drawCalendar() {
    calendar.innerHTML = "";

    monthYear.textContent =
        monthNames[currentMonth] + " " + currentYear;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyBox = document.createElement("div");
        calendar.appendChild(emptyBox);
    }

    for (let day = 1; day <= totalDays; day++) {
        const date = formatDate(currentYear, currentMonth, day);
        const dayEvents = getEventsForDate(date);

        const dateBox = document.createElement("div");
        const dayNumber = document.createElement("div");

        dateBox.classList.add("day");
        dayNumber.textContent = day;
        dateBox.appendChild(dayNumber);

        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            dateBox.classList.add("today");
        }

        addEventTitles(dateBox, dayEvents);

        dateBox.addEventListener("click", function() {
            showEventsForDate(day, date, dayEvents);
        });

        calendar.appendChild(dateBox);
    }
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || "Failed to load events");
        }

        events = data;
    } catch (error) {
        console.error(error);
        events = [];
    }

    drawCalendar();
}

document.getElementById("prevMonth").addEventListener("click", function() {
    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    drawCalendar();
});

document.getElementById("nextMonth").addEventListener("click", function() {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    drawCalendar();
});

document.getElementById("closeViewModal").addEventListener("click", function() {
    viewEventModal.style.display = "none";
});

loadEvents();