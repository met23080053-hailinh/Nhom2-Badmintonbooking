<?php
$data = ['user_id'=>1,'court_id'=>1,'start_time'=>'2026-10-24 18:00:00','end_time'=>'2026-10-24 20:00:00','player_name'=>'Test','player_phone'=>'123'];
$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/json',
        'content' => json_encode($data)
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents('http://localhost/backend/create_booking.php', false, $context);
echo $result;
?>
