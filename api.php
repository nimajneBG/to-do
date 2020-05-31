<?php
include 'conn.inc.php';

include 'login.inc.php';

//Status ändern
if (isset($_POST["id"])) {
    //Status vor der Änderung abrufen
    $statusJetztSql = $db->prepare("SELECT `status` FROM `tasks` WHERE `id`=? AND `user`=?" );
    $statusJetztSql -> bind_param('is', intval($_POST["id"]), $user_name);
    $statusJetztSql -> execute();
    $statusJetzt = $statusJetztSql -> get_result();
    $statusJetztSql -> close();
    $updateSql = $db -> prepare("UPDATE `tasks` SET `status`=? WHERE `id`=? AND `user`=?");
    $updateSql -> bind_param('iis', $x , $_POST["id"], $user_name);
    if (intval($statusJetzt -> fetch_assoc()["status"]) === 1) {
        $x = 0;
    } else {
        $x = 1;
    }
    
    $updateSql -> execute();
    $updateSql -> close();
}

//Löschen
if (isset($_POST["del"])) {
    //Alle erledigten Aufgaben löschen
    if ($_POST["del"] === "y") {
        $del = $db -> prepare("DELETE FROM `tasks` WHERE `status`=1 AND `user`=?");
        $del -> bind_param('s', $user_name);
        $del -> execute();
        $del -> close();
    } 
    //Spezielle Aufgabe löschen (ID)
    elseif (is_numeric($_POST["del"])) {
        $del = $db -> prepare("DELETE FROM `tasks` WHERE `id`=? AND `user`=?");
        $del -> bind_param('is', intval($_POST["del"]), $user_name);
        $del -> execute();
        $del -> close();
    } else {
        http_response_code(404);
    }
}

//Verbindung schließen
$db->close();
?>
