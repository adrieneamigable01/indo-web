<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome | LendingPro</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">

    <meta http-equiv="refresh" content="3;url=<?= url('login') ?>">

    <style>

        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
        }

        body{
            height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            overflow:hidden;
            background:linear-gradient(135deg,#0d6efd,#0a58ca);
            font-family:'Segoe UI',sans-serif;
        }

        .background{
            position:absolute;
            inset:0;
            overflow:hidden;
        }

        .circle{
            position:absolute;
            border-radius:50%;
            background:rgba(255,255,255,.08);
            animation:float 8s infinite ease-in-out;
        }

        .circle:nth-child(1){
            width:220px;
            height:220px;
            top:-70px;
            left:-60px;
        }

        .circle:nth-child(2){
            width:320px;
            height:320px;
            right:-120px;
            bottom:-100px;
            animation-duration:10s;
        }

        .circle:nth-child(3){
            width:150px;
            height:150px;
            right:18%;
            top:15%;
            animation-duration:7s;
        }

        @keyframes float{
            0%,100%{
                transform:translateY(0px);
            }
            50%{
                transform:translateY(-20px);
            }
        }

        .card-splash{

            width:430px;
            max-width:92%;
            padding:50px;
            text-align:center;
            border-radius:25px;
            background:rgba(255,255,255,.12);
            backdrop-filter:blur(15px);
            color:#fff;
            z-index:2;
            box-shadow:0 20px 60px rgba(0,0,0,.25);

        }

        .logo{

            width:110px;
            height:110px;
            border-radius:50%;
            background:#fff;
            color:#0d6efd;
            display:flex;
            justify-content:center;
            align-items:center;
            font-size:48px;
            margin:auto;
            margin-bottom:25px;
            animation:pulse 2s infinite;

        }

        @keyframes pulse{

            0%{
                transform:scale(1);
            }

            50%{
                transform:scale(1.08);
            }

            100%{
                transform:scale(1);
            }

        }

        h1{

            font-weight:700;
            margin-bottom:10px;

        }

        p{

            opacity:.9;

        }

        .spinner-border{

            width:50px;
            height:50px;
            margin-top:35px;

        }

        .version{

            margin-top:30px;
            opacity:.75;
            font-size:14px;

        }

    </style>

</head>
<body>

<div class="background">

    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>

</div>

<div class="card-splash">

    <div class="logo">
        🏦
    </div>

    <h1>LendingPro</h1>

    <p>
        Loan Management System
    </p>

    <div class="spinner-border text-light"></div>

    <div class="version">
        Initializing System...
    </div>

</div>

</body>
</html>