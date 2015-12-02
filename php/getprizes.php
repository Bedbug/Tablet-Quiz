<?php

$servername = 'bedbugstudiocom.ipagemysql.com';
$username = "bedbug";
$password = "a21th21";
$dbname = "bedbug";



// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");
$conn->query("SET NAMES 'utf8'");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM `prizes`";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
          $rows[] = $row;
    }
    print json_encode($rows);
} else {
    echo "0 results";
}


$conn->close();

?>