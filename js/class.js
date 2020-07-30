class ToDo {
    constructor(debug = Boolean) {
        this.nowJSON = [];
        this.debug = debug;
    }

    async loadIcon() {
        fetch('icons/trash.min.svg').then(resp => resp.text()).then((svg) => {
            this.TRASH_SVG = svg;
            this.debugOut(`SVG: ${svg}`);
        });
    }

    // Debug output
    debugOut(text) {
        if (this.debug) {
            console.log(text);
        }
    }

    //Check for changes
    checkChanges() {
        // Lokalen Stand auslesen

        this.debugOut(this.nowJSON);

        if (this.nowJSON.length == 0) {
            let tasks = document.getElementsByClassName('check-mark');
            for (let i = 0; i < tasks.length; i++) {
                const elemNow = tasks[i];
                const idNow = Number(elemNow.id.slice(9, elemNow.id.length))
                const status = elemNow.classList.contains('checked');
                this.nowJSON[i] = { 'id': idNow, 'status': status };
            }

        }
        this.debugOut(`Local: ${this.nowJSON}`);

        // Aktuellen Stand aus der Datenbank abrufen
        fetch('api.php?get_tasks=1').then(resp =>
            resp.json()
        ).then((data) => {
            this.debugOut('Server: ', data);
            if (this.nowJSON != data) {
                this.compareChanges(this.nowJSON, data);
            }
            this.nowJSON = data;

        }).catch((err) => {
            console.warn(err);
        });

    }

    // Neue Aufgabe hinzufügen
    newTask(title = String, status = Boolean, id = Number) {
        let listContainer = document.getElementById('list');

        //Container
        let newTask = document.createElement('DIV');
        newTask.classList.add('item-div');
        newTask.setAttribute('id', 'item-' + id);
        listContainer.appendChild(newTask);

        //Link
        let newTaskLink = document.createElement('A');
        newTaskLink.classList.add('item-title');
        newTaskLink.setAttribute('onclick', 'ToggleStatus(' + id + ');');
        newTaskLink.innerHTML = title;
        newTask.appendChild(newTaskLink);

        //Checkbox
        let newCheckbox = document.createElement('SPAN');
        newCheckbox.classList.add('check-mark');
        if (status) {
            newCheckbox.classList.add('checked');
        }
        newCheckbox.setAttribute('id', 'checkbox-' + id);
        newTaskLink.appendChild(newCheckbox);

        //Löschen Button
        let newDeleteButton = document.createElement('BUTTON');
        newDeleteButton.classList.add('delete-button');
        newDeleteButton.setAttribute('onclick', 'deleteRequest("' + id + '");');
        newDeleteButton.innerHTML = this.TRASH_SVG;
        newTask.appendChild(newDeleteButton);
    }


    // Überprüfen, ob nach dem Löschen noch Aufgaben vorhanden sind
    // Wenn nicht wird "Huch, (noch) keine Aufgaben...  Das ist doch nicht möglich!😉" ausgeben
    checkAfterDelete() {
        const tasks = document.getElementsByClassName('item-div');
        let output = document.getElementById('list');
        var status = true;

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].style.display != 'none') {
                status = false;
            }
        }

        if (status) {
            console.log('Huch, (noch) keine Aufgaben...  Das ist doch nicht möglich!😉');
            output.innerHTML = '<p>Huch, (noch) keine Aufgaben...</p><p>Das ist doch nicht möglich!😉</p>';
        }
    }


    compareChanges(client = Array, server = Array) {
        if (server != client) {
            let max = client.length;

            for (let i = 0; i < max; i++) {
                // Anzahl gelöschter Aufgaben
                let j = 0;

                // Gleiche Aufgabe
                if (client[i + j].id == server[i].id) {
                    // Überprüfen ob der Status ungleich ist
                    if (client[i + j].status != server[i].status) {
                        // Status anpassen
                        this.changeStatus(client[i + j].id);
                        this.debugOut(`Status von "${client[i + j].title}" ändern`);
                    }
                }

                this.debugOut(`Client: ${(client[i].id != undefined) ? client[i].id : 'undefined'} & Server: ${(server[i].id != undefined) ? server[i].id : 'undefined'} `);

            }

            // Alles was hinter den Elementen von client ist muss auf jeden Fall neu sein
            let definitivNew = server.length - client.length;

            // Kleiner werden Zählschleife, weil die Aufgaben in der richtigen Reinfolge hinzugefügt werden müssen
            for (let k = definitivNew; k > 0; k--) {
                let tasks = server[server.length - k];
                this.newTask(tasks.title, tasks.status, tasks.id);
                this.debugOut(`Neue Aufgabe "${tasks.title}" hinzufügen`);

            }
        } else {
            this.debugOut('Keine Änderungen');

        }

    }


    deleteTask(id = Number) {
        let deletedElement = document.getElementById('item-' + id);
        deletedElement.style.display = 'none';
        this.checkAfterDelete();
    }


    // Löschen von allen erledigten Aufgaben
    deleteAllChecked() {
        let tasks = document.getElementsByClassName('');
    }


    //Cookies für die Darkmode auslesen
    //Obwohl es eigentlich gar keine Cookies sind :-)
    ReadCookie() {

        if (localStorage.getItem('darkmode') == 'true') {
            body.classList.add('dark');
        }

    }


    // Status sichtbar ändern
    changeStatus(id = Number) {
        let checkbox = document.getElementById("checkbox-" + id);

        checkbox.classList.toggle('checked');
    }
}