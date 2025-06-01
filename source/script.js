(function inizializza()
{	
	//DARK MODE	
	var d = localStorage.getItem("text");
	if(d == null) localStorage.setItem("text", "Dark Mode: off");
	if(d == "Dark mode: on") { accendi(); document.getElementById("dark").innerHTML = "Dark mode: on";}
	else {spegni(); document.getElementById("dark").innerHTML = "Dark mode: off";}

	//MENU BLOCK
	var m = localStorage.getItem("fisso");
	if(m == null) m = false; 
	if(m == "true") apriMenu(); 
	localStorage.setItem("fisso", m);

	//NOTE
	var path = window.location.pathname;
	var page = path.split("/").pop();	//legge il nome del file

	if(localStorage.getItem("1nNote") == null) localStorage.setItem("1nNote", 0);	//inizializza il nr di note se non ce ne è alcuna
	if(localStorage.getItem("0nNote") == null) localStorage.setItem("0nNote", 0);

	if(page=="index.html")	//crea le note salvate in sessionStorage
	{
		var nNote = localStorage.getItem("0nNote");
		for(let i=0; i<nNote; i++)
		{
			let titolo = localStorage.getItem("0titolo"+i);
			let data = localStorage.getItem("0data"+i);

			if(titolo.length > 150) titolo = (titolo.substring(0, 150) + "..");

			let li = document.createElement("li");
			let t = document.createTextNode(titolo);			
			li.appendChild(t);
			document.getElementById("list").appendChild(li);
			formattaNota(data, titolo);

			if(document.getElementById("dark").innerHTML == "Dark mode: on") accendi();		//applica il tema scuro alla nota apperna creata se attivato
			else spegni();
		}
	}
	else if (page=="completati.html")
	{		
		var nNote = localStorage.getItem("1nNote");
		for(let i=0; i<nNote; i++)
		{
			let titolo = localStorage.getItem("1titolo"+i);
			let data = localStorage.getItem("1data"+i);

			if(titolo.length > 150) titolo = (titolo.substring(0, 150) + "..");

			let li = document.createElement("li");
			let t = document.createTextNode(titolo);
			li.appendChild(t);
			document.getElementById("list").appendChild(li);
			formattaNota(data, titolo);

			if(document.getElementById("dark").innerHTML == "Dark mode: on") accendi();		
			else spegni();
		}
	}
})();

/*==========================GESTIONE NOTE========================*/

function aggiungiNota() 
{
	var li = document.createElement("li");
	var testo = document.getElementById("input").value;	

	if(testo.length > 150) testo = (testo.substring(0, 150) + "..");	

	var t = document.createTextNode(testo);
	li.appendChild(t);
	if (!testo == '') {
		document.getElementById("list").appendChild(li);
	}		

	var data=formatoData();
	formattaNota(data, testo);

	if(document.getElementById("dark").innerHTML == "Dark mode: on") accendi();		
	else spegni();

	document.getElementById("input").value = "";
}

function formattaNota(data, titolo)
{
	var path = window.location.pathname;
	var page = path.split("/").pop();

	var li = document.getElementsByTagName("li");
	let i = li.length-1;

	var span1 = document.createElement("span");
	var t1 = document.createTextNode(data);
	span1.id = "data";
	span1.appendChild(t1);	
	li[i].appendChild(span1);

	if(page=="index.html")
	{
		var img = document.createElement("img");
		img.setAttribute("src", "ico.png");
		img.setAttribute("height", "34px");
		img.id = "immagine";
		img.classList.add("immagine");
		li[i].appendChild(img);	

		var close = document.getElementsByClassName("immagine");	
		close[i].onclick = function() 
		{
			var div = this.parentElement;
			div.style.display = "none";

			var n=localStorage.getItem("1nNote");
			localStorage.setItem("1titolo"+n, localStorage.getItem("0titolo"+i));  
			localStorage.removeItem("0titolo"+i);
			localStorage.setItem("1data"+n, localStorage.getItem("0data"+i));  			
			localStorage.removeItem("0data"+i); n++;			
			localStorage.setItem("1nNote", n);   			

			var x = i;
			do
			{
				let t = localStorage.getItem("0titolo"+x);            
				if(t==null) 
				{ 
					var v = x+1;
					localStorage.setItem("0titolo"+x, localStorage.getItem("0titolo"+v));            			
					localStorage.removeItem("0titolo"+v);
					localStorage.setItem("0data"+x, localStorage.getItem("0data"+v));  		
					localStorage.removeItem("0data"+v);
				}
				x++;
			}while (x < localStorage.getItem("0nNote"))
			localStorage.setItem("0nNote", localStorage.getItem("0nNote")-1);	
		}
	}
	else if (page == "completati.html")
	{
		var t2 = document.createTextNode("\u00D7");
		var span2 = document.createElement("span");
		span2.id = "completato";
		span2.classList.add("completato");
		span2.appendChild(t2);
		li[i].appendChild(span2);

		var elimina = document.getElementsByClassName("completato");	
		elimina[i].onclick = function() 
		{
			var div = this.parentElement;
			div.style.display = "none";

			localStorage.removeItem("1titolo"+i);
			localStorage.removeItem("1data"+i);		

			var x = i;
			do
			{
				let t = localStorage.getItem("1titolo"+x);            
				if(t==null) 
				{ 
					let v = x+1;
					localStorage.setItem("1titolo"+x, localStorage.getItem("1titolo"+v));            			
					localStorage.removeItem("1titolo"+v);
					localStorage.setItem("1data"+x, localStorage.getItem("1data"+v));  		
					localStorage.removeItem("1data"+v);
				}
				x++;
			}while (x <= localStorage.getItem("1nNote"))
			localStorage.setItem("1nNote", localStorage.getItem("1nNote")-1);	
		}	

		li[i].classList.add("checked"); 
	}			
	
	//SAVE IN SESSION STORAGE

	let k=i+1;

	if(page=="index.html")
	{
		localStorage.setItem("0titolo"+i, titolo);
		localStorage.setItem("0data"+i, data);
		localStorage.setItem("0nNote", k);
	}	
	else if (page=="completati.html")
	{
		localStorage.setItem("1titolo"+i, titolo);
		localStorage.setItem("1data"+i, data);
		localStorage.setItem("1nNote", k);
	}
}

