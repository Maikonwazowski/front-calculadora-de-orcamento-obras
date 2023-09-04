<?php
    
    $url = 'http://localhost:3000/calculadora/listar_categorias';

    $ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
    
    $resposta = curl_exec($ch);
    curl_close($ch); 
    
    echo $resposta;
?>