
<?php
include_once __DIR__ . '/../../config.php';
include_once __DIR__ . '/../../common/function.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 - Page Not Found</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Poppins',sans-serif;
}

body{
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow:hidden;
    background:linear-gradient(135deg,#0f172a,#1d4ed8,#2563eb);
    color:#fff;
}

/* Animated Background */

body::before{
    content:"";
    position:absolute;
    width:150%;
    height:150%;
    background:
        radial-gradient(circle,#ffffff22 2px,transparent 2px);
    background-size:40px 40px;
    animation:move 40s linear infinite;
}

@keyframes move{

    from{
        transform:translateY(0);
    }

    to{
        transform:translateY(-300px);
    }

}

.container{

    width:90%;
    max-width:1100px;

    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:60px;

    background:rgba(255,255,255,.08);

    backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,.2);

    border-radius:30px;

    padding:60px;

    box-shadow:0 25px 60px rgba(0,0,0,.35);

    z-index:5;

}

.left{

    flex:1;

}

.left h1{

    font-size:120px;
    font-weight:700;
    line-height:1;

}

.left h2{

    font-size:40px;
    margin:15px 0;

}

.left p{

    color:#dbeafe;
    line-height:1.8;
    margin-bottom:35px;

}

.btn{

    display:inline-block;
    text-decoration:none;

    padding:16px 35px;

    background:#fff;
    color:#1d4ed8;

    border-radius:50px;

    font-weight:600;

    transition:.3s;

}

.btn:hover{

    background:#2563eb;
    color:#fff;
    transform:translateY(-4px);

}

.right{

    flex:1;
    display:flex;
    justify-content:center;

}

.astronaut{

    font-size:180px;

    animation:float 4s ease-in-out infinite;

    filter:drop-shadow(0 15px 20px rgba(0,0,0,.4));

}

@keyframes float{

    0%{
        transform:translateY(0px);
    }

    50%{
        transform:translateY(-25px);
    }

    100%{
        transform:translateY(0px);
    }

}

.circle{

    position:absolute;

    border-radius:50%;

    background:rgba(255,255,255,.08);

}

.c1{

    width:250px;
    height:250px;

    left:-100px;
    top:-100px;

}

.c2{

    width:180px;
    height:180px;

    right:-50px;
    bottom:-60px;

}

.c3{

    width:120px;
    height:120px;

    right:15%;
    top:10%;

}

@media(max-width:900px){

.container{

    flex-direction:column;
    text-align:center;

    padding:40px;

}

.left h1{

    font-size:90px;

}

.left h2{

    font-size:32px;

}

.astronaut{

    font-size:130px;

}

}

</style>

</head>

<body>

<div class="circle c1"></div>
<div class="circle c2"></div>
<div class="circle c3"></div>

<div class="container">

    <div class="left">

        <h1>404</h1>

        <h2>Oops! Page Not Found</h2>

        <p>
            The page you're looking for may have been removed,
            renamed, or is temporarily unavailable.
            Click the button below to return to the homepage.
        </p>
        <a href="<?= url('splash') ?>" class="btn <?= isActive('loan') ? 'active' : '' ?>">
            🏠 Back to Home
        </a>

    </div>

    <div class="right">

        <div class="astronaut">
            <img src="/indo-lending-system/assets/img/logo.png" width="250" height="150" alt="">
        </div>

    </div>

</div>

</body>
</html>