let notes = JSON.parse(localStorage.getItem("notes")) || [];

function addNote() {
  let title = document.getElementById("title").value;
  let subject = document.getElementById("subject").value;
  let content = document.getElementById("content").value;

  if (title === "" || subject === "" || content === "") {
    alert("Please fill all fields");
    return;
  }

  let note = { title, subject, content };
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));

  document.getElementById("title").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("content").value = "";

  displayNotes();
}

function displayNotes() {
  let notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = "";

  notes.forEach((note, index) => {
    notesDiv.innerHTML += `
      <div class="note">
        <h3>${note.title}</h3>
        <p><b>Subject:</b> ${note.subject}</p>
        <p>${note.content}</p>
        <button onclick="deleteNote(${index})">Delete</button>
      </div>
    `;
  });
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

displayNotes();
