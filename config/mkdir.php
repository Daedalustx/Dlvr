<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$folder = get_object_vars($request)['folder'];

// Create a directory

error_log($folder);
		
$path = dirname(__DIR__)."/projects/$folder";
			
if ( is_dir($path) ) {
	$path = substr($path, stripos($path, 'dlvr'));
	$response = 'folder already exists at:<br>' . $path; 
} else if (mkdir($path, 0755) ) {
	$path = substr($path, stripos($path, 'dlvr'));
	$response = 'Successfully created folder at:<br>' . $path;
} else {
	$response = 'Could not create folder<br>an unknown error occurred';
}


// Send back the html for the success message

echo $response;

?>