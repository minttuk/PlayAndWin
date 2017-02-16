
<!doctype html>
<html>
<head>
    <title>Reaction Tester</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

<style>


    body {
      font-family:Arial, Verdana, sans-serif;
    }

    #box {
      position:absolute;
      height:100px;
      width:100px;
      display:none;
      -webkit-animation: fadein 2s;
    }

    @-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
    }

    #start {
      height:300px;
      width:300px;
      border-radius:150px;
      vertical-align: middle;
      color:#f4f0ec;
      text-align: center;
      vertical-align: middle;
      margin-left: auto;
      margin-right: auto;
      margin-top: 80px;
      line-height: 2;
     }

     #result {
       font-weight:bold;
     }

     #start h1 {
       font-weight:bold;
       font-size:3em;
       line-height: 270px;
       margin-bottom:0px;
     }

     #start p {
       margin-top:-110px;
       font-size:0.8em;
     }

    #text {
      color:#f5f5f5;
      background-color:#c4c4c4;
      border-radius:10px;
      font-size:1.1em;
      margin-left: auto;
      margin-right: auto;
      width:170px;
      height: 65px;
      padding-top:1px;
      padding-bottom:4px;
      margin-top:5%;
      display:none;
      line-height: 1.2;
      text-align:center;
    }

    #average {
      margin-top:-15px;
      font-size:0.6em;
    }

    #highscore {
      display:none;
      color:#f5f5f5;
      background-color:#c4c4c4;
      height: 50px;
      width:170px;
      margin-top:10%;
      margin-left: auto;
      margin-right: auto;
      text-align:center;
      border-radius:10px;
      padding-top:3px;
    }

    #footer {
      width:84px;
      position:fixed;
      bottom:0;
      font-size:0.6em;
      color:#787878;
      margin-left:-42px;
      left:50%;
      margin-bottom:3px;
    }

</style>
</head>

<body onLoad = "startColor()">

    <div id="text">
      <p>Your score: <span id="result"></span></br>Your highscore: <span id="score"></span></p>
    </div>

    <div id="box"></div>

    <div id="start">
      <h1 id="again">START</h1>
      <p>Press the shapes as fast as you can 5 times!</p>
    </div>

    <script>

          var clickedTime; var createdTime; var reactionTime;
          var clickCount; var reactionTotal; var highScore=999;
          var boxStyle = document.getElementById("box").style;
          var startCircle = document.getElementById("start").style;
          var dialog = document.getElementById("text").style;

          boxColor=["plum","chartreuse","magenta","springgreen","gold","cyan",
                    "steelblue","orange","hotpink","aqua","coral","tomato",]

            function startColor() {startCircle.background = boxColor[Math.round(Math.random()*boxColor.length)]}

            function makeBox() {

                var boxShape=Math.random()*60 + 5 + "px";
                var time=(Math.random()*1000);
                var boxVertical=Math.random()*window.innerHeight - 100;
                var boxHorizontal=Math.random()*window.innerWidth - 100;

                while (boxVertical < 100) {
                  boxVertical=Math.random()*window.innerHeight - 100;
                }
                while (boxHorizontal < 100) {
                  boxHorizontal=Math.random()*window.innerWidth - 100;
                }
                setTimeout(function() {
                  boxStyle.borderRadius = boxShape;
                  boxStyle.display = "block";
                  boxStyle.background = '#'+ Math.round(0xffffff*Math.random()).toString(16);
                  boxStyle.left = boxHorizontal + "px";
                  boxStyle.top = boxVertical + "px";
                  createdTime = Date.now();
                }, time);
            }

            document.getElementById("box").onclick=function() {
                clickedTime = Date.now();
                reactionTime = (clickedTime - createdTime)/700;
                console.log(reactionTime + "s");
                clickCount++;
                this.style.display = "none";
                if (clickCount==5) {
                  while(reactionTotal < highScore) {highScore = reactionTotal}
                  document.getElementById("again").innerHTML = "Again?";
                  document.getElementById("result").innerHTML = Math.round(1000/reactionTotal);
                  //document.getElementById("score").innerHTML = highScore.toFixed(2) +"s";
                  $.post("../../hshandler.php", { game:'reaction', score:Math.round(1000/highScore) }, function(data){
                    if (data.highscore != 0) {
                      $('#score').html(data.highscore);
                    }
                    if (data.message != '') {
                      alert(data.message);
                    }
                  },'json');

                  startColor();
                  startCircle.display = "block";
                  dialog.display = "block";
                } else { makeBox();;
                  reactionTotal = reactionTotal+reactionTime;}
              }

              document.getElementById("start").onclick=function() {
                  clickCount = 0; reactionTotal = 0;
                  startCircle.display = "none";
                  dialog.display = "none";
                  makeBox();
              }

    </script>

</body>
</html>