/*==========================DARK MODE========================*/

function darkmode()
{
	var text = document.getElementById("dark").innerHTML;
	if(text == "Dark mode: off") {document.getElementById("dark").innerHTML = "Dark mode: on"; text="Dark mode: on"; accendi(); }
	else {document.getElementById("dark").innerHTML = "Dark mode: off"; text="Dark mode: off"; spegni(); }
	localStorage.setItem("text", text);
}

function spegni()
{
	document.getElementById("header").style.backgroundColor = "#263238";     
	document.body.style.backgroundColor = "#eee"; 
	document.body.style.color = "#000"; 
	document.getElementById("sidebar").style.backgroundColor = "#222";  
	document.getElementById("menu").style.backgroundColor = "#3d3d3d"; 

	var li = document.querySelectorAll('.list li');
	for (let i = 0; i < li.length; i++) {      
		li[i].classList.add("light"); 
		li[i].classList.remove("dark");
	}
}

function accendi()
{
	document.getElementById("header").style.backgroundColor = "#3d3d3d";      
	document.body.style.backgroundColor = "#222"; 
	document.body.style.color = "#eee"; 
	document.getElementById("sidebar").style.backgroundColor = "#263238";  
	document.getElementById("menu").style.backgroundColor = "#384b54";

	var li = document.querySelectorAll('.list li');
	for (let i = 0; i < li.length; i++) {      
		li[i].classList.add("dark"); 
		li[i].classList.remove("light");        
	}	
}   

/*==========================GESTIONE MENU========================*/

var fisso = localStorage.getItem("fisso");

function gestioneMenu()
{
	if(fisso=="false") {fisso="true"; apriMenu();}
	else {fisso = "false"; chiudiMenu();}
	localStorage.setItem("fisso", fisso);
}

function apriMenu() 
{	
	document.getElementById("sidebar").style.width = "200px";
	document.getElementById("main").style.marginLeft = "200px";
	document.getElementById("menu").style.marginLeft = "150px";
	document.getElementById("sidebar").style.textIndent=-20;	
}

function chiudiMenu() 
{
	if(fisso=="false") 
	{
		document.getElementById("sidebar").style.width = "50px";
		document.getElementById("main").style.marginLeft= "50px";
		document.getElementById("menu").style.marginLeft= "0px";
		document.getElementById("sidebar").style.textIndent=-170;
	}
}

/*==========================VARIE========================*/

function formatoData() 
{
	var data = new Date();

	var ora = data.getHours();
	var minuti = data.getMinutes();	
	var giorno = data.getDate();
	var mese = data.getMonth();
	if(minuti < 10) minuti= "0"+minuti;
	if(ora < 10) ora= "0"+ora;
	if(giorno < 10) giorno= "0"+giorno;
	if(mese < 10) mese= "0"+mese.toString();
	return (ora + ":" + minuti + " - " + giorno + "/" + (parseInt(mese)+1) + "/" + data.getFullYear())
}

function clean()
{
	localStorage.clear();
	location.reload();
}