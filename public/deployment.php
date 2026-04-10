<?php

// Your secret key for webhook verification
$secret = $_ENV['WEBHOOK_SECRET'] ?? 'c7953762007ff0ed28a65d2da584491c'; // Use environment variable for security

// Security headers
header('Content-Type: text/plain');

// Get the payload from GitHub
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '';

// Verify the payload signature
if ($signature) {
    list($algo, $hash) = explode('=', $signature, 2);
    if ($hash !== hash_hmac($algo, $payload, $secret)) {
        http_response_code(403);
        exit('Invalid signature');
    }
}

// Define the project root directory
$projectRoot = '/home/indeoiye/identifyam.com';

// Log deployment
$logFile = $projectRoot . '/storage/logs/deployment.log';
if (!is_dir(dirname($logFile))) {
    mkdir(dirname($logFile), 0755, true);
}

$logMessage = date('Y-m-d H:i:s') . " - Deployment started\n";
file_put_contents($logFile, $logMessage, FILE_APPEND);

// Function to execute command and log output
function executeCommand($command, $description) {
    global $projectRoot;
    echo "<pre>🔄 $description...\n";
    $output = shell_exec("cd $projectRoot && $command 2>&1");
    echo "<pre>$description Output:\n$output</pre>";
    return $output;
}

// Pull the latest changes from the repository
executeCommand("git pull origin main", "Pulling latest changes from repository");

// Install composer dependencies
executeCommand("composer install --no-interaction --prefer-dist --optimize-autoloader", "Installing composer dependencies");

// Clear Laravel caches
executeCommand("php artisan cache:clear", "Clearing application cache");
executeCommand("php artisan config:clear", "Clearing configuration cache");
executeCommand("php artisan route:clear", "Clearing route cache");
executeCommand("php artisan view:clear", "Clearing view cache");

// Run database migrations
executeCommand("php artisan migrate --force", "Running database migrations");

// Optimize Laravel
executeCommand("php artisan optimize:clear", "Clearing optimization cache");
executeCommand("php artisan optimize", "Optimizing Laravel performance");

// Create storage links
executeCommand("php artisan storage:link", "Creating storage symbolic links");

// Set correct permissions for Namecheap hosting
echo "<pre>🔐 Setting file permissions for Namecheap hosting...\n";
shell_exec("cd $projectRoot && chmod -R 755 storage");
shell_exec("cd $projectRoot && chmod -R 755 bootstrap/cache");
shell_exec("cd $projectRoot && chmod -R 644 storage/logs");
shell_exec("cd $projectRoot && chown -R www-data:www-data storage bootstrap/cache 2>/dev/null");

// Restart services if needed (uncomment if using supervisor)
// executeCommand("supervisorctl restart laravel-worker-*", "Restarting queue workers");

// Log completion
$completionMessage = date('Y-m-d H:i:s') . " - Deployment completed successfully\n";
file_put_contents($logFile, $completionMessage, FILE_APPEND);

echo "<pre>✅ Deployment completed successfully!</pre>";
echo "<pre>🌐 Your site identifyam.com should be updated</pre>";
echo "<pre>📊 Deployment log saved to: $logFile</pre>";

// Optional: Send notification (uncomment and configure)
// mail('your-email@example.com', 'Deployment Completed', 'Your Laravel app has been deployed successfully.');

?>
