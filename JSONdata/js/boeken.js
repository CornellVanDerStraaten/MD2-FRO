const output = document.getElementById('boekenLijst');
const xhr = new XMLHttpRequest();
// Filter checkboxes
const taalKeuze = document.querySelectorAll('.control__cb-lang');
// Sort choice select
const selectSort = document.querySelector('.controls__select');
const boekenInWinkelwagen = document.querySelector('.ww__aantal');

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
        let result = JSON.parse(xhr.responseText);
        boeken.filteren( result );
        boeken.uitvoeren();
    } 
}
xhr.open('GET', 'boekenTheo.json', true);
xhr.send();

// Object van winkelwagen
// Properties: bestelling (bestelde boeken)
// Methods:
const ww = {
    bestelling: [],

    boekToevoegen(obj) {
        let gevonden = this.bestelling.filter( b => b.ean == obj.ean );
        if ( gevonden.length == 0 ) {
            obj.besteldAantal ++;
            ww.bestelling.push(obj);
        } else {
            gevonden[0].besteldAantal ++;
        }
        localStorage.wwBestelling = JSON.stringify(this.bestelling);
        this.uitvoeren()
    },
    

    // Data uit local storage halen
    dataOphalen() {
        // Als er niets in de localstorage staat, voer dan niets uit
        // Anders komen er errors waardoor de site niet meer werkt
        if (localStorage.wwBestelling) {
            this.bestelling = JSON.parse(localStorage.wwBestelling);  
          }
          this.uitvoeren()
          
    },
    uitvoeren() {
        let html = `<table>`;
        let totaal = 0;
        let totaalBesteld = 0;
        this.bestelling.forEach( boek => {
            // Titel maken
            let totaleTitel ="";
            if ( boek.voortitel ) {
                totaleTitel += boek.voortitel + " ";
            }
            totaleTitel += boek.titel;
            // String opbouw
            html += `<tr>`;
            html += `<td><img src="${boek.cover}" alt="${boek.titel}" class="bestelform__cover"><td>`;
            html += `<td>${totaleTitel}</td>`;
            html += `<td class="bestelformulier__aantal">
            <i class="fas fa-arrow-down bestelformulier__verlaag" data-role="${boek.ean}"></i>
            ${boek.besteldAantal}
            <i class="fas fa-arrow-up bestelformulier__verhoog" data-role="${boek.ean}"></i></td>`;
            html += `<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`;
            html += `<td><i class="fas fa-trash verwijder-icoon" data-role="${boek.ean}"></i></td>`;
            html += `<tr>`;
            totaal += boek.prijs * boek.besteldAantal;
            totaalBesteld += boek.besteldAantal;
        })
        html += `<tr><td colspan="4">Totaal</td>
        <td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>
        </tr>`;
        html += `</table>`;
        document.getElementById('uitvoer').innerHTML = html;
        boekenInWinkelwagen.innerHTML = totaalBesteld;  
        this.verwijderenActiveren();
        this.hogerLagerActiveren();
    },
    hogerLagerActiveren() {
        let hogerKnoppen = document.querySelectorAll('.bestelformulier__verhoog');
        hogerKnoppen.forEach(knop => {
            knop.addEventListener('click', e => {
                let ophoogID = e.target.getAttribute('data-role');
                let opTeHogenBoek = this.bestelling.filter( boek => boek.ean == ophoogID);
                opTeHogenBoek[0].besteldAantal ++;
                localStorage.wwBestelling = JSON.stringify(this.bestelling);
                this.uitvoeren();
            })
        })

        // Verlaagknop
        let lagerKnoppen = document.querySelectorAll('.bestelformulier__verlaag');
        lagerKnoppen.forEach(knop => {
            knop.addEventListener('click', e => {
                let verlaagID = e.target.getAttribute('data-role');
                let teVerlagenAantal = this.bestelling.filter( boek => boek.ean == verlaagID);
                if (teVerlagenAantal[0].besteldAantal>1) {
                    teVerlagenAantal[0].besteldAantal --;
                } else {
                    //Boek verwijderen
                    this.bestelling = this.bestelling.filter( bk => bk.ean != verlaagID );
                }
                localStorage.wwBestelling = JSON.stringify(this.bestelling);
                this.uitvoeren();
            })
        })
    },
    verwijderenActiveren() {
        document.querySelectorAll('.verwijder-icoon').forEach( icoon => {
            icoon.addEventListener('click', e => {
                let teVerwijderenBoekID = e.target.getAttribute('data-role');
                this.bestelling = this.bestelling.filter( bk => bk.ean != teVerwijderenBoekID );
                //Local storage bijwerken
                localStorage.wwBestelling = JSON.stringify(this.bestelling);
                this.uitvoeren();
            })
        })
    }
}
// Data uit local storage halen
ww.dataOphalen();


