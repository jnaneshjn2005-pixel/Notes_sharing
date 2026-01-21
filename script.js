/* ===============================
   SERVICE WORKER (PWA)
================================ */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ===============================
   LOGIN (ADMIN RESTRICTED)
================================ */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("username", "Admin");
      window.location.href = "admin.html";
    } else {
      alert("Invalid admin credentials");
    }
    return;
  }

  if (role === "user") {
    if (username === "") {
      alert("Please enter username");
      return;
    }
    localStorage.setItem("role", "user");
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  }
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

/* ===============================
   ROUTE PROTECTION
================================ */
const role = localStorage.getItem("role");

if (location.pathname.includes("dashboard") && role !== "user") {
  location.href = "index.html";
}
if (location.pathname.includes("admin") && role !== "admin") {
  location.href = "index.html";
}

/* ===============================
   NOTES STORAGE
================================ */
let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* ===============================
   FILE UPLOAD (USER)
================================ */
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
      favorite: false,
      rating: 0
    };

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    alert("File uploaded. Waiting for admin approval");

    fileInput.value = "";
  };

  reader.readAsText(file);
}

/* ===============================
   USER DASHBOARD – LOAD NOTES
================================ */
function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  div.innerHTML = "";
  notes
    .filter(n => n.approved)
    .forEach((n, i) => {
      div.innerHTML += `
        <div class="note">
          <h3>📄 ${n.filename}</h3>
          <p><b>Uploaded by:</b> ${n.uploadedBy}</p>
          <p>⭐ Rating: ${n.rating}/5</p>

          <button onclick="downloadNote('${n.filename}','${n.content}')">⬇️ Download</button>
          <button onclick="toggleFav(${i})">❤️ Favorite</button>
          <button onclick="rate(${i},5)">⭐ Rate</button>
        </div>
      `;
    });
}

/* ===============================
   SEARCH
================================ */
function searchNotes() {
  const q = search.value.toLowerCase();
  document.querySelectorAll(".note").forEach(n => {
    n.style.display = n.innerText.toLowerCase().includes(q) ? "block" : "none";
  });
}

/* ===============================
   DOWNLOAD
================================ */
function downloadNote(filename, content) {
  const a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  a.download = filename;
  a.click();
}

/* ===============================
   FAVORITE & RATING
================================ */
function toggleFav(index) {
  notes[index].favorite = !notes[index].favorite;
  localStorage.setItem("notes", JSON.stringify(notes));
}

function rate(index, stars) {
  notes[index].rating = stars;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

/* ===============================
   ADMIN PANEL – LOAD PENDING
================================ */
function loadAdminNotes() {
  const div = document.getElementById("pending");
  if (!div) return;

  div.innerHTML = "";
  notes.forEach((n, i) => {
    if (!n.approved) {
      div.innerHTML += `
        <div class="note">
          <h3>📄 ${n.filename}</h3>
          <p><b>Uploaded by:</b> ${n.uploadedBy}</p>

          <button onclick="approveNote(${i})">✅ Approve</button>
          <button onclick="rejectNote(${i})" style="background:#dc3545;">❌ Reject</button>
        </div>
      `;
    }
  });
}

/* ===============================
   ADMIN ACTIONS
================================ */
function approveNote(index) {
  notes[index].approved = true;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadAdminNotes();
}

function rejectNote(index) {
  if (confirm("Are you sure you want to reject this file?")) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadAdminNotes();
  }
}

/* ===============================
   DARK MODE
================================ */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ===============================
   AUTO LOAD
================================ */
loadNotes();
loadAdminNotes();

