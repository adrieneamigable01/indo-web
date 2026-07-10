<?php


require_once __DIR__ . '/config.php';
require_once __DIR__ . '/common/function.php';
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