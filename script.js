/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ===== LOGIN ===== */
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  // ADMIN LOGIN (STRICT)
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

  // USER LOGIN (OPEN)
  if (role === "user") {
    if (username.trim() === "") {
      alert("Enter username");
      return;
    }
    localStorage.setItem("role", "user");
    localStorage.setItem("username", username);
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

if (
  location.pathname.includes("dashboard") &&
  role !== "user" &&
  role !== "admin"
) {
  location.href = "index.html";
}

if (location.pathname.includes("admin") && role !== "admin") {
  location.href = "index.html";
}

/* ===== NOTES STORAGE ===== */
let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* ===== ADD NOTE ===== */
function uploadFile() {
  const titleInput = document.getElementById("title");
  const subjectInput = document.getElementById("subject");
  const fileInput = document.getElementById("file");

  const title = titleInput.value.trim();
  const subject = subjectInput.value.trim();
  const file = fileInput.files[0];

  if (!title || !subject || !file) {
    alert("Please enter title, subject, and select a file");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const note = {
      title: title,
      subject: subject,
      filename: file.name,
      filetype: file.type,
      data: reader.result,
      uploadedBy: localStorage.getItem("username"),
      approved: false,
      favorite: false,
      rating: 0
    };

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    alert("File uploaded. Waiting for admin approval");

    titleInput.value = "";
    subjectInput.value = "";
    fileInput.value = "";
  };

  reader.readAsDataURL(file);
}


/* ===== LOAD USER NOTES ===== */
function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  const role = localStorage.getItem("role");
  div.innerHTML = "";

  notes.filter(n => n.approved).forEach((n, i) => {
    div.innerHTML += `
      <div class="note" style="position:relative;">

        ${role === "admin" ? `
          <span onclick="adminDelete(${i})"
                style="position:absolute;top:8px;right:8px;
                       cursor:pointer;color:red;font-size:18px;">
            🗑️
          </span>` : ""}

        <h3>📘 ${n.title}</h3>
        <p><b>Subject:</b> ${n.subject}</p>
        <p><b>File:</b> ${n.filename}</p>
        <p><b>Uploaded by:</b> ${n.uploadedBy}</p>
        <p>⭐ Rating: ${n.rating}/5</p>

        <button onclick="downloadNote('${n.filename}','${n.data}')">⬇️ Download</button>
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
function downloadNote(filename, data) {
  const a = document.createElement("a");
  a.href = data;          // Base64 data
  a.download = filename; // original filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
    <h3>📄 ${n.filename}</h3>
    <p><b>Uploaded by:</b> ${n.uploadedBy}</p>

    <button onclick="approveNote(${i})">✅ Approve</button>
    <button onclick="rejectNote(${i})" style="background:#dc3545;">❌ Reject</button>
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
function adminDelete(index) {
  // Extra safety: only admin can delete
  if (localStorage.getItem("role") !== "admin") {
    alert("You are not authorized");
    return;
  }

  // Confirmation popup
  if (confirm("Admin: Are you sure you want to delete this file?")) {
    notes.splice(index, 1); // remove file
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();        // refresh user list
    loadAdminNotes();   // refresh admin list
  }
}

function rejectNote(index) {
  if (confirm("Are you sure you want to reject this file?")) {
    notes.splice(index, 1);   // removes the file permanently
    localStorage.setItem("notes", JSON.stringify(notes));
    loadAdminNotes();
  }
}

/* ===== DARK MODE ===== */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ===== AUTO LOAD ===== */
loadNotes();
loadAdminNotes();



