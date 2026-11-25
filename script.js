const eventKey = "college-event-list";
const registrationKey = "college-event-registrations";
const studentKey = "college-event-student-id";

const defaultEvents = [
  { id:"tech-fest", title:"Annual Tech Fest", template:"Technology", category:"Technology", date:"2026-12-05", time:"10:00", venue:"Main Auditorium", contact:"9876543210", email:"techfest@college.edu", description:"A day of coding challenges, project displays and technology talks.", fee:0, qr:"" },
  { id:"music-evening", title:"Music Evening", template:"Cultural", category:"Cultural", date:"2026-12-12", time:"18:00", venue:"Open-Air Stage", contact:"9876543211", email:"culture@college.edu", description:"Enjoy live performances by students from across the campus.", fee:0, qr:"" },
  { id:"sports-day", title:"College Sports Day", template:"Sports", category:"Sports", date:"2026-12-18", time:"09:00", venue:"College Ground", contact:"9876543212", email:"sports@college.edu", description:"Join the teams for track events, games and friendly matches.", fee:0, qr:"" }
];

let events = loadEvents();
let selectedEventId = "";
let lastRegisterButton = null;
let toastTimer;

const viewTitles = { dashboard:"Dashboard", events:"Browse Events", registrations:"My Registrations", admin:"Admin Overview" };
const artwork = { Technology:"💻", Cultural:"🎵", Sports:"🏆", Workshop:"🛠️", Social:"📚", Hackathon:"⌨️", Prize:"🏅" };

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[character]));
}

function loadEvents() {
  try {
    const saved = JSON.parse(localStorage.getItem(eventKey));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.error("Could not load events:", error);
  }
  localStorage.setItem(eventKey, JSON.stringify(defaultEvents));
  return [...defaultEvents];
}

function saveEvents() {
  localStorage.setItem(eventKey, JSON.stringify(events));
}

function getRegistrations() {
  try {
    const saved = JSON.parse(localStorage.getItem(registrationKey));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.error("Could not load registrations:", error);
  }
  return [];
}

function saveRegistrations(registrations) {
  try {
    localStorage.setItem(registrationKey, JSON.stringify(registrations));
    return true;
  } catch (error) {
    console.error("Could not save registrations:", error);
    alert("Registration could not be saved. Payment proof may be too large.");
    return false;
  }
}

function getStudent() {
  try {
    return JSON.parse(localStorage.getItem(studentKey)) || null;
  } catch (error) {
    console.error("Could not load student ID:", error);
    return null;
  }
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day:"numeric", month:"short", year:"numeric"
  });
}

function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-IN", {
    hour:"2-digit", minute:"2-digit"
  });
}

function createEventCard(event) {
  const category = event.category || event.template || "Technology";
  const fee = Number(event.fee || 0);
  return `
    <article class="eventcard">
      <div class="eventart eventart-${category.toLowerCase()}">
        <span class="eventart-label">${escapeHtml(event.template || category)}</span>
        <span class="eventart-icon">${artwork[category] || "✨"}</span>
      </div>
      <div class="eventcontent">
        <div class="eventtop">
          <span class="category">${escapeHtml(category)}</span>
          <span class="eventdate">${formatDate(event.date)}</span>
        </div>
        <h3>${escapeHtml(event.title)}</h3>
        <p class="eventdescription">${escapeHtml(event.description)}</p>
        <p class="eventdetails">🕒 ${escapeHtml(formatTime(event.time))}<br>📍 ${escapeHtml(event.venue)}</p>
        <p class="eventcontact">☎ ${escapeHtml(event.contact)} · ${escapeHtml(event.email)}</p>
        <span class="fee-tag ${fee > 0 ? "paid" : ""}">${fee > 0 ? `₹${fee} · Paid` : "Free Entry"}</span>
        <button class="btn" type="button" data-register="${escapeHtml(event.id)}">
          ${fee > 0 ? "Pay & Register" : "Register for event"}
        </button>
      </div>
    </article>`;
}

function renderEvents() {
  const search = document.querySelector("#search").value.trim().toLowerCase();
  const category = document.querySelector("#filter").value;
  const filtered = events.filter((event) => {
    const text = [event.title, event.category, event.template, event.venue, event.description, event.contact].join(" ").toLowerCase();
    return text.includes(search) && (category === "all" || (event.category || event.template) === category);
  });
  document.querySelector("#allEvents").innerHTML = filtered.length
    ? filtered.map(createEventCard).join("")
    : '<p class="empty">No events match your search.</p>';
}

