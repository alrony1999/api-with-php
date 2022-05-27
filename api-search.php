<?php
header('Content-Type: application/json');
header('Acess-Control-Allow-Origin: *');
$data = json_decode(file_get_contents("php://input"), true);
$search = $data['search'];
require 'controller/config.php';
$conn = mysqli_connect("localhost", "root", "", "test") or die("Connection Failed");
$sql = "SELECT * FROM information WHERE id LIKE '%{$search}%' OR name LIKE '%{$search}%' OR age LIKE '%{$search}%' OR city LIKE '%{$search}%'";
$result = mysqli_query($conn, $sql) or die("SQL Query Failed");
if (mysqli_num_rows($result) > 0) {

    $output = mysqli_fetch_all($result, MYSQLI_ASSOC);

    echo json_encode($output, JSON_PRETTY_PRINT);
} else {

    echo json_encode(array("message" => "No Record Found", "status" => false));
}
