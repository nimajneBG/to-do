class ToDo {
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
        newDeleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        newTask.appendChild(newDeleteButton);
    }


    //Überprüfen, ob nach dem Löschen noch Aufgaben vorhanden sind
    //Wenn nicht wird "Huch, (noch) keine Aufgaben...  Das ist doch nicht möglich!😉" ausgeben
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
        
        if (client.length == server.length) {
            var max = client.length;
        } else if (client.length < server.length) {
            var max = server.length;
        } else if (client.length > server.length) {
            var max = client.length;
        }
    
        for (let i = 0; i < max; i++) {            
            if (i >= client.length) {
                let task = server[i];
                this.newTask(task.title, task.status, task.id);
                console.log('Neue Aufgabe: ', task);
            } else if (i >= server.length) {
                console.log(`Aufgabe ${client[i].id} gelöscht`);
                this.deleteTask(client[i].id);
            } else if (client[i].id != server[i].id && client[i].id < server[i].id) {
                this.deleteTask(client[i].id);
                console.log(`Aufgabe ${client[i].id} gelöscht`);
            }
            console.log(server[i].id);
            
        }
    }


    deleteTask(x) {
        let deletedElement = document.getElementById('item-' + x);
        deletedElement.style.display = 'none';
        this.checkAfterDelete();
    }

}