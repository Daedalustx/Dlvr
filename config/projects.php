<?php
$postdata = file_get_contents("php://input");
if (!$postdata) die();
$request = json_decode($postdata);
$projects = get_object_vars($request)['projects'];
$action = get_object_vars($request)['action'];
$projectToUpdate = get_object_vars($request)['project'];

// Update individual settings files based on requested action

if ($action == "delete") {

	unlink( '../projects/' . $projectToUpdate . '.json' );
	
	$response = $projectToUpdate . '.json' . ' Deleted<br><small>Media and settings files were not affected</small>';
	
} else {

	if ($action == "create") { $action_text = ' Created '; };
	
	if ($action == "edit") { $action_text = ' Edited '; };
	
	foreach ($projects as $project) {
		
		if ($project->projectId == $projectToUpdate) {
			
			file_put_contents( '../projects/' . $project->projectId . '.json', json_encode($project));
		
			$path = dirname(__DIR__)."/projects/$project->projectRootPath";
			
			if ( is_dir($path) ) {
				$folder = substr($path, stripos($path, 'dlvr'));
				$response = $project->projectName . $action_text . 'Successfully<br><small>project folder found at:<br>' . $folder . '</small>'; 
				$project->linked = true;
			} else {
			
				$response = $project->projectName . $action_text . 'Successfully<br><small style="display:block;background-color:#C55;">project folder not found...</small>';
				
				$project->linked = false;
				
			};
			
		};
		
	};

};

// Update main projects file

unset($request->project);

unset($request->action);

file_put_contents('projects/projects.json', json_encode($request));

// Send back the html for the success message

echo $response;

?>