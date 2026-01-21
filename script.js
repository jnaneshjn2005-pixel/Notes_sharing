function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ===============================
   LOGIN
================================ */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      localStorage.clear();
      localStorage.setItem("role", "admin");
      localStorage.setItem("username", "Admin");
      window.location.href = "admin.html";
    } else {
      alert("Invalid admin credentials");
    }
    return;
  }

  if (role === "user") {
    if (!username) {
      alert("Enter username");
      return;
    }
    localStorage.clear();
    localStorage.setItem("role", "user");
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  }
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/* ===============================
   ROUTE PROTECTION (ONLY ONE)
================================ */
document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  const page = location.pathname;

  if (page.endsWith("dashboard.html")) {
    if (role !== "user" && role !== "admin") {
      location.replace("index.html");
    }
  }

  if (page.endsWith("admin.html")) {
    if (role !== "admin") {
      location.replace("index.html");
    }
  }
});

/* ===============================
   STORAGE HELPERS
================================ */
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

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
    const notes = getNotes();

    notes.push({
      filename: file.name,
      data: reader.result,
      uploadedBy: localStorage.getItem("username"),
      approved: false
    });

    saveNotes(notes);
    alert("File uploaded. Waiting for admin approval");
    fileInput.value = "";
  };

  reader.readAsDataURL(file);
}

/* ===============================
   USER DASHBOARD
================================ */
function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  const notes = getNotes();
  const role = localStorage.getItem("role");
  div.innerHTML = "";

  notes.forEach((n, i) => {
    if (n.approved) {
      div.innerHTML += `
        <div class="note" style="position:relative;">
          ${role === "admin" ? `<span onclick="adminDelete(${i})"
           style="position:absolute;top:8px;right:8px;cursor:pointer;color:red;">🗑️</span>` : ""}
          <h3>${n.filename}</h3>
          <p>Uploaded by: ${n.uploadedBy}</p>
          <button onclick="downloadNote('${n.filename}','${n.data}')">Download</button>
        </div>
      `;
    }
  });
}

/* ===============================
   ADMIN PANEL
================================ */
function loadAdminNotes() {
  const container = document.getElementById("pending");
  if (!container) return;

  const notes = getNotes(); // 🔴 always fresh
  container.innerHTML = "";

  let found = false;

  notes.forEach((note, index) => {
    if (note.approved === false) {
      found = true;
      container.innerHTML += `
        <div class="note">
          <p><b>File:</b> ${note.filename}</p>
          <p><b>Uploaded by:</b> ${note.uploadedBy}</p>
          <button onclick="approve(${index})">Approve</button>
          <button onclick="reject(${index})">Reject</button>
        </div>
      `;
    }
  });

  if (!found) {
    container.innerHTML = "<p>No pending notes</p>";
  }
}


/* ===============================
   ADMIN ACTIONS
================================ */
function approve(i) {
  const notes = getNotes();
  notes[i].approved = true;
  saveNotes(notes);
  loadAdminNotes();
}

function reject(i) {
  const notes = getNotes();
  notes.splice(i, 1);
  saveNotes(notes);
  loadAdminNotes();
}

function adminDelete(i) {
  if (localStorage.getItem("role") !== "admin") return;
  if (confirm("Delete this file?")) {
    const notes = getNotes();
    notes.splice(i, 1);
    saveNotes(notes);
    loadNotes();
    loadAdminNotes();
  }
}

/* ===============================
   DOWNLOAD
================================ */
function downloadNote(name, data) {
  const a = document.createElement("a");
  a.href = data;
  a.download = name;
  a.click();
}

/* ===============================
   AUTO LOAD
================================ */
loadNotes();
loadAdminNotes();
document.addEventListener("DOMContentLoaded", function () {
  loadAdminNotes();
});



