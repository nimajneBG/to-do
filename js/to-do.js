// IE erkennen
document.body.onload = function () {
    /* var weil alle Versionen > IE11 kein let oder const supportet 
    und der Code ja da funktionieren muss um sie zu erkennen */
    var IE10 = /MSIE/i;
    var IE11 = /Trident/i;
    
    if (IE10.test(navigator.userAgent) || IE11.test(navigator.userAgent)) {
        document.getElementById('ie').style.display = 'block';
        
        console.log('Scheiß IE');
    }

    console.log('IE wurde geprüft');
}

//Variablen
const body = document.body;
const url = 'api.php';
var to_do = new ToDo(true);


//Autostart
to_do.loadIcon();
to_do.ReadCookie();
// Alle 20 Sekunden auf Änderungen prüfen
setInterval(() => to_do.checkChanges(), 20000);

//Löschen
//Alle erledigten Aufgaben löschen
function Delete() {

    let p = new PopUp({
        "message": "Willst du wirklich alle erledigten Aufgaben löschen?",
        "ok": true,
        "cancel": true,
        "custom": false,
        "close": false,
        "text": "",
        "icon": "❓"
    });

    p.create().then(
        (result) => {
            if (result == "ok") {
                //Request senden
                deleteRequest('y');

            } else if (result == "cancel") {
                //Wenn abgebrochen wird soll nichts passieren
                console.log('Löschen abgebrochen');
            }
        },
        (err) => {
            console.error(err); //What should happen if something goes wrong
        }
    );

}


//Request fürs Löschen senden
function deleteRequest(x) {

    const r = new Request(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'del=' + x,
        }
    )
    fetch(r).then((result) => {
        to_do.debugOut(result);
        if (result.ok) {
            if (typeof (x) == "number") {
                to_do.deleteTask(x);
            } else {
                location.reload();
            }
        } else {
            throw new Error('Network response was not ok');
        }
    }).catch((error) => {
        console.error('Fehler beim löschen: ' + error);
    });

}

//Abhacken
function ToggleStatus(id = Number) {
    const r = new Request(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'id=' + id,
        }
    )
    fetch(r).then((result) => {
        console.log(result);
        if (result.ok) {
            console.log('✅');
            to_do.toggleStatus(id);
        } else {
            throw new Error('Network response was not ok');
        }
    })
        .catch((error) => {
            console.error('Fehler beim Abhaken: ' + error);
        });

}

//Darkmode
/**
 * Toggle the darkmode
 */
function ToggleDarkmode() {

    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        localStorage.setItem('darkmode', false);
    } else {
        body.classList.add('dark');
        localStorage.setItem('darkmode', true);
    }

}

//Info
/**
 * Show the info Pop up
 */
function info() {
    let infoPopup = new PopUp({
        "message": "<p>Webbasierte To-do Liste</p><p>Entwickelt von Benjamin Grau. Diese To-do Liste ist in <code>PHP</code>, <code>SQL</code> (<code>MySQLi OOP</code>), <code>HTML</code>, <code>CSS</code> und <code>Java Script</code> geschrieben</p>Version: Beta<br><br>Dieses Programm benutzt Font Awesome 5 Free für die Icons",
        "ok": true,
        "cancel": false,
        "custom": false,
        "close": true,
        "text": null,
        "icon": "ℹ"
    });

    infoPopup.create();
}

//Kontoeinstellungen öffnen / schließen
/**
 * Open the settings
 */
function openSettings() {
    const einstellungen = document.getElementById('accountSettings');
    const btn = document.getElementById('deleteAllBtn');
    const tasksContainer = document.getElementById('mainConntent');

    if (einstellungen.style.display == 'block') {
        einstellungen.style.display = 'none';
        btn.classList.remove('mobil-invisible');
        tasksContainer.classList.remove('mobil-invisible');
    } else {
        einstellungen.style.display = 'block';
        btn.classList.add('mobil-invisible');
        tasksContainer.classList.add('mobil-invisible');
    }

}


//Kontolöschen Pop Up
function accountDelete() {

    const formular = document.getElementById('delete-account');
    let p = new PopUp({
        'message': 'Willst du wirklich dein Konto löschen (Kann nicht rückgängig gemacht werden)?',
        'close': false,
        'ok': true,
        'cancel': true,
        'text': null,
        'icon': '❓'
    });

    p.create().then(
        (result) => {
            console.log('Konto löschen: ' + result);
            if (result == 'ok') {
                formular.submit();
            } else if (result == 'cancel') {
                console.log('Löschung des Kontos abgebrochen');
            }
        }, (err) => {
            console.warn(err);
        }
    );
}
