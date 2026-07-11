<?php

require_once __DIR__ . '/config.php';

$currentRoute = trim($_GET['route'] ?? '', '/');

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
           str_starts_with($currentRoute, $route . '/');
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