<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$projects = get_object_vars($request)['projects'];
foreach ($projects as $project) {
	file_put_contents( $project->projectId . '.json', json_encode($project));
	$flag = dirname(__DIR__)."/$project->projectRootPath";
	if ( is_dir($flag) ) {
		$response = $project->projectName . ' Configured Successfully<br><small>project folder found at: ' . $flag . '</small>'; 
	} else {
		$response = $project->projectName . ' Configured Successfully<br><small style="display:block;background-color:#C55;">project folder not found...</small>';
	};
};
file_put_contents('projects.json', json_encode($request));
echo $response;
?>