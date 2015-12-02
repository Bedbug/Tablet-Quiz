<?php

$servername = 'bedbugstudiocom.ipagemysql.com';
$username = "bedbug";
$password = "a21th21";
$dbname = "bedbug";



// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM `vf_tabletmaniac2`";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - Name: " . $row["name"]. "- " . $row["email"]. " - Phone: " . $row["phone"].  "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();

?>