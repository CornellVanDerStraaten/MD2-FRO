const output = document.getElementById('boekenLijst');
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
        let result = JSON.parse(xhr.responseText);
        boeken.data = result;
        boeken.uitvoeren();
    } 
}
xhr.open('GET', 'boekenTheo.json', true);
xhr.send();

const boeken = {

    uitvoeren() {
        let html = "";
        this.data.forEach( boek => {
            // Bij sprake van een voortitel, zet deze bij de titel
            let fullTitel = "";
            if ( boek.voortitel ) {
                fullTitel += boek.voortitel + " ";
            }
            fullTitel += boek.titel;

            // Lijst met auteurs maken
            let schrijvers = "";
            boek.auteurs.forEach((schrijver, index) => {
                let tv = schrijver.tussenvoegsel ? schrijver.tussenvoegsel+" " : "";
                // Scheidingstekens tussen auteurs
                let seperator = ", ";
                if ( index >= boek.auteurs.length-2 ) { seperator = " en ";}
                if ( index >= boek.auteurs.length-1 ) { seperator = "";}
                schrijvers += schrijver.voornaam + " " + tv + schrijver.achternaam + seperator
            })
            // Html tags toevoegen
            html += `<section class="boek-container">`;
            html += `<img class="boek__cover" src="${boek.cover}" alt="${fullTitel}">`;
            html += `<h3 class="boek__titel">${fullTitel}</h3>`;
            html += `<p class="boek__auteurs""> ${schrijvers}</p>`;
            html += `<span class="boek__uitgave"> ${boek.uitgave}</span>`;
            html += `<span class="boek__ean"> ${boek.ean}</span>`;
            html += `<span class="boek__paginas"> ${boek.paginas}</span>`;
            html += `<span class="boek__taal"> ${boek.taal}</span>`;
            html += `<span class="boek__prijs">&euro; ${boek.prijs}</span>`;
            html += `</section>`;
        });
        output.innerHTML = html;
    }
}

