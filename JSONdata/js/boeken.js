const output = document.getElementById('boekenLijst');
const xhr = new XMLHttpRequest();
// Filter checkboxes
const taalKeuze = document.querySelectorAll('.control__cb-lang');

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
        let result = JSON.parse(xhr.responseText);
        boeken.filteren( result );
        boeken.uitvoeren();
    } 
}
xhr.open('GET', 'boekenTheo.json', true);
xhr.send();

const boeken = {

    taalFilter: ['Nederlands', 'Duits', 'Engels'],

    // Filter op taal
    filteren( gegevens ) {
        this.data = gegevens.filter( (bk)  => {
            let bool = false;
                this.taalFilter.forEach( (taal) => {
                    if( bk.taal == taal ) { bool = true}
                } )
                return bool;
        })
    },
    sorteren() {
        this.data.sort( (a,b) => ( a.titel.toUpperCase() > b.titel.toUpperCase() ) ? 1 : -1);
    },
    uitvoeren() {
        this.sorteren();
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
            html += `<span class="boek__uitgave"> ${this.datumOmzetten(boek.uitgave)}</span>`;
            html += `<span class="boek__ean"> ${boek.ean}</span>`;
            html += `<span class="boek__paginas"> ${boek.paginas}</span>`;
            html += `<span class="boek__taal"> ${boek.taal}</span><br>`;
            html += `<span class="boek__prijs">${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</span>`;
            html += `</section>`;
        });
        output.innerHTML = html;
    },
    datumOmzetten(uitgaveString) {
        let datum = new Date(uitgaveString);
        let jaar = datum.getFullYear();
        let maand = this.krijgMaandString(datum.getMonth());
        return `${maand} ${jaar}`;
    },
    krijgMaandString(m) {
        let maand = "";
        switch (m) {
            case 0 : maand = 'januari'; break;
            case 1 : maand = 'februari'; break;
            case 2 : maand = 'maart'; break;
            case 3 : maand = 'april'; break;
            case 4 : maand = 'mei'; break;
            case 5 : maand = 'juni'; break;
            case 6 : maand = 'juli'; break;
            case 7 : maand = 'augustus'; break;
            case 8 : maand = 'september'; break;
            case 9 : maand = 'october'; break;
            case 10 : maand = 'november'; break;
            case 11: maand = 'december'; break;
            default : maand = m;
        }
        return maand;
    }
}

const pasFilterAan = () => {
    let gecheckteTaalKeuze = [];
    taalKeuze.forEach( cb => {
        if (cb.checked) gecheckteTaalKeuze.push(cb.value);
    });
    boeken.taalFilter = gecheckteTaalKeuze;
    boeken.filteren( JSON.parse(xhr.responseText) );
    boeken.uitvoeren();
}

taalKeuze.forEach( cb => cb.addEventListener('change', pasFilterAan) );
