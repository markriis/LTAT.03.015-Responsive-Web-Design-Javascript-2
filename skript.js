//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
const maksumus = document.querySelector( "#maksumus" );
const maksumuseDetailid = document.querySelector( "#tehing > #detailid" )

let tarneHind = 0;
const tooteMuutumisel = ( ) => {
    let total = 0;
    korv.forEach( ( t ) => total += parseInt( t.hind ) * t.kogus );

    if ( korv.length === 0 ) tarneHind = 0;

    maksumuseDetailid.innerText = `(tooted: ${ total }€, tarne: ${ tarneHind }€ )`
    maksumus.innerText = total + tarneHind;
}

lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            tooteMuutumisel( );
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

        }
    });

    tooteMuutumisel( );
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if ( korvArtikkel.nimi === toode.nimi && korvArtikkel.kogus > 0 ) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
        }
    });

    tooteMuutumisel( );
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }

    tooteMuutumisel( );
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.


//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);

};

window.onload = function () {
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
};


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
const telefon = document.getElementById( "telefon" );
const tarneviisid = document.getElementById( "tarneviisid" );
const pangad = document.getElementById( "pangad" );
const pangaRaadiod = pangad.querySelectorAll( "input[type=radio]" )
const tarneRaadiod = tarneviisid.querySelectorAll( "input[type=radio]" );

const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    }

    const numbriteRegex = new RegExp( "[0-9]" );
    if ( numbriteRegex.test( eesnimi.value ) ) {
        errors.push( "Eesnimes ei tohi esineda numbreid" )
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    }

    if ( numbriteRegex.test( perenimi.value ) ) {
        errors.push( "Perenimes ei tohi esineda numbreid" )
    }

    const telRegex = new RegExp( "^[0-9]{5}[0-9]+$" );
    if ( !telRegex.test( telefon.value ) ) {
        errors.push( "Telefoninumber peab koosnema ainult numbritest ja olema vahemalt 6 numbri pikkune" )
    }

    // region start: minu kood
    let pankValitud = false;
    for ( const pangaRaadio of pangaRaadiod ) {
        if ( pangaRaadio.checked ) {
            pankValitud = true;
            break;
        }
    }

    if ( !pankValitud ) {
        errors.push( "Palun vali pank" );
    }
    // region end: minu kood

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    let tarneOlemas = false;
    for ( let raadio of tarneRaadiod ) {
        if ( raadio.checked ) {
            tarneOlemas = true;
            break;
        }
    }

    if ( !tarneOlemas ) {
        errors.push( "Palun valida tarneviis" );
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

})

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */

const tarnePakiautomaat = document.querySelector( "#tarne1" );
const tarneIsejarele = document.querySelector( "#tarne2" );

tarnePakiautomaat.addEventListener( "click", ( e ) => {
    if ( !e.target.checked ) return;

    if ( korv.length === 0 ) {
        tarneHind = 0;
    } else tarneHind = 14.99;

    tooteMuutumisel( );
} );


tarneIsejarele.addEventListener( "click", ( e ) => {
    if ( !e.target.checked ) return;

    tarneHind = 0;
    tooteMuutumisel( );

} );
