/* ================= LOGIN ================= */
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

document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  const page = window.location.pathname;

  // Allow login page always
  if (page.endsWith("/") || page.endsWith("index.html")) {
    return;
  }

  // Protect dashboard
  if (page.endsWith("dashboard.html")) {
    if (role !== "user" && role !== "admin") {
      window.location.href = "index.html";
    }
  }

  // Protect admin page
  if (page.endsWith("admin.html")) {
    if (role !== "admin") {
      window.location.href = "index.html";
    }
  }
});

/* ================= LOGOUT ================= */

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  const page = window.location.pathname;

  // Allow login page always
  if (page.endsWith("/") || page.endsWith("index.html")) {
    return;
  }

  // Protect dashboard
  if (page.endsWith("dashboard.html")) {
    if (role !== "user" && role !== "admin") {
      window.location.href = "index.html";
    }
  }

  // Protect admin page
  if (page.endsWith("admin.html")) {
    if (role !== "admin") {
      window.location.href = "index.html";
    }
  }
});

/* ================= ROUTE PROTECTION ================= */

(function () {
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
})();

/* ================= STORAGE ================= */

let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* ================= FILE UPLOAD ================= */

function uploadFile() {
  const title = document.getElementById("title").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const file = document.getElementById("file").files[0];

  if (!title || !subject || !file) {
    alert("Fill all fields");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    notes.push({
      title,
      subject,
      filename: file.name,
      data: reader.result,
      uploadedBy: localStorage.getItem("username"),
      approved: false
    });

    localStorage.setItem("notes", JSON.stringify(notes));
    alert("Uploaded. Waiting for admin approval");

    document.getElementById("title").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("file").value = "";
  };

  reader.readAsDataURL(file);
}

/* ================= USER VIEW ================= */

function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  const role = localStorage.getItem("role");
  div.innerHTML = "";

  notes.filter(n => n.approved).forEach((n, i) => {
    div.innerHTML += `
      <div class="note">
        ${role === "admin" ? `<span class="delete" onclick="deleteFile(${i})">🗑️</span>` : ""}
        <h4>${n.title}</h4>
        <p>Subject: ${n.subject}</p>
        <p>File: ${n.filename}</p>
        <p>Uploaded by: ${n.uploadedBy}</p>
        <button onclick="downloadFile('${n.filename}','${n.data}')">Download</button>
      </div>
    `;
  });
}

/* ================= ADMIN VIEW ================= */

function loadAdminNotes() {
  const div = document.getElementById("pending");
  if (!div) return;

  div.innerHTML = "";
  notes.forEach((n, i) => {
    if (!n.approved) {
      div.innerHTML += `
        <div class="note">
          <h4>${n.title}</h4>
          <p>${n.subject}</p>
          <p>${n.filename}</p>
          <button onclick="approve(${i})">Approve</button>
          <button onclick="reject(${i})">Reject</button>
        </div>
      `;
    }
  });
}

/* ================= ACTIONS ================= */

function approve(i) {
  notes[i].approved = true;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadAdminNotes();
}

function reject(i) {
  notes.splice(i, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadAdminNotes();
}

function deleteFile(i) {
  if (localStorage.getItem("role") !== "admin") return;
  if (confirm("Delete this file?")) {
    notes.splice(i, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
    loadAdminNotes();
  }
}

/* ================= DOWNLOAD ================= */

function downloadFile(name, data) {
  const a = document.createElement("a");
  a.href = data;
  a.download = name;
  a.click();
}

/* ================= AUTO LOAD ================= */

loadNotes();
loadAdminNotes();
