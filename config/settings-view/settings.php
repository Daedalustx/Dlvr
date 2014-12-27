<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// check for folder existence first

$path = dirname( dirname(__DIR__) ) . '/projects/' . $request->rootPath . '/project.json';
error_log( $path);

file_put_contents($path, json_encode($request));

// echo a response
?>