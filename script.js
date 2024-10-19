const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu",
    "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu",
    "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
];

let events = {};
let isLoggedIn = false;


function openModal(day) {
    if (!isLoggedIn) {
        alert("Sinun täytyy kirjautua sisään lisätäksesi tapahtumia.");
        return;
    }
    
    const eventDateInput = document.getElementById('eventDate');
    eventDateInput.value = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    document.getElementById('eventModal').style.display = 'block'; 
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none'; 
}

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventName = document.getElementById('eventName').value.trim();
    const eventDate = document.getElementById('eventDate').value;

    if (!eventName || !eventDate) {
        alert("Anna tapahtuman nimi ja valitse päivämäärä.");
        return;
    }

    if (!events[eventDate]) {
        events[eventDate] = [];
    }
    events[eventDate].push(eventName);

    saveEvents();
    this.reset();
    closeModal();
    renderCalendar(currentMonth, currentYear);
    displayEvents();
});


function renderCalendar(month, year) {
    calendarDays.innerHTML = '';
    let firstDay = new Date(year, month).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    monthYear.textContent = `${months[month]} ${year}`;

   
    for (let i = 0; i < firstDay; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.innerHTML = '';
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.style.position = 'relative';

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        const key = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (events[key] && events[key].length > 0) {
            let eventDot = document.createElement('span');
            eventDot.style.width = '8px';
            eventDot.style.height = '8px';
            eventDot.style.backgroundColor = 'red';
            eventDot.style.borderRadius = '50%';
            eventDot.style.position = 'absolute';
            eventDot.style.bottom = '5px';
            eventDot.style.left = '50%';
            eventDot.style.transform = 'translateX(-50%)';
            dayCell.appendChild(eventDot);
        }

        dayCell.addEventListener('click', () => openModal(day));
        calendarDays.appendChild(dayCell);
    }

    displayEvents();
}


prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});


if (localStorage.getItem('events')) {
    events = JSON.parse(localStorage.getItem('events'));
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}


function displayEvents() {
    const eventsList = document.getElementById("eventsList");
    eventsList.innerHTML = "";

    for (const key in events) {
        const eventList = events[key];
        eventList.forEach(event => {
            const li = document.createElement("li");
            li.textContent = `${key}: ${event}`;
            eventsList.appendChild(li);
        });
    }
}


const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginBtn");
const closeLoginSpan = document.getElementsByClassName("close")[0];

openLoginBtn.onclick = function() {
    loginModal.style.display = "block";
}

function closeLoginModal() {
    loginModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === loginModal) {
        closeLoginModal();
    }
}

const validUsername = "testi";
const validPassword = "qwerty123";

document.getElementById("loginForm").onsubmit = function(e) {
    e.preventDefault(); 
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === validUsername && password === validPassword) {
        alert("Kirjautuminen onnistui!");
        isLoggedIn = true;
        loginModal.style.display = "none";
        document.getElementById('logoutBtn').style.display = "block"; 
        displayEvents(); 
    } else {
        alert("Virheellinen käyttäjätunnus tai salasana!");
    }
};


document.getElementById("logoutBtn").addEventListener("click", function() {
    if (confirm("Haluatko varmasti kirjautua ulos ja poistaa kaikki tapahtumat?")) {
        events = {};
        saveEvents(); 
        
        displayEvents(); 

        document.getElementById("logoutBtn").style.display = "none"; 
        isLoggedIn = false; 
        renderCalendar(currentMonth, currentYear); 

        alert("Olet kirjautunut ulos ja tapahtumat on poistettu.");
    }
});


renderCalendar(currentMonth, currentYear);
