<?php
define("LARAVEL_START", microtime(true));
require "/var/www/vendor/autoload.php";
$app = require_once "/var/www/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::capture();
echo "before handle - " . round((microtime(true) - LARAVEL_START) * 1000) . "ms\n";
flush();
$response = $kernel->handle($request);
echo "after handle - " . round((microtime(true) - LARAVEL_START) * 1000) . "ms\n";
