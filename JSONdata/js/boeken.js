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

            // Html tags toevoegen
            html += `<section class="boek-container">`;
            html += `<img class="boek__cover" src="${boek.cover}" alt="${fullTitel}">`;
            html += `<h3>${fullTitel}</h3>`;
            html += `<span class="boek__uitgave"> ${boek.uitgave}</span>`;
            html += `<span class="boek__ean"> ${boek.ean}</span>`;
            html += `<span class="boek__paginas"> ${boek.paginas}</span>`;
            html += `<span class="boek__taal"> ${boek.taal}</span>`;
            html += `</section>`;
        });
        output.innerHTML = html;
    }
}

