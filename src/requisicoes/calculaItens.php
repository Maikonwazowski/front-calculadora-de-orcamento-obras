<?php

header('Content-Type: application/json');

$jsonData = file_get_contents("php://input");
$url = 'http://localhost:3000/calculadora/calcular_itens';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);

$resposta = curl_exec($ch);
curl_close($ch);
echo $resposta;

?>