// Object voor alle boeken
// Properties: TaalFilter, data, es
// Methods: filteren, sorteren, uitvoeren
const boeken = {

    taalFilter: ['Nederlands', 'Duits', 'Engels'],
    es: 'prijs',
    oplopend: 1, // Sort volgorde

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
        if (this.es == 'titel') {this.data.sort( (a,b) => ( a.titel.toUpperCase() > b.titel.toUpperCase() ) ? this.oplopend : -1*this.oplopend ); }
        else if (this.es == 'paginas') {this.data.sort( (a,b) => ( a.paginas > b.paginas ) ? this.oplopend : -1*this.oplopend ); }
        else if (this.es == 'uitgave') {this.data.sort( (a,b) => ( a.uitgave > b.uitgave ) ? this.oplopend : -1*this.oplopend ); }
        else if (this.es == 'prijs') {this.data.sort( (a,b) => ( a.prijs > b.prijs ) ? this.oplopend : -1*this.oplopend ); }
        else if (this.es == 'auteur') {this.data.sort( (a,b) => ( a.auteurs[0].achternaam > b.auteurs[0].achternaam ) ? this.oplopend : -1*this.oplopend ); }
    },
    uitvoeren() {
        this.sorteren();
        let html = "";
        this.data.forEach( boek => {

            // Elk boek een aantalBesteld geven
            boek.besteldAantal = 0;

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
            html += `<div class="boek__info">`;
            html += `<h3 class="boek__titel">${fullTitel}</h3>`;
            html += `<p class="boek__auteurs""> ${schrijvers}</p>`;
            html += `<span class="boek__uitgave"> ${this.datumOmzetten(boek.uitgave)}</span>`;
            html += `<span class="boek__ean"> ${boek.ean}</span>`;
            html += `<span class="boek__paginas"> ${boek.paginas}</span>`;
            html += `<span class="boek__taal"> ${boek.taal}</span><br>`;
            html += `<div class="boek__prijs">${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}
                     <a href="#" class="boek__bestel-knop" data-role="${boek.ean}">Bestellen</a></div>`;
            html += `</div></section>`;
        });
        output.innerHTML = html;
        // Knoppen een eventlistener geven
        document.querySelectorAll('.boek__bestel-knop').forEach( knop => {
            knop.addEventListener('click', e => {
                e.preventDefault();
                let boekEan = e.target.getAttribute('data-role');
                let selecteerdeBoek = this.data.filter( b => b.ean == boekEan);
                ww.boekToevoegen(selecteerdeBoek[0]); 
            })
        })
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

const changeSortOption = () => {
    boeken.es = selectSort.value;
    boeken.uitvoeren();
}

taalKeuze.forEach( cb => cb.addEventListener('change', pasFilterAan) );

selectSort.addEventListener('change', changeSortOption);
document.querySelectorAll('.controls__rb').forEach( rb => rb.addEventListener('change', () => {
    boeken.oplopend = rb.value;
    boeken.uitvoeren();
}))
