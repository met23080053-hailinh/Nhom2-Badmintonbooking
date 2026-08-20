<?php
require 'db_connection.php';

try {
    for ($i = 4; $i <= 20; $i++) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO courts (id, name, location, price_per_hour) VALUES (?, 'Dummy Court', 'Dummy Location', 100000)");
        $stmt->execute([$i]);
    }
    echo "Success";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
