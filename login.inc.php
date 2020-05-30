<?php
//Anmeldung mit HTTP-AUTH und Abfrage aus Nutzerdatenbank

//Keine Daten angegeben
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="To-do Liste"');
    http_response_code(401);
    echo 'Du musst dich anmelden!';

    //Verbindung schließen
    $db->close();
    exit;
}
//Daten angegeben
else {
    //SQL
    $statement1 = $db->prepare("SELECT `password` FROM `users` WHERE `username`=?");
    $statement1->bind_param('s', $_SERVER['PHP_AUTH_USER']);
    $statement1->execute();

    //Überprüfen, ob es diesen Nutzernamen gibt
    if (!$statement1) {
        http_response_code(401);
        echo 'Falscher Nutzername';

        //Verbindung schließen
        $db->close();
        header('WWW-Authenticate: Basic realm="To-do Liste"');
        exit;
    }
    //Nutzername ist richtig
    else {
        $passwordHash = $statement1 -> get_result();
        $passwordHash = $passwordHash -> fetch_assoc();
        $passwordHash = $passwordHash["password"];

        //Passwort überprüfen
        if (!password_verify($_SERVER['PHP_AUTH_PW'], $passwordHash)) {
            http_response_code(401);
            echo 'Falsches Passwort';

            //Verbindung schließen
            $db->close();
            header('WWW-Authenticate: Basic realm="To-do Liste"');
            exit;
        }
    }

    $user_name = htmlspecialchars($_SERVER['PHP_AUTH_USER']);
}

?>