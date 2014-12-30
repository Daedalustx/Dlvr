<?php
$postdata = file_get_contents("php://input");

if (!$postdata) die();

function clean($data, $strip) {
	$data = trim($data);
	if ($strip == true) $data = stripslashes($data);
	$data = htmlSpecialChars($data);
	return $data;
}

$request = json_decode($postdata);

if ( $request === null || !isset($request->project) ) {
	http_response_code(400);
	die('Bad Request');
}

$action = clean( get_object_vars($request)['action'], true );

$projectToUpdate = clean( get_object_vars($request)['project'], true );

$projects = get_object_vars($request)['projects'];

$response = new stdClass();

// Update individual settings files based on requested action

if ($action == "create") { $action_text = ' Created '; };

if ($action == "edit") { $action_text = ' Edited '; };

foreach ($projects as $key => $project) {

	$project->projectId = clean( $project->projectId, true );
	$project->projectName = clean( $project->projectName, true );
	$project->projectRootPath = clean( $project->projectRootPath, false );
	$project->projectLogo = clean( $project->projectLogo, false );
	if ( is_bool( $project->configNightTheme ) === false ) $project->configNightTheme = true;
	if ( is_bool( $project->linked ) === false || !isset( $project->linked ) ) $project->linked = false;

	if ($project->projectId == $projectToUpdate) {

		if ($action == "delete") {

			unlink( '../projects/' . $projectToUpdate . '.json' );

			$responseText = $projectToUpdate . '.json' . ' Deleted<br><small>Media and settings files were not affected</small>';
	
			unset($projects[$key]);
		
		} else {
	
			file_put_contents( '../projects/' . $project->projectId . '.json', json_encode($project));

			$path = dirname(__DIR__)."/projects/$project->projectRootPath";
	
			if ( is_dir($path) ) {
				$folder = substr($path, stripos($path, 'dlvr'));
				$responseText = $project->projectName . $action_text . 'Successfully<br><small>project folder found at:<br>' . $folder . '</small>'; 
				$project->linked = true;
			} else {
	
				$responseText = $project->projectName . $action_text . 'Successfully<br><small style="display:block;background-color:#C55;">project folder not found...</small>';
		
			};
			
		};
	
	};
	
};

// Update main projects file

unset($request->project);

unset($request->action);

$response->projects = $projects;

file_put_contents('projects/projects.json', json_encode($response));

// Send back the html for the success message

$response->responseText = $responseText;

echo json_encode($response);

?>