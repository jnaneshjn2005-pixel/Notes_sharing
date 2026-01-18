const role = localStorage.getItem("role");

if (window.location.pathname.includes("dashboard") && role !== "user") {
  window.location.href = "index.html";
}

if (window.location.pathname.includes("admin") && role !== "admin") {
  window.location.href = "index.html";
}
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function logout() {
  window.location.href = "index.html";
}

function addNote() {
  let note = {
    title: title.value,
    subject: subject.value,
    content: content.value,
    approved: false,
favorite: false,
rating: 0
  };

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  alert("Note uploaded. Waiting for admin approval.");

  title.value = "";
  subject.value = "";
  content.value = "";
}

function loadNotes() {
  function loadNotes() {
  let div = document.getElementById("notes");
  if (!div) return;

  div.innerHTML = "";
  notes.filter(n => n.approved).forEach((n, i) => {
    div.innerHTML += `
      <div class="note">
        <h3>${n.title}</h3>
        <p>${n.subject}</p>
        <p>${n.content}</p>

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
          <h3>${note.title}</h3>
          <p>${note.subject}</p>
          <p>${note.content}</p>
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

