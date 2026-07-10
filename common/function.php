<?php

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
           str_starts_with($currentRoute, $route . '/');
}

?>