function renderRegistrations() {
  const registrations = getRegistrations();
  document.querySelector("#myRows").innerHTML = registrations.map((item) => `
    <tr>
      <td>${escapeHtml(item.eventTitle)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.roll)}</td>
      <td>${escapeHtml(item.email)}</td>
      <td>${escapeHtml(item.phone)}</td>
      <td>${escapeHtml(item.payment)}</td>
      <td class="status">${escapeHtml(item.status)}</td>
    </tr>`).join("");

  document.querySelector("#adminRows").innerHTML = registrations.slice().reverse().map((item) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.roll)}</td>
      <td>${escapeHtml(item.eventTitle)}</td>
      <td>${escapeHtml(item.email)}</td>
      <td>${escapeHtml(item.phone)}</td>
      <td>${escapeHtml(item.payment)}</td>
      <td>${item.proof ? `<a href="${escapeHtml(item.proof)}" target="_blank" class="proof-link">View proof</a>` : "-"}</td>
      <td class="status">${escapeHtml(item.status)}</td>
    </tr>`).join("");

  document.querySelector("#myEmpty").hidden = registrations.length > 0;
  document.querySelector("#statMine").textContent = registrations.length;
  document.querySelector("#statTotal").textContent = registrations.length;
  document.querySelector("#adminRegs").textContent = registrations.length;
  document.querySelector("#adminStudents").textContent = new Set(registrations.map((item) => item.roll.toLowerCase())).size;
}

function refreshDashboard() {
  document.querySelector("#statEvents").textContent = events.length;
  document.querySelector("#adminEvents").textContent = events.length;
  document.querySelector("#featured").innerHTML = events.slice(0, 3).map(createEventCard).join("");
  renderRegistrations();
  renderEvents();
  renderStudentProfile();
}

function switchView(viewName) {
  if (!viewTitles[viewName]) return;
  document.querySelectorAll(".view").forEach((view) => {
    const active = view.id === viewName;
    view.hidden = !active;
    view.classList.toggle("active", active);
  });
  document.querySelectorAll(".navitem").forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
  document.querySelector("#crumb").textContent = viewTitles[viewName];
}

function openRegistration(eventId, button) {
  const event = events.find((item) => item.id === eventId);
  if (!event) return;
  const student = getStudent();
  if (!student) {
    openStudentModal();
    showToast("Create your Student ID before registering.");
    return;
  }

  selectedEventId = eventId;
  lastRegisterButton = button;
  document.querySelector("#modalEvent").innerHTML =
    `<strong>${escapeHtml(event.title)}</strong><br>${formatDate(event.date)} · ${escapeHtml(formatTime(event.time))} · ${escapeHtml(event.venue)}<br>Coordinator: ${escapeHtml(event.contact)} · ${escapeHtml(event.email)}`;
  document.querySelector("#name").value = student.name;
  document.querySelector("#roll").value = student.roll;
  document.querySelector("#email").value = student.email;
  document.querySelector("#phone").value = student.phone;

  const paid = Number(event.fee) > 0;
  document.querySelector("#paymentSection").hidden = !paid;
  document.querySelector("#paymentProof").required = paid;
  document.querySelector("#paymentAmount").textContent = paid ? `Amount: ₹${event.fee}` : "";
  const qr = document.querySelector("#paymentQr");
  qr.innerHTML = event.qr
    ? `<a href="${escapeHtml(event.qr)}" target="_blank">Open / Scan QR</a><small>${escapeHtml(event.qr)}</small>`
    : "Payment QR not provided";
  document.querySelector("#modalbg").hidden = false;
  document.querySelector("#name").focus();
}

function closeModal(id = "modalbg") {
  document.querySelector(`#${id}`).hidden = true;
  if (id === "modalbg") {
    document.querySelector("#regform").reset();
    selectedEventId = "";
    if (lastRegisterButton) lastRegisterButton.focus();
  }
  lastRegisterButton = null;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openStudentModal() {
  const student = getStudent();
  if (student) {
    document.querySelector("#studentName").value = student.name;
    document.querySelector("#studentRoll").value = student.roll;
    document.querySelector("#studentEmail").value = student.email;
    document.querySelector("#studentPhone").value = student.phone;
  } else {
    document.querySelector("#studentForm").reset();
  }
  document.querySelector("#studentModal").hidden = false;
  document.querySelector("#studentName").focus();
}

function renderStudentProfile() {
  const student = getStudent();
  if (!student) {
    document.querySelector("#profileName").textContent = "Create Student ID";
    document.querySelector("#profileId").textContent = "Campus member";
    document.querySelector("#profileAvatar").textContent = "S";
    return;
  }
  document.querySelector("#profileName").textContent = student.name;
  document.querySelector("#profileId").textContent = student.roll;
  document.querySelector("#profileAvatar").textContent = student.name.charAt(0).toUpperCase();
}

const templates = {
  Technology:{ category:"Technology", venue:"Main Auditorium", description:"A technology event featuring projects, talks, demonstrations and team participation." },
  Cultural:{ category:"Cultural", venue:"Open-Air Stage", description:"A cultural event showcasing performances, creativity and student talent." },
  Sports:{ category:"Sports", venue:"College Ground", description:"A sports event with team and individual participation, match schedules and live scores." },
  Workshop:{ category:"Workshop", venue:"Seminar Hall", description:"A hands-on learning session with practical activities and guided expert support." },
  Hackathon:{ category:"Hackathon", venue:"Innovation Lab", description:"Build innovative solutions with your team during a timed hackathon challenge." },
  Prize:{ category:"Prize", venue:"College Auditorium", description:"A competitive event with registration, judging rounds and prize pool rewards." },
  Social:{ category:"Social", venue:"College Campus", description:"A community-focused event with student participation and social impact activities." }
};

