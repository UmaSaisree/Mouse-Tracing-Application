document.addEventListener("DOMContentLoaded", function() {

    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    const headingElement = document.getElementById("heading");
    const startButton = document.getElementById("start");
    const next1Button = document.getElementById("next1");
    const codeElement = document.getElementById("code");
    const saveButton = document.getElementById("save");
    const menuContainer = document.getElementById("menu");
    const finishMessage = document.getElementById("finish");
    const gameScreenContainer = document.getElementById("gameScreen");
    const gameContainer = document.getElementById("game");
    const instructionsContainer0 = document.getElementById("instructions0");
    const instructionsContainer1 = document.getElementById("instructions1");
    const instructionsContainer2 = document.getElementById("instructions2");
    const instructionsContainer3 = document.getElementById("instructions3");
    const breakContainer1 = document.getElementById("break1");
    const breakContainer2 = document.getElementById("break2");
    const countdownElement = document.getElementById("countdown");
    const targetColorInput = document.getElementsByName("tgtcolor");
    const bgColorInput = document.getElementsByName("bgcolor");
    const durationElement = document.getElementById("duration");
    const cursorType = document.getElementsByName("cursorType");
    const timerElement = document.getElementById('timeLeft');
    const endingElement = document.getElementById("ending");


    let targetColor = "";
    let cursorTypeValue = "";
    let bgColor = "";
    let isGameActive = false;
    let score = 0;
    let score1 = 0;
    let score2 = 0;
    let score3 = 0;
    let code;
    let series = 0;
    let difficulty;
    let targetSize;
    let first = 0;

    var animationFrameId;
    var distances = [];
    var scoreUpdateCount = 0;
    var clientx = 0;
    var clienty = 0;
    var cicle = 0;
    var num_entity = 1;
    var worm;
    var path;
    window.onresize = fixdim;

    class Worm{
        constructor(x, y, color){
          this.velx = 0;
          this.vely = 0;
          this.posx = x;
          this.posy = y;
          this.color = getnowcolor(color);
          this.currentColor = "black";
          this.targetX = randomPoint("x");
          this.targetY = randomPoint("y");
        }
        draw(newx, newy){
          this.posx = newx;
          this.posy = newy;
          ctx.beginPath();
          ctx.arc(this.posx, this.posy, 10, 0, 2 * Math.PI); // Circle with radius 5
          ctx.fillStyle = this.currentColor;
          ctx.fill();
        }
    }
      
      
    class Path{
        constructor(color){
          this.paths = [];
          this.color = color;
        }
        update(){
          for(var i = 1; i < this.paths.length; i++){
                ctx.beginPath();
              ctx.lineWidth = 3;
              ctx.moveTo(this.paths[i-1].x, this.paths[i-1].y);
              ctx.lineTo(this.paths[i].x, this.paths[i].y);
              ctx.strokeStyle = getnowcolor(this.color, i/150);
              ctx.stroke();
            }
        }
    }
    

    next1Button.addEventListener('click', function(event){
        code = codeElement.value;
        // targetSize = targetSize*parseInt(targetSizeInput.value);
        
        menuContainer.style.display = "none";
        headingElement.style.display = "none";
        if(first == 0)
        instructionsContainer0.style.display = "block";
        else if(first == 1){
            next1Button.style.display = "none";
            instructionsContainer0.style.display = "none";
            instructionsContainer1.style.display = "block";
            startButton.style.display = "block";
        }
        
        first+=1

    })

    startButton.addEventListener('click', function(event) { 

        startButton.style.display = "none";
        instructionsContainer0.style.display = "none";
        instructionsContainer1.style.display = "none";
        instructionsContainer2.style.display = "none";
        instructionsContainer3.style.display = "none";
        series += 1;
        startGame(series);  // call startGame with the initial round number
    });

    document.getElementById('difficultyDropdown').addEventListener('click', function(event) {
        if (event.target.matches('.dropdown-item')) {
            difficulty = event.target.getAttribute('data-value');
            let buttonText = event.target.textContent;
            this.querySelector('button').textContent = buttonText;
        }
    });

    document.getElementById('sizeDropdown').addEventListener('click', function(event) {
        if (event.target.matches('.dropdown-item')) {
            targetSize = event.target.getAttribute('data-value');
            let buttonText = event.target.textContent;
            this.querySelector('button').textContent = buttonText;
        }
    });


    function startGame(i = 1){
        menuContainer.style.display = "none";
        headingElement.style.display = "none";
        startCountdown(3, i);
        // if(i==0){
        //     instructionsContainer1.style.display = "block";
        //     startButton.style.display = "block";
        // }
        // else{
        // startCountdown(3, i);
        // }
    }

    function startCountdown(seconds, iteration) {
        let given = seconds;
        countdownElement.style.display = "block";
        countdownElement.textContent = seconds;
        const countdownInterval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = "none";
                endingElement.style.display = "none";
                if (given == 3)
                beginGame(iteration);
                else {
                    if(iteration==2){
                        breakContainer1.style.display = "none";
                        instructionsContainer2.style.display = "block";
                        startButton.style.display = "block";
                   }
                   else{
                    breakContainer2.style.display = "none";
                    instructionsContainer3.style.display = "block";
                    startButton.style.display = "block";
                   }
                }

            }
            else{
                countdownElement.textContent = seconds;
            }
        }, 1000);
    }

    function beginGame(iteration){
        gameScreenContainer.style.display = "block";
        gameContainer.style.display = "block";
        timerElement.style.display = "block";
        cursorTypeValue = getSelectedValue(cursorType);
        bgColor = getSelectedValue(bgColorInput);
        gameScreenContainer.style.cursor = cursorTypeValue;
        gameScreenContainer.style.backgroundColor = bgColor;
        start.style.display = "none";
        targetColor = getSelectedValue(targetColorInput);
        isGameActive = true;
        //const difficultyLevel = parseFloat(difficultyLevelInput.value);
        const durationTime = parseFloat(durationElement.value)*60000;
        let timeLeft = parseInt(durationTime / 1000);
        const gameTimer = setInterval(() => {
            timeLeft--;  // decrease the time
            if(timeLeft <= 5){
                endingElement.style.display = "block";
                endingElement.textContent = timeLeft;

            }
            timerElement.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                endingElement.style.display = "none";
            }
        }, 1000);
        distances = [];
        scoreUpdateCount = 0;
        score = 0;
        init()
        loop()
        scoreInterval = setInterval(updateScore, 100);
        gameInterval = setTimeout(()=>{
            endGame(iteration);}, 
            durationTime
        );
        

    }
    
    function init(){
        fixdim();
        var color = Math.floor((Math.random() * 255) + 1);
        worm = new Worm(Math.floor((Math.random() * window.innerWidth) + 1),Math.floor((Math.random() * window.innerHeight) + 1));
        worm.currentColor = targetColor;
        path = new Path(color);
    
    }

    function loop(){
        cicle++;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
      
        goToTarget(worm);    
        worm.draw(worm.posx + worm.velx, worm.posy + worm.vely);
          
        if(Math.abs(worm.posx - worm.targetX) <= 2 && Math.abs(worm.posy - worm.targetY) <= 2){
            worm.targetX = randomPoint("x");
            worm.targetY = randomPoint("y");
            ctx.fillRect(worm.targetX, worm.targetY, 5, 5);
            ctx.fillStyle = worm.color;
        }
          
        if(cicle == 2){
            path.paths.push({x: worm.posx, y: worm.posy});
        }
          
        path.update();
          
        if(path.paths.length > 150){
            path.paths.shift();
        }
      
        
        if(cicle == 2){
          cicle = 0;
        }
        
        animationFrameId = requestAnimationFrame(loop);
    }
      
    function fixdim(){
        canvas.width = gameScreenContainer.clientWidth;
        canvas.height = gameScreenContainer.clientHeight;
    }
      
    function getnowcolor(num, op = 1){
        var color = num;
        return "hsla(" + color +", 70%, 40%," + op + ")";
    }

    function goToTarget(worm){

        worm.posx = Math.max(0, Math.min(worm.posx + worm.velx, canvas.width));
        worm.posy = Math.max(0, Math.min(worm.posy + worm.vely, canvas.height));
        
        // worm.velx = (worm.targetX > worm.posx) ? 2 : (worm.targetX < worm.posx) ? -2 : 0;
        // worm.vely = (worm.targetY > worm.posy) ? 2 : (worm.targetY < worm.posy) ? -2 : 0;

        
        if(worm.targetX > worm.posx){
          worm.velx = 1;
        }else if(Math.abs(worm.posx - worm.targetX) <= 2){
          worm.velx = 0;
        }else{
          worm.velx = -1;
        }
        
        if(worm.targetY > worm.posy){
          worm.vely = 1;
        }else if(Math.abs(worm.posy - worm.targetY) <= 2){
          worm.vely = 0;
        }else{
          worm.vely = -1;
        }
    }
      
    function randomPoint(what){
        var rx = Math.floor(Math.random() * (canvas.width - 10) + 5); 
        var ry = Math.floor(Math.random() * (canvas.height - 10) + 5);
        return (what == "x") ? rx : ry;
    }
      
    function changeTarget(){
        for(var i = 0; i < num_entity; i++){
          worms[i].targetX = randomPoint("x");
          worms[i].targetY = randomPoint("y");
        }
    }
    
    function updateScore() {
        var dx = worm.posx - clientx;
        var dy = worm.posy - clienty;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if(distance > 800)
        distance = 500;
        distances.push(distance);
        scoreUpdateCount++;

        if (scoreUpdateCount >= 60) {
            var minuteAverage = distances.reduce((a, b) => a + b, 0) / distances.length;
            console.log(minuteAverage);
            var scaledScore = (minuteAverage/8) 
            score = (score + scaledScore)/2// Update score with the average
            console.log(score);
            distances = []; // Reset distances for the next minute
            scoreUpdateCount = 0;
        }
    }
    
    // Update the mouse position
    canvas.addEventListener('mousemove', (e) => {
        clientx = e.clientX - canvas.getBoundingClientRect().left;
        clienty = e.clientY - canvas.getBoundingClientRect().top;
        var dx = clientx - worm.posx;
        var dy = clienty - worm.posy;
        var distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is less than or equal to the radius of the circle, change color
        if (distance <= 10) {
            worm.currentColor = 'red'; // Change to red when hovering
        } else {
            worm.currentColor = targetColor; // Revert to original color
        }
    });

    function updateStats(iteration) {
        if(iteration==1){
            score1 = 100 - score;
        }
        else if(iteration==2){
            score2 = 100 - score;
        }
        else if(iteration==3){
            score3 = 100 - score;
        }
    }
    
    function endGame(iteration) {
        delete worm;
        delete path;
        clearTimeout(gameInterval);
        clearInterval(scoreInterval);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        isGameActive = false;
        clearInterval(gameInterval);
        gameScreenContainer.style.display = "none";
        gameContainer.style.display = "none";
        timerElement.style.display = "none";
        document.body.style.cursor = "auto";
        updateStats(iteration);
        if (iteration < 3){
            if (iteration == 1)
            breakContainer1.style.display = "block";
            else if (iteration == 2)
            breakContainer2.style.display = "block";
            startCountdown(10, iteration+1); //break duration debugging
        }
        else{
            setTimeout(() => {
                saveButton.style.display = "block";
            }, 1000);
            finishMessage.style.display = "block"; 
        }
        
    }

    function getSelectedValue(ele){
        for(i=0; i<ele.length; i++){
            if (ele[i].checked == true){
                return ele[i].value;
            }
        }
    }

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        
        // Ensure that both minutes and seconds are two digits
        minutes = (minutes < 10 ? '0' : '') + minutes;
        remainingSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    
        return `${minutes}:${remainingSeconds}`;
    }





})