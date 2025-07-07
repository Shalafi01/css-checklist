(function inizializza() {
	// DARK MODE
	let d = localStorage.getItem("text");
	if (!d) localStorage.setItem("text", "Dark mode: off");
	if (d === "Dark mode: on") {
		accendi();
		document.getElementById("dark").innerHTML = "Dark mode: on";
	} else {
		spegni();
		document.getElementById("dark").innerHTML = "Dark mode: off";
	}

	// MENU BLOCK
	let m = localStorage.getItem("fisso");
	if (!m) m = "false";
	if (m === "true") apriMenu();
	localStorage.setItem("fisso", m);

	// NOTE
	const path = window.location.pathname;
	const page = path.split("/").pop();

	if (page === "index.html") {
		const note = getNote("0");
		note.forEach(n => {
			let titolo = n.titolo;
			if (titolo.length > 150) titolo = titolo.substring(0, 150) + "..";

			const li = document.createElement("li");
			const t = document.createTextNode(titolo);
			li.appendChild(t);
			document.getElementById("list").appendChild(li);
			formattaNota(n.data, titolo, li, "0");
			(document.getElementById("dark").innerHTML === "Dark mode: on" ? accendi : spegni)();
		});
	} else if (page === "completati.html") {
		const note = getNote("1");
		note.forEach(n => {
			let titolo = n.titolo;
			if (titolo.length > 150) titolo = titolo.substring(0, 150) + "..";

			const li = document.createElement("li");
			const t = document.createTextNode(titolo);
			li.appendChild(t);
			document.getElementById("list").appendChild(li);
			formattaNota(n.data, titolo, li, "1");
			(document.getElementById("dark").innerHTML === "Dark mode: on" ? accendi : spegni)();
		});
	}
})();

/* =================== WRAPPERS LOCALSTORAGE =================== */

function getNote(tipo) {
	return JSON.parse(localStorage.getItem(tipo + "note") || "[]");
}

function setNote(tipo, note) {
	localStorage.setItem(tipo + "note", JSON.stringify(note));
}

function addNote(tipo, titolo, data) {
	const note = getNote(tipo);
	note.push({ titolo, data });
	setNote(tipo, note);
}

function removeNote(tipo, index) {
	const note = getNote(tipo);
	note.splice(index, 1);
	setNote(tipo, note);
}

/* =================== GESTIONE NOTE =================== */

function aggiungiNota() {
	let testo = document.getElementById("input").value.trim();
	if (testo === "") return;

	if (testo.length > 150) testo = testo.substring(0, 150) + "..";

	const li = document.createElement("li");
	const t = document.createTextNode(testo);
	li.appendChild(t);

	document.getElementById("list").appendChild(li);

	const data = formatoData();
	formattaNota(data, testo, li, "0");
	addNote("0", testo, data);

	(document.getElementById("dark").innerHTML === "Dark mode: on" ? accendi : spegni)();
	document.getElementById("input").value = "";
}

function formattaNota(data, titolo, li, tipo) {
	const span1 = document.createElement("span");
	span1.id = "data";
	span1.appendChild(document.createTextNode(data));

	if (tipo === "0") {
		const img = document.createElement("img");
		img.setAttribute("src", "ico.png");
		img.setAttribute("height", "34px");
		img.classList.add("immagine");
		img.id = "immagine";

		img.addEventListener("click", function () {
			const index = Array.from(document.querySelectorAll("#list li")).indexOf(li);
			li.style.display = "none";
			const note = getNote("0");
			const notaSpostata = note[index];
			removeNote("0", index);
			addNote("1", notaSpostata.titolo, notaSpostata.data);
		});

		li.appendChild(img);
		li.appendChild(span1);
	} else if (tipo === "1") {
		const span2 = document.createElement("span");
		span2.id = "completato";
		span2.classList.add("completato");
		span2.appendChild(document.createTextNode("\u00D7"));

		span2.addEventListener("click", function () {
			const index = Array.from(document.querySelectorAll("#list li")).indexOf(li);
			li.style.display = "none";
			removeNote("1", index);
		});

		li.appendChild(span1);
		li.appendChild(span2);
		li.classList.add("checked");
	}
}



/* =================== DARK MODE =================== */

function darkmode() {
	let text = document.getElementById("dark").innerHTML;
	if (text === "Dark mode: off") {
		text = "Dark mode: on";
		accendi();
	} else {
		text = "Dark mode: off";
		spegni();
	}
	document.getElementById("dark").innerHTML = text;
	localStorage.setItem("text", text);
}

function spegni() {
	document.getElementById("header").style.backgroundColor = "#263238";
	document.body.style.backgroundColor = "#eee";
	document.body.style.color = "#000";
	document.getElementById("sidebar").style.backgroundColor = "#222";
	document.getElementById("menu").style.backgroundColor = "#3d3d3d";

	const li = document.querySelectorAll('.list li');
	for (let l of li) {
		l.classList.add("light");
		l.classList.remove("dark");
	}
}

function accendi() {
	document.getElementById("header").style.backgroundColor = "#3d3d3d";
	document.body.style.backgroundColor = "#222";
	document.body.style.color = "#eee";
	document.getElementById("sidebar").style.backgroundColor = "#263238";
	document.getElementById("menu").style.backgroundColor = "#384b54";

	const li = document.querySelectorAll('.list li');
	for (let l of li) {
		l.classList.add("dark");
		l.classList.remove("light");
	}
}

/* =================== MENU =================== */

let fisso = localStorage.getItem("fisso");

function gestioneMenu() {
	if (fisso === "false") {
		fisso = "true";
		apriMenu();
	} else {
		fisso = "false";
		chiudiMenu();
	}
	localStorage.setItem("fisso", fisso);
}

function apriMenu() {
	document.getElementById("sidebar").style.width = "200px";
	document.getElementById("main").style.marginLeft = "200px";
	document.getElementById("menu").style.marginLeft = "150px";
	document.getElementById("sidebar").style.textIndent = -20;
}

function chiudiMenu() {
	if (fisso === "false") {
		document.getElementById("sidebar").style.width = "50px";
		document.getElementById("main").style.marginLeft = "50px";
		document.getElementById("menu").style.marginLeft = "0px";
		document.getElementById("sidebar").style.textIndent = -170;
	}
}

/* =================== ALTRO =================== */

function formatoData() {
	const data = new Date();
	const ora = data.getHours().toString().padStart(2, '0');
	const minuti = data.getMinutes().toString().padStart(2, '0');
	const giorno = data.getDate().toString().padStart(2, '0');
	const mese = (data.getMonth() + 1).toString().padStart(2, '0');
	return `${ora}:${minuti} - ${giorno}/${mese}/${data.getFullYear()}`;
}

function clean() {
	localStorage.clear();
	location.reload();
}
