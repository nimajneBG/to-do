<!DOCTYPE html>
<html lang="de">

<head>
    <!--Meta-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Einfach eine digitale To-Do Liste">
    <!--CSS & Schriftarten-->
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@700&display=swap" rel="stylesheet">
    <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.7.0/css/all.css' integrity='sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ' crossorigin='anonymous'>
    <link rel="stylesheet" href="popup.css">
    <!--Script-->
    <script src="popup.js"></script>
    <script src="class.js"></script>
    <!--Titel-->
    <title>To-do Liste Dev Edition</title>
</head>

<body>
    <?php
    //Mit der Datenbank verbeinden
    include 'conn.inc.php';
    //Anmeldung mit PHP-AUTH
    include 'login.inc.php';
    ?>

    <script src="to-do.js"></script>

    <!--NoScript-->
    <noscript>
        <div class="noscript">
            <h1>Du hast JavaScript deaktiviert</h1>
            <h3>Bitte aktiviere JavaScript oder deaktiviere NoScript</h3>
            <p>Wir nutzen JavaScript für viele wichtige Aufgaben auf dieser Seite (<a href="#">Weitere Infos</a>) und können darauf leider nicht verzichten.</p>
        </div>
    </noscript>

    <!--Header mit buttons-->
    <header>
        <h1>To-do Liste Dev Edition</h1>
        <div class="buttons">
            <button type="button" title="Erledigte Aufgaben löschen" onclick="Delete();" id="deleteAllBtn"><i class="fas fa-trash"></i></button>
            <button type="button" title="Darkmode EIN/AUS" onclick="ToggleDarkmode();"><i class="fas fa-adjust"></i></button>
            <button type="button" title="Info" onclick="info();"><i class="fas fa-info"></i></button>
            <button title="Konto" onclick="openSettings();" style="float: right; margin-right: 20px;"><i class="fas fa-user"></i></button>
        </div>
    </header>

    <!--Listen-->

    <main id="mainConntent">

        <!--Eigentliche Liste-->
        <div class="list" id="list">

            <!--PHP-->
            <?php
            //Neue Aufgabe hinzufügen
            if (isset($_POST["item-name"])) {

                //Nicht leer und nicht nur Leerzeichen
                if (strlen($_POST["item-name"]) > 0 && !strlen(trim($_POST["item-name"])) == 0) {

                    $new_item = htmlentities($_POST["item-name"]);

                    //Markdown Fett und Kursiv (**Fett**; *Kursive*)
                    $new_item = preg_replace('/(\*\*)(.*?)(\*\*)/', '<b>$2</b>', $new_item);
                    $new_item = preg_replace('/(\*)(.*?)(\*)/', '<i>$2</i>', $new_item);

                    //SQL
                    $neu = $db->prepare("INSERT INTO `tasks`(`title`, `status`, `user`) VALUES (?, 0, ?)");
                    $neu->bind_param('ss', $new_item, $user_name);
                    $neu->execute();
                    $neu->close();

                    //Fehlererkennung
                    //echo '<script>console.log("' . var_dump($neu) . '");</script>';
                    if ($neu) {
                        echo "<script>console.log('New item created successfully');</script>";
                    } else {
                        echo '<script>popUpError("Aufgabe konnte nicht hinzugefügt werden<br>Fehlermeldung: ' . $db->error . '");console.error("Error: ' . mysqli_error($db) . '");</script>';
                    }
                } else {
                    //Leere oder nur Leerzeichen enthaltende Aufgabe
                    echo '<script>var p = new PopUp({"message" : "Du kannst keine leeren Aufgaben machen", "ok" : true,"cancel" : false,"custom" : false, "close" : true, "text" : "", "icon" : "📣" });p.create();</script>';
                }
            }

            //Aufgaben abrufen SQL
            $statement2 = $db->prepare("SELECT * FROM `tasks` WHERE `user`=?");
            $statement2->bind_param('s', $user_name);
            $statement2->execute();
            $result = $statement2->get_result();
            $statement2->close();

            //Aufgaben ausgeben
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {

                    echo '<div class="item-div" id="item-' . $row["id"] . '">';

                    if (intval($row["status"]) == 1) {
                        //Erledigt
                        $status = 'checked';
                    } elseif (intval($row["status"]) == 0) {
                        //Noch nicht erledigt
                        $status = '';
                    } else {
                        //Fehlererkennung: Status der Aufgabe nicht definiert (sollte eigentlich nicht passieren, weil die Spalte NOT_NULL ist)
                        $status = '';
                        echo '<script>console.error("Error: The status of' . $row["title"] . ' is not defined (not 0 (False) or 1 (True))");</script>';
                    }
                    //Label
                    echo '<a class="item-title" onclick="ToggleStatus(' . $row["id"] . ')">';
                    //Aufgaben Text
                    echo $row["title"];
                    //Checkbox
                    echo '<span id="checkbox-' . $row["id"] . '" class="check-mark ' . $status . '"></span>';
                    //Label schließen
                    echo '</a>';
                    //Löschen Button
                    echo '<button class="delete-button" onclick="deleteRequest(' . $row["id"] . ')"><i class="fas fa-trash"></i></button>';

                    echo '</div>';
                }
            } else {
                //Text wenn noch keine Aufgaben vorhanden sind
                echo "<p>Huch, (noch) keine Aufgaben...</p>";
                echo "<p>Das ist doch nicht möglich!😉</p>";
            }

            ?>
        </div>

        <div class="overlay-footer">

            <div class="new-div">
                <form class="form-new" action="index.php" method="post">
                    <input type="text" name="item-name" placeholder="Neue Aufgabe hinzufügen" maxlength="100" autofocus="">
                    <input type="submit" value="+" title="Hinzufügen" id="buttonAdd">
                </form>
            </div>

        </div>

    </main>

    <!--Kontoeinstellungen-->
    <main id="accountSettings">

        <div class="settingsContent">

            <?php

            //Einstellungen wieder öffnen
            if (isset($_POST["name"]) or isset($_POST["password"]) or isset($_POST["password-repeat"])) {
                echo "<script>openSettings();</script>";
            }

            ?>

            <div class="secondHeader">
                <button type="button" onclick="openSettings()"><i class="fas fa-chevron-left"></i></button>
                <h3>Kontoeinstellungen</h3>
                <button id="close" type="button" onclick="openSettings()"><i class="fas fa-times"></i></button>
            </div>

            <form method="post" action="index.php">

                <!--Nutzername-->
                <label for="name">Nutzername</label>
                <input name="name" type="text" value="<?php echo $user_name; ?>">

                <!--Passwort-->
                <label for="password">Passwort</label>
                <input type="password" name="password">
                <label for="password-repeat">Passwort wiederholen</label>
                <input type="password" name="password-repeat">

                <!--E-Mail-->
                <!--
                <label for="e-mail">E-Mail Adresse</label>
                <input type="email" name="e-mail">
                -->

                <!--Submit-->
                <input type="submit" value="Ändern" class="settingsSubmitBtn">
            </form>

            <hr>

            <h3>Konto löschen</h3>
            <form action="index.php" method="post" id="delete-account">
                <label for="confirmDeletePW">Zum löschen Passwort eingeben <b style="color:red;">Achtung: Das Löschen kann nicht rückgängig gemacht werden</b></label>
                <input type="password" name="confirmDeletePW" id="">

                <button class="settingsSubmitBtn warning" type="button" id="deleteAccountBtn" onclick="accountDelete();">Löschen</button>
            </form>

        </div>

    </main>


    <?php
    //Verbindung schließen
    $db->close();
    ?>

</body>

</html>