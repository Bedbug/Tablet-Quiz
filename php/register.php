<?php

$servername = 'bedbugstudiocom.ipagemysql.com';
$username = "bedbug";
$password = "a21th21";
$dbname = "bedbug";



$data = json_decode(file_get_contents('php://input'), true);

print($data);

$name = $data["name"];
$lastname = $data["lastname"];
$email = $data["email"];
$phone = $data["phone"];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");
$conn->query("SET NAMES 'utf8'");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO  `vf_tabletmaniac2` (  `name` ,  `lastname` , `email` ,  `phone` )
        VALUES (
        '$name', '$lastname', '$email',  '$phone'  )";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>
