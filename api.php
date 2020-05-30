<?php
include 'conn.inc.php';

include 'login.inc.php';

//Status ändern
if (isset($_POST["id"])) {
    //Status vor der Änderung abrufen
    $statusJetzt = mysqli_fetch_assoc(mysqli_query($db, "SELECT `status` FROM `task` WHERE `id`=".htmlentities($_POST["id"] . " AND `user`='" . $user_name . "'")));
    $sql1 = "UPDATE `tasks` SET `status`=1 WHERE `id`=" . htmlentities($_POST["id"]) . " AND `user`='" . $user_name . "'";
    $sql2 = "UPDATE `tasks` SET `status`=0 WHERE `id`=" . htmlentities($_POST["id"]) . " AND `user`='" . $user_name . "'";
    
    //SQL senden
    if (intval($statusJetzt["status"]) === 1) {
        if (!mysqli_query($db, $sql2)) {
            http_response_code(500);
        }
    } else {
        if (!mysqli_query($db, $sql1)) {
            http_response_code(500);
        }
    }
}

//Löschen
if (isset($_POST["del"])) {
    //Alle erledigten Aufgaben löschen
    if ($_POST["del"] === "y") {
        $sql3 = "DELETE FROM `tasks` WHERE `status`=1 AND `user`='" . $user_name . "'";
        if (!mysqli_query($db, $sql3)) {
            http_response_code(500);
        }
    } 
    //Spezielle Aufgabe löschen (ID)
    elseif (is_numeric($_POST["del"])) {
        $sql4 = "DELETE FROM `tasks` WHERE `id`=" . $_POST["del"] . " AND `user`='" . $user_name . "'";
        if (!mysqli_query($db, $sql4)) {
            http_response_code(500);
        }
    } else {
        http_response_code(404);
    }
}

//Verbindung schließen
mysqli_close($db);
?>
