<?php

$servername = 'bedbugstudiocom.ipagemysql.com';
$username = "bedbug";
$password = "a21th21";
$dbname = "bedbug";



$data = json_decode(file_get_contents('php://input'), true);


$id = $data["id"];



// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "UPDATE prizes SET prizes=prizes-1 WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>
