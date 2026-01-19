/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ===== LOGIN ===== */
function login() {
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;

  localStorage.setItem("username", username || "Anonymous");


  if (role === "admin") {
    localStorage.setItem("role", "admin");
    window.location.href = "admin.html";
  } else {
    localStorage.setItem("role", "user");
    window.location.href = "dashboard.html";
  }
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

/* ===== ROUTE PROTECTION ===== */
const role = localStorage.getItem("role");

if (location.pathname.includes("dashboard") && role !== "user") {
  location.href = "index.html";
}
if (location.pathname.includes("admin") && role !== "admin") {
  location.href = "index.html";
}

/* ===== NOTES STORAGE ===== */
let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* ===== ADD NOTE ===== */
function uploadFile() {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const note = {
      filename: file.name,
      content: reader.result,
      uploadedBy: localStorage.getItem("username"),
      approved: false,
      rating: 0
    };

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    alert("File uploaded. Waiting for admin approval");

    fileInput.value = "";
  };

  reader.readAsText(file);
}


/* ===== LOAD USER NOTES ===== */
function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  div.innerHTML = "";
  notes.filter(n => n.approved).forEach((n, i) => {
    div.innerHTML += `
      <div class="note">
        <h3>${n.title}</h3>
        <p>${n.subject}</p>
        <p>${n.content}</p>
        <p>⭐ ${n.rating}/5</p>
        <button onclick="downloadNote('${n.title}','${n.content}')">⬇️ Download</button>
        <button onclick="toggleFav(${i})">❤️ Favorite</button>
        <button onclick="rate(${i},5)">⭐ Rate</button>
      </div>
    `;
  });
}

/* ===== SEARCH ===== */
function searchNotes() {
  const q = search.value.toLowerCase();
  document.querySelectorAll(".note").forEach(n => {
    n.style.display = n.innerText.toLowerCase().includes(q) ? "block" : "none";
  });
}

/* ===== DOWNLOAD ===== */
function downloadNote(title, content) {
  const a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  a.download = title + ".txt";
  a.click();
}

/* ===== FAVORITE ===== */
function toggleFav(i) {
  notes[i].favorite = !notes[i].favorite;
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ===== RATING ===== */
function rate(i, stars) {
  notes[i].rating = stars;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

/* ===== ADMIN ===== */
function loadAdminNotes() {
  const div = document.getElementById("pending");
  if (!div) return;

  div.innerHTML = "";
  notes.forEach((n, i) => {
    if (!n.approved) {
      div.innerHTML += `
        <div class="note">
          <h3>${n.title}</h3>
          <p>${n.subject}</p>
          <p>${n.content}</p>
          <button onclick="approveNote(${i})">Approve</button>
        </div>
      `;
    }
  });
}

function approveNote(i) {
  notes[i].approved = true;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadAdminNotes();
}

/* ===== DARK MODE ===== */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ===== AUTO LOAD ===== */
loadNotes();
loadAdminNotes();



