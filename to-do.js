//Variablen
const body = document.body;
const url = 'api.php';
var nowJSON = [];
var to_do = new ToDo();

//Autostart
ReadCookie();
setInterval(checkChanges, 20000);

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
                //AJAX Zeug
                deleteRequest('y');

            } else if (result == "cancel") {
                //Wenn abgebrochen wird soll nichts passieren
                console.log('Löschen abgebrochen');
            }
        },
        (err) => {
            console.log(err); //What should happen if something goes wrong
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
        console.log(result);
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
    let checkbox = document.getElementById("checkbox-" + id);

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
            checkbox.classList.toggle('checked');
        } else {
            throw new Error('Network response was not ok');
        }
    })
        .catch((error) => {
            console.error('Fehler beim Abhaken: ' + error);
        });

}

//Darkmode
function ToggleDarkmode() {

    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        localStorage.setItem('darkmode', false);
    } else {
        body.classList.add('dark');
        localStorage.setItem('darkmode', true);
    }

}

//Cookies für die Darkmode auslesen
//Obwohl es eigentlich gar keine Cookies sind :-)
function ReadCookie() {

    if (localStorage.getItem('darkmode') == 'true') {
        body.classList.add('dark');
    }

}

//Info
function info() {
    let infoPopup = new PopUp({
        "message": "<p>Webbasierte To-do Liste</p><p>Entwickelt von Benjamin Grau. Diese To-do Liste ist in <code>PHP</code>, <code>SQL</code> (<code>MySQLi Procedural</code>), <code>HTML</code>, <code>CSS</code> und <code>Java Script</code> (<code>AJAX</code>) geschrieben</p>Version: 1.0 (Dev Version)<br><br>Dieses Programm benutzt Font Awesome 5 Free für die Icons",
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
function openSettings() {
    const einstellungen = document.getElementById('accountSettings');
    const btn = document.getElementById('deleteAllBtn');

    if (einstellungen.style.display == 'block') {
        einstellungen.style.display = 'none';
        btn.style.display = 'block';
    } else {
        einstellungen.style.display = 'block';
        btn.style.display = 'none'; //Löschen Button ausblenden
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

//Check for changes
function checkChanges() {
    // Lokalen Stand auslesen

    if (nowJSON.length == 0) {
        let tasks = document.getElementsByClassName('check-mark');
        const regexId = /\d/g;
        for (let i = 0; i < tasks.length; i++) {
            const elemNow = tasks[i];
            const idNow = elemNow.id.match(regexId);
            const status = elemNow.classList.contains('checked');
            if (idNow.length > 1) {
                let id = '';
                for (let x = 0; x < idNow.length; x++) {
                    id += idNow[x];
                }
                id = Number(id);
                nowJSON[i] = { 'id': id, 'status': status }
            } else {
                nowJSON[i] = { 'id': Number(idNow[0]), 'status': status };
            }
        }
        console.log('☺');

    }
    console.log('Local: ', nowJSON);

    // Aktuellen Stand aus der Datenbank abrufen
    console.log(url + '?get_tasks=1');

    fetch('api.php?get_tasks=1').then(resp => 
        resp.json()
    ).then((data) => {
        console.log('Server: ', data);
        if (nowJSON != data) {
            to_do.compareChanges(nowJSON, data);
        }
        nowJSON = data;

    }).catch((err) => {
        console.warn(err);
    });

}