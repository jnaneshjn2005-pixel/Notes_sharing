const role = localStorage.getItem("role");

if (window.location.pathname.includes("dashboard") && role !== "user") {
  window.location.href = "index.html";
}

if (window.location.pathname.includes("admin") && role !== "admin") {
  window.location.href = "index.html";
}
let notes = JSON.parse(localStorage.getItem("notes")) || [];

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

function logout() {
  window.location.href = "index.html";
}

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


function loadNotes() {
  function loadNotes() {
  let div = document.getElementById("notes");
  if (!div) return;

  div.innerHTML = "";
  notes.filter(n => n.approved).forEach((n, i) => {
    div.innerHTML += `
      <div class="note">
        <h3>📄 ${n.filename}</h3>
<p><b>Uploaded by:</b> ${n.uploadedBy}</p>
<p>⭐ Rating: ${n.rating}/5</p>
<button onclick="downloadNote('${n.filename}','${n.content}')">⬇️ Download</button>


        <button onclick="downloadNote('${n.title}','${n.content}')">⬇️ Download</button>
        <button onclick="toggleFav(${i})">❤️ Favorite</button>
        <button onclick="rate(${i},5)">⭐ Rate</button>
      </div>
    `;
  });
}
function downloadNote(title, content) {
  let a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  a.download = title + ".txt";
  a.click();
}
function toggleFav(index) {
  notes[index].favorite = !notes[index].favorite;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}
function searchNotes() {
  let q = search.value.toLowerCase();
  document.querySelectorAll(".note").forEach(n => {
    n.style.display = n.innerText.toLowerCase().includes(q) ? "block" : "none";
  });
}

loadNotes();
function loadAdminNotes() {
  let div = document.getElementById("pending");
  if (!div) return;

  div.innerHTML = "";
  notes.forEach((note, index) => {
    if (!note.approved) {
      div.innerHTML += `
        <div class="note">
          <h3>📄 ${n.filename}</h3>
<p><b>Uploaded by:</b> ${n.uploadedBy}</p>
<button onclick="approveNote(${i})">Approve</button>

          <button onclick="approveNote(${index})">Approve</button>
        </div>
      `;
    }
  });
}

function approveNote(index) {
  notes[index].approved = true;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadAdminNotes();
}

loadAdminNotes();
  
function rate(index, stars) {
  notes[index].rating = stars;
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}
function toggleTheme() {
  document.body.classList.toggle("dark");
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

