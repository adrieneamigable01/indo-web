<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/config.php';

$currentRoute = trim($_GET['route'] ?? '', '/');

// Change this to your project folder if needed.
// Examples:
// '/'                  -> http://localhost/
// '/lending/'          -> http://localhost/lending/
// '/LendingPro/'       -> http://localhost/LendingPro/


$base = APP_BASE;

function url($path)
{

    global $base;
    return rtrim($base, '/') . '/' . ltrim($path, '/');
}

function isActive($route)
{
    global $currentRoute;

    return $currentRoute === $route ||
        strpos($currentRoute, $route . '/') === 0;

}


$route = trim($_GET['route'] ?? '', '/');

$routes = require 'routes.php';

if (isset($routes[$route])) {

    require $routes[$route];

} else {

    http_response_code(404);

    if (file_exists(__DIR__ . '/pages/error/404.php')) {
        require __DIR__ . '/pages/error/404.php';
    } else {
        echo "<h1>404 - Page Not Found</h1>";
    }

    exit;
}