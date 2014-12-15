<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
/*error_log( print_r($request, true));*/
file_put_contents('projects.json', json_encode($request));
?>