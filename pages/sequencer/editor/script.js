var bpm = 130;
var transpose = 0;
var onQuaver = 0;

function toggleInstSlot(slot) {
	var prev = slot.dataset.en;
	if (prev == "false") {
		slot.dataset.en = "true";
		slot.style.background = "var(--light)";
	} else {
		slot.dataset.en = "false";
		slot.style.background = "none";
	}
}

function toggleDrumSlot(slot) {
	var prev = slot.dataset.en;
	if (prev == "false") {
		slot.dataset.en = "true";
		slot.style.background = "var(--accent)";
	} else {
		slot.dataset.en = "false";
		slot.style.background = "none";
	}
}

var looper = () => {
	if (ready) {
		lights[onQuaver].style.background = "none";
		onQuaver = (onQuaver + 1) % 16;
		lights[onQuaver].style.background = "var(--lighter)";

		for (var n = 0; n < notes.length; n++) {
			let note = notes[n];
			if (note.dataset.time == onQuaver && note.dataset.en == "true") {
				if(musician != null) {
				
					musician.play(60 + transpose + (24 - parseInt(note.dataset.note)), null, {
						gain: parseFloat(document.querySelector("#inst-vol").value)
					});
				}
			}
		}

		for (var n = 0; n < drums.length; n++) {
			let drum = drums[n];
			if (drum.dataset.time == onQuaver && drum.dataset.en == "true") {
				drummer[drum.dataset.drum].currentTime = 0;
        drummer[drum.dataset.drum].volume = parseFloat(document.querySelector("#drum-vol").value);
				drummer[drum.dataset.drum].play();
			}
		}
	}

	setTimeout(looper, 30000/bpm);
}

looper();

document.querySelector("#copy-btn").addEventListener("click", () => {
  let notesList = [];
  for (let i = 0; i < notes.length; i++) {
    notesList.push(notes[i].dataset.en)
  }
  let drumsList = [];
  for (let i = 0; i < drums.length; i++) {
    drumsList.push(drums[i].dataset.en)
  }
  const json = {
      notes: notesList,
      drums: drumsList,
      inst: document.querySelector("#inst-sel").value,
      kit: document.querySelector("#kit-sel").value,
      bpm,
      transpose
  }
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(JSON.stringify(json)).then(function() {
        /* clipboard successfully set */
      }, function() {
        /* clipboard write failed */
      });
    }
  }).catch(err => {
	  alert(err);
  })
});

/// socket.on('server message', function(data) {
/// });

/// socket.emit('client message', data);