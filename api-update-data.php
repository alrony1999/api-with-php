<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$name = $data['name'];
$age = $data['age'];
$city = $data['city'];

require 'controller/config.php';
$sql = "UPDATE information SET name = '{$name}', age = {$age}, city = '{$city}' WHERE id = {$id}";

$result = mysqli_query($conn, $sql) or die("SQL Query Failed");

if (mysqli_query($conn, $sql)) {
    echo json_encode(array('message' => 'Student Record Updated.', 'status' => true));
} else {
    echo json_encode(array('message' => 'Student Record Not Updated.', 'status' => false));
}
