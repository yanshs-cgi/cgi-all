<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>anon404</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0b0f14;
      color:#e5e7eb;
      font-family:monospace;
      overflow:hidden;
    }
    .wrap{
      text-align:center;
      border:1px solid #1f2937;
      padding:40px 60px;
      box-shadow:0 0 40px rgba(0,255,170,.15);
      background:rgba(15,23,42,.6);
      backdrop-filter:blur(6px);
    }
    h1{
      font-size:48px;
      letter-spacing:4px;
      color:#00ffaa;
      text-shadow:0 0 10px rgba(0,255,170,.6);
      margin-bottom:10px;
    }
    p{
      color:#9ca3af;
      margin-bottom:20px;
    }
    .glitch{
      position:relative;
      display:inline-block;
    }
    .glitch::before,.glitch::after{
      content:attr(data-text);
      position:absolute;
      left:0;top:0;
      width:100%;
      overflow:hidden;
    }
    .glitch::before{
      color:#ff0055;
      animation:glitch1 2s infinite linear alternate-reverse;
    }
    .glitch::after{
      color:#00ccff;
      animation:glitch2 1.5s infinite linear alternate-reverse;
    }
    @keyframes glitch1{
      0%{clip-path:inset(20% 0 60% 0)}
      50%{clip-path:inset(40% 0 20% 0)}
      100%{clip-path:inset(10% 0 80% 0)}
    }
    @keyframes glitch2{
      0%{clip-path:inset(60% 0 20% 0)}
      50%{clip-path:inset(30% 0 40% 0)}
      100%{clip-path:inset(80% 0 5% 0)}
    }
    footer{
      margin-top:20px;
      font-size:12px;
      color:#6b7280;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1 class="glitch" data-text="TRASER SEC TEAM TRASER SEC TEAM TRASER SEC TEAM TRASER SEC TEAM TRASER SEC TEAM TRASER SEC TEAM TRASER SEC TEAM TRASER SEC TEAM ">Touch BY Anon404</h1>
    <p>BHJAL</p>
    <footer>© Traser Sec Team</footer>
  </div>
</body>
</html>