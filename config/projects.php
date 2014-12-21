<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$projects = get_object_vars($request)['projects'];
foreach ($projects as $project) {
	file_put_contents( $project->projectId . '.json', json_encode($project));
};
file_put_contents('projects.json', json_encode($request));
?>