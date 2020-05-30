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
    $db = mysqli_connect($server, $user, $pwd, $db_name);

    //Verbindung überprüfen
    if (!$db) {
        http_response_code(500);
        echo "Connection to database failed: " . mysqli_connect_error();
        exit;
    }
    ?>
    ```

## 2. Mitarbeiten / Verbessern

Einfach Issues, Forks und Pullrequests machen.

## 3. Genutzte Librarys / Code Snippets

- Font Awesome 5 Free für die Icons [Lizenz](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt)

- Pop Ups [Code](https://github.com/nimajneBG/Pop-up-Library) (MIT Lizenz)

- Markdown Syntax (**Fett** und *Kursiv*) Erkennung von Gregor Parzefall

## 4. Lizenz

Muss ich mir noch überlegen

---
&copy; by Benjamin Grau