# To-do Liste

Eine digitale To-do Liste mit Datenbank und Backend, für den Browser.

## 1. Eigene Instanz hosten

1. Dateien herunterladen

2. Externe Librarys einbinden

3. Datenbank erstellen

4. `conn.inc.php` erstellen
    ```PHP
    <?php
    // Mit der Datenbank verbinden


    //Variablen
    $server = "Servername";
    $user = "Nutzername";
    $pwd = "Passwort";
    $db_name = "to-do";

    //Mit der Datenbank verbinden
    $db = new mysqli($server, $user, $pwd, $db_name);

    //Verbindung überprüfen
    if ($db->connect_error) {
        http_response_code(500);
        die("Connection to database failed: " . $db->connect_error);
    }
    ?>
    ```

## 2. Mitarbeiten / Verbessern

Einfach Issues, Forks und Pullrequests machen.

## 3. Genutzte Librarys / Code Snippets

- [Font Awesome 5 Free](https://github.com/FortAwesome/Font-Awesome/) für die Icons

- [Pop Ups](https://github.com/nimajneBG/Pop-up-Library) (MIT Lizenz)

- Markdown Syntax (\*\*Fett** und \*Kursiv*) Erkennung von Gregor Parzefall

## 4. Lizenz

Dieses Projekt ist unter der GNU General Public License (GPL)veröffentlicht.

---
&copy; by Benjamin Grau