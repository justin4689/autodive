<?php
define("LARAVEL_START", microtime(true));
require "/var/www/vendor/autoload.php";
$app = require_once "/var/www/bootstrap/app.php";
echo "bootstrap OK - " . round((microtime(true) - LARAVEL_START) * 1000) . "ms";
