<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$projects = get_object_vars($request)['projects'];
$action = get_object_vars($request)['action'];
$projectToUpdate = get_object_vars($request)['project'];

// Update individual settings files based on requested action

if ($action == "delete") {

	unlink( $projectToUpdate . '.json' );
	
	$response = $projectToUpdate . '.json' . ' Deleted<br><small>Media files not affected</small>';
	
} else {

	if ($action == "create") { $action_text = ' Created '; };
	
	if ($action == "edit") { $action_text = ' Edited '; };
	
	foreach ($projects as $project) {
	
		file_put_contents( $project->projectId . '.json', json_encode($project));
		
		if ($project->projectId == $projectToUpdate) {
		
			$flag = dirname(__DIR__)."/projects/$project->projectRootPath";
			
			if ( is_dir($flag) ) {
			
				$response = $project->projectName . $action_text . 'Successfully<br><small>project folder found at: ' . $flag . '</small>'; 
				
			} else {
			
				$response = $project->projectName . $action_text . 'Successfully<br><small style="display:block;background-color:#C55;">project folder not found...</small>';
				
			};
			
		};
		
	};

};

// Update main projects file

file_put_contents('projects.json', json_encode($request));

// Send back the html for the success message

echo $response;

?>