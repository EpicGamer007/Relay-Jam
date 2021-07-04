var ac = new AudioContext();
var musician = null;
var drummer = [];
var notes = [];
var drums = [];
var lights = [];
var ready = false;
var drumNames = ["kick", "snare", "clap", "chat", "ohat"];
var drumKits = ["909", "Trap", "Amen"];

// Loads drums samples from a given drumset's qualified name (folder name)
function loadDrums(qname) {
	for (var d = 0; d < drumNames.length; d++) {
		drummer[d] = new Audio(`sound/drum/${qname}/${drumNames[d]}.wav`);
		drummer[d].volume = 0.5; // The instrument plays way too quiet, and there's no way to turn it up. Turn drums down.
		drummer[d].load();
	}
}

// Loads an instrument into the musician
function loadInst(sfinst) {
	Soundfont.instrument(ac, sfinst).then((inst) => {
		musician = inst;
	});
}

// Performs an HTTP GET request synchronously
function httpGetAsync(theUrl, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", theUrl, true); 
	xmlHttp.send(null);
}

// Turns an ugly title into a nice, user-friendly one
function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

function init() {
	var noteplate = document.getElementById("noteplate");
	var drumplate = document.getElementById("drumplate");
	var trackbar = document.getElementById("trackbar");
	var instSelect = document.getElementById("inst-sel");
	var kitSelect = document.getElementById("kit-sel");
	var tempoEntry = document.getElementById("tempo");
	var transposeEntry = document.getElementById("transpose");
	var loadJson = document.getElementById("load-json");
	var actualJson = document.getElementById("actual-json");

	// First, fill the noteplate with slots
	var s = "";
	for (var n = 0; n < 25; n++) { // 12 notes per octave

		for (var t = 0; t < 16; t++) { // 16 quavers per two bars
			var noteslot = document.createElement("DIV");
			noteslot.className = "note slot";
			noteslot.dataset.time = t;
			noteslot.dataset.note = n;
			noteslot.dataset.en = "false";
			noteslot.addEventListener("click", (evt) => {
				toggleInstSlot(evt.toElement);
			});
			noteplate.appendChild(noteslot);
		}

		s += "16px ";
	}
	noteplate.style.gridTemplateRows = s;
	s = "";
	for (var t = 0; t < 16; t++) {
		s += "6.25% ";
	}
	noteplate.style.gridTemplateColumns = s;
	
	// Then, fill the drumplate with slots
	s = "";
	for (var n = 0; n < 5; n++) { // 5 samples to work with

		for (var t = 0; t < 16; t++) {
			var noteslot = document.createElement("DIV");
			noteslot.className = "drum slot";
			noteslot.dataset.time = t;
			noteslot.dataset.drum = n;
			noteslot.dataset.en = "false";
			noteslot.addEventListener("click", (evt) => {
				toggleDrumSlot(evt.toElement);
			});
			drumplate.appendChild(noteslot);
		}

		s += "16px ";
	}
	drumplate.style.gridTemplateRows = s;
	s = "";
	for (var t = 0; t < 16; t++) {
		s += "6.25% ";
	}
	drumplate.style.gridTemplateColumns = s;

	// Don't forget to populate the trackbar
	s = "";
	for (var t = 0; t < 16; t++) {
		var noteslot = document.createElement("DIV");
		noteslot.className = "tb-light slot";
		trackbar.appendChild(noteslot);
		s += "6.25%";
	}
	trackbar.style.gridTemplateColumns = s;

	// Expose all of the possible instruments
	httpGetAsync('https://raw.githubusercontent.com/danigb/soundfont-player/master/names/musyngkite.json', function(data) {
		var names = JSON.parse(data);
		Object.values(names).forEach(function(name) {
			var inst = document.createElement('OPTION');
			inst.value = name;
			var instText = document.createTextNode(titleCase(name.replace(/_/g, " ")).replace("Fx", "FX"));
			inst.appendChild(instText);
			if (instText.textContent=="Acoustic Grand Piano") inst.setAttribute("selected", "true");
			instSelect.appendChild(inst);
		})
	});

	instSelect.addEventListener("change", () => {
		loadInst(instSelect.value);
	});

	// Expose all of the drum kits
	drumKits.forEach(function(name) {
		var kit = document.createElement('OPTION');
		kit.value = name;
		var kitText = document.createTextNode(titleCase(name.replace(/_/g, " ")));
		kit.appendChild(kitText);
		if (kitText.textContent=="909") kit.setAttribute("selected", "true");
		kitSelect.appendChild(kit);
	})

	kitSelect.addEventListener("change", () => {
		loadDrums(kitSelect.value);
	});

	// Assign the musician an instrument
	loadInst("acoustic_grand_piano");

	// Assign the drummer a drum kit
	loadDrums("909");

	// Allow user to change the tempo and transpose
	tempoEntry.addEventListener("change", () => {
		bpm = tempoEntry.value;
	});

	transposeEntry.addEventListener("change", () => {
		transpose = parseInt(transposeEntry.value);
	});

	loadJson.addEventListener("submit", (e) => {
		console.log("called");
		e.preventDefault();
		let parsedJson = undefined;
		try {
			parsedJson = JSON.parse(actualJson.value);
		} catch(err) {
			return alert(err);
		}

		try {
			Array.from(noteplate.children).forEach((child, i) => {
				if(parsedJson.notes[i] == "true") {
					noteplate.children[i].dataset.en = "true";
					noteplate.children[i].style.background = "var(--light)";
				} else {
					noteplate.children[i].dataset.en = "false";
					noteplate.children[i].style.background = "";
				}
			});
			Array.from(drumplate.children).forEach((child, i) => {
				if(parsedJson.drums[i] == "true") {
					drumplate.children[i].dataset.en = "true";
					drumplate.children[i].style.background = "var(--accent)"; // --accent
				} else {
					drumplate.children[i].dataset.en = "false";
					drumplate.children[i].style.background = "";
				}
			});

			instSelect.value = parsedJson.inst;
			kitSelect.value = parsedJson.kit;
			tempoEntry.value = parsedJson.bpm;
			transposeEntry.value = parsedJson.transpose;

			instSelect.dispatchEvent(new Event("change"));
			kitSelect.dispatchEvent(new Event("change"));
			tempoEntry.dispatchEvent(new Event("change"));
			transposeEntry.dispatchEvent(new Event("change"));

			/* 
			
		notes: notesList,
      	drums: drumsList,
		inst: document.querySelector("#inst-sel").value,
		kit: document.querySelector("#kit-sel").value,
		bpm,
		transpose

			 */


		} catch(err) {
			return alert(err);
		}
	});

	// Make new slots visible globally
	notes = document.querySelectorAll(".note");
	drums = document.querySelectorAll(".drum");
	lights = document.querySelectorAll(".tb-light");

	ready = true;
}