function openEventModal() {
  document.querySelector("#eventForm").reset();
  document.querySelector("#eventFee").value = "0";
  document.querySelector("#qrField").hidden = true;
  document.querySelector("#eventModal").hidden = false;
  document.querySelector("#eventTemplate").focus();
}

document.querySelectorAll(".navitem").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
document.querySelectorAll("[data-open-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.openView)));
document.querySelector("#search").addEventListener("input", renderEvents);
document.querySelector("#filter").addEventListener("change", renderEvents);
document.querySelector("#openStudentId").addEventListener("click", openStudentModal);
document.querySelector("#cancelStudentId").addEventListener("click", () => closeModal("studentModal"));
document.querySelector("#addEvent").addEventListener("click", openEventModal);
document.querySelector("#cancelEvent").addEventListener("click", () => closeModal("eventModal"));
document.querySelector("#cancelRegistration").addEventListener("click", () => closeModal("modalbg"));

["modalbg", "studentModal", "eventModal"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("click", (event) => {
    if (event.target.id === id) closeModal(id);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    ["modalbg", "studentModal", "eventModal"].forEach((id) => {
      if (!document.querySelector(`#${id}`).hidden) closeModal(id);
    });
  }
});

document.querySelectorAll(".eventgrid").forEach((grid) => {
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-register]");
    if (button) openRegistration(button.dataset.register, button);
  });
});

document.querySelector("#eventTemplate").addEventListener("change", (event) => {
  const template = templates[event.target.value];
  if (!template) return;
  document.querySelector("#eventVenue").value = template.venue;
  document.querySelector("#eventDescription").value = template.description;
});

document.querySelector("#eventFee").addEventListener("input", (event) => {
  document.querySelector("#qrField").hidden = Number(event.target.value) <= 0;
});

document.querySelector("#studentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const existing = getStudent();
  if (existing) {
    alert("Your Student ID is already created and cannot be recreated.");
    closeModal("studentModal");
    return;
  }
  const student = {
    id:`CC-${Date.now().toString().slice(-8)}`,
    name:document.querySelector("#studentName").value.trim(),
    roll:document.querySelector("#studentRoll").value.trim(),
    email:document.querySelector("#studentEmail").value.trim(),
    phone:document.querySelector("#studentPhone").value.trim()
  };
  localStorage.setItem(studentKey, JSON.stringify(student));
  closeModal("studentModal");
  renderStudentProfile();
  showToast(`Student ID created: ${student.id}`);
});

document.querySelector("#eventForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const templateName = document.querySelector("#eventTemplate").value;
  const template = templates[templateName];
  const fee = Number(document.querySelector("#eventFee").value);
  const newEvent = {
    id:`event-${Date.now()}`,
    title:document.querySelector("#eventTitle").value.trim(),
    template:templateName,
    category:template.category,
    date:document.querySelector("#eventDate").value,
    time:document.querySelector("#eventTime").value,
    venue:document.querySelector("#eventVenue").value.trim(),
    contact:document.querySelector("#eventContact").value.trim(),
    email:document.querySelector("#eventEmail").value.trim(),
    description:document.querySelector("#eventDescription").value.trim(),
    fee,
    qr:fee > 0 ? document.querySelector("#eventQr").value.trim() : ""
  };
  events.push(newEvent);
  saveEvents();
  closeModal("eventModal");
  refreshDashboard();
  showToast(`${newEvent.title} published.`);
});

document.querySelector("#regform").addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedEvent = events.find((item) => item.id === selectedEventId);
  const student = getStudent();
  if (!selectedEvent || !student) return;

  const name = document.querySelector("#name").value.trim();
  const roll = document.querySelector("#roll").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const registrations = getRegistrations();
  if (registrations.some((item) => item.eventId === selectedEventId && item.roll.toLowerCase() === roll.toLowerCase())) {
    alert("This Student ID is already registered for this event.");
    return;
  }

  const paid = Number(selectedEvent.fee) > 0;
  const proofInput = document.querySelector("#paymentProof");
  const readProof = () => new Promise((resolve) => {
    if (!proofInput.files.length) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(proofInput.files[0]);
  });

  readProof().then((proof) => {
    registrations.push({
      eventId:selectedEvent.id,
      eventTitle:selectedEvent.title,
      studentId:student.id,
      name,
      roll,
      email,
      phone,
      payment:paid ? `₹${selectedEvent.fee} - Pending verification` : "Free",
      proof,
      status:paid ? "Payment Submitted" : "Confirmed"
    });
    if (!saveRegistrations(registrations)) return;
    closeModal("modalbg");
    refreshDashboard();
    showToast(paid ? "Payment proof submitted." : "Registration confirmed.");
  });
});

refreshDashboard();
