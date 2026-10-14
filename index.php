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
?>
<script>
$(document).ready(function() {

    // ✅ Menu click - Show SweetAlert2 popup for PDF title
    $("#btnGenerateNames").click(function(e) {
        e.preventDefault();

        Swal.fire({
            title: '<i class="bi bi-file-earmark-pdf me-2"></i>Generate Borrower Incentives PDF',
            html: `
                <div class="text-start">
                    <div class="alert alert-info py-2">
                        <i class="bi bi-info-circle me-2"></i>
                        Please enter a title for your PDF document.
                    </div>
                    
                    <div class="mb-3">
                        <label for="swal-incentive-title" class="form-label fw-bold">
                            PDF Title <span class="text-danger">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="swal-incentive-title" 
                            class="form-control" 
                            placeholder="e.g., Borrower Incentives - October 2026"
                            value="Borrower Incentives List">
                    </div>

                    <hr class="my-3">

                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-file-earmark-pdf me-2"></i>Generate PDF',
            cancelButtonText: '<i class="bi bi-x-circle me-2"></i>Cancel',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            width: '500px',
            showLoaderOnConfirm: false,
            preConfirm: () => {
                const title = document.getElementById('swal-incentive-title').value.trim();
                if (!title) {
                    Swal.showValidationMessage('Please enter a PDF title.');
                    return false;
                }

                return {
                    title: title,
                };
            },
            didOpen: () => {
                // Focus on title input
                document.getElementById('swal-incentive-title').focus();
                
                // Allow Enter key to submit
                document.getElementById('swal-incentive-title').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const data = result.value;
                generateIncentivePdf(data.title);
            }
        });

    });

    // ✅ Helper function to build year options
    function buildYearOptions() {
        const currentYear = new Date().getFullYear();
        let options = '';
        for (let y = currentYear; y >= currentYear - 5; y--) {
            options += `<option value="${y}">${y}</option>`;
        }
        return options;
    }

    // ✅ Generate PDF function
    function generateIncentivePdf(title, status, year) {
        // Build query string
        let queryParams = new URLSearchParams();
        queryParams.append('title', title);


        // Build the URL with GET parameters
        const generateUrl = 'https://indo-pacific-api.doitcebutech.com/public/borrower/generate-list?'+ queryParams.toString()

        console.log("Generating PDF with URL:", generateUrl);

        // Show loading
        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait while we prepare your borrower incentives list.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Open PDF in new tab/window
        const newWindow = window.open(generateUrl, '_blank');

        // Check if popup was blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Popup Blocked',
                text: 'Please allow popups for this site to download the PDF.',
                confirmButtonText: 'OK'
            });
        } else {
            // Hide loading after a short delay
            setTimeout(() => {
                Swal.close();
            }, 1000);
        }
    }

});

</script>