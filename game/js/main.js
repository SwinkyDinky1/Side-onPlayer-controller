var startingSpeed = 480;
var speedMultiplier = 1.5;
var speed = startingSpeed;
var currentPos = new Coordinate(0, 80);
var size = new Coordinate(80, 80);
var buttonsHeld = [0, 0, 0];
var gravity = 1500;
var verticalSpeed = 0;
var jumpSpeed = 700;
var isOnGround = false;
var justJumped = false;
var lastFrameTimeStamp = new Date().getTime();
var windowWidth = 1000
var windowHeight = 500
var isWidthGreater = window.innerWidth / windowWidth > window.innerHeight / windowHeight
var relativeSize = (isWidthGreater ? window.innerHeight / windowHeight : window.innerWidth / windowWidth)
var horizontalOffset = (isWidthGreater ? (window.innerWidth - windowWidth * relativeSize) / 2 : 0)
var verticalOffset = (isWidthGreater ? 0 : (window.innerHeight - windowHeight * relativeSize) / 2)
var textToLog = "";
var colided = false;
var deltaTime;
var screenPos = 0;
var doRender = true;
var doCollisions = true;
var collisionTimer = 0;
var platformAmount = windowHeight / 50 + 10
var stats = localStorage.getItem("abilities") ? JSON.parse(localStorage.getItem("abilities")) : [{price:200,specs:[0,0],level:0},{price:300,specs:[0,0],level:0},{price:250,specs:[600],level:1}]
var presetPlatforms = true;
var stopPhysics = false;
var abilities = [];
var settings = {}
var doubleXPTimer = 0;
var doubleXPCooldown = 0;
var doubleXP = false;
var paused = false;
var searchParams = new URLSearchParams(new URL(window.location.href).search)
var currentLocation = searchParams.get("location")
var platforms = []

var frozen = (currentLocation == "frozen" ? 0 : -1)
var frozenClickCounter = 3
var biomes = [
    null,
    "frozen"
]
var backgroundColors = [
    "black",
    "rgb(0,0,25)"
]
var dpUsed = Number(localStorage.getItem("dpUsed"))
dpUsed = dpUsed ? dpUsed : 0
var rpUsed = Number(localStorage.getItem("rpUsed"))
rpUsed = rpUsed ? rpUsed : 0
localStorage.setItem("dpUsed", dpUsed)
localStorage.setItem("rpUsed", rpUsed)

var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

var achievements = localStorage.getItem("achievements")
if (!achievements) {
    achievements = "[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]"
    localStorage.setItem("achievements", achievements)
}
achievements = JSON.parse(achievements)
var recentAchievement = "";
var rATimeout;

function onStart() {
    if(!localStorage.getItem("settings")) {
        localStorage.setItem("settings", JSON.stringify({showCircle: false}))
    }
    if(!localStorage.getItem("abilities")) {
        localStorage.setItem("abilities", JSON.stringify([{price:200,specs:[0,0],level:0},{price:300,specs:[0,0],level:0},{price:250,specs:[600],level:1}]))
    }
    settings = JSON.parse(localStorage.getItem("settings"));
    abilities = JSON.parse(localStorage.getItem("abilities"));
    jumpSpeed = abilities[2].specs[0]
    document.getElementById("svg").style.top = document.getElementById("backgroundSVG").style.top = (isWidthGreater ? "0px" : (window.innerHeight - windowHeight * relativeSize) / 2 + "px")
    document.getElementById("svg").style.left = document.getElementById("backgroundSVG").style.left = (isWidthGreater ? (window.innerWidth - windowWidth * relativeSize) / 2 + "px" : "0px")
    document.getElementById("svg").style.height = document.getElementById("backgroundSVG").style.height = (windowHeight * relativeSize - 2) + "px"
    document.getElementById("svg").style.width = document.getElementById("backgroundSVG").style.width = (windowWidth * relativeSize - 2) + "px"
    document.body.style.backgroundColor = backgroundColors[biomes.indexOf(searchParams.get("location"))]
    try {
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        //if(!presetPlatforms) {
            platforms = [
                [new Line(0, 0, 100, 100), false, false, 0]
            ]
            for(i = 0; i < platformAmount; i++) {
                var x = generateRandomNumber(0, windowWidth - 160)
                var y = generateRandomNumber(platforms[platforms.length - 1][0].point1.y + 10, platforms[platforms.length - 1][0].point1.y + 90)
                //var z = generateRandomNumber(platforms[platforms.length - 1][0].point1.y + 10, platforms[platforms.length - 1][0].point1.y + 90)
                var l = generateRandomNumber(80, 160)
                var r = generateRandomNumber(0, 100) < stats[1].specs[1]
                var b = generateRandomNumber(0, 100) < 2
                platforms.push([new Line(x, y, x + l, y), r, b, (b ? 1 : 0)])
            }
            platforms.shift();
        //}

        document.addEventListener("keydown", function(event) {
            changeInput(event.code, 1);
        })
        document.addEventListener("keyup", function(event) {
            changeInput(event.code, 0);
        })
        document.addEventListener("click", function(event) {
            if(frozen >= 1) {
                frozenClickCounter--
                if(frozenClickCounter <= 0) {
                    frozen = 0
                    frozenClickCounter = 3
                }
            }
        })
        setInterval(() => {
            runInput();
            physics();
        }, 10);
        setInterval(() => {
            try {
                render()
            } catch (error) {
                textToLog = error.stack
            }
        }, 33 + 1/3)
        window.addEventListener("resize", function(event) {
            gameLoop();
            isWidthGreater = window.innerWidth / windowWidth > window.innerHeight / windowHeight
            relativeSize = (window.innerWidth / windowWidth > window.innerHeight / windowHeight ? window.innerHeight / windowHeight : window.innerWidth / windowWidth)
            document.getElementById("svg").style.top = document.getElementById("backgroundSVG").style.top = (isWidthGreater ? "0px" : (window.innerHeight - windowHeight * relativeSize) / 2 + "px")
            document.getElementById("svg").style.left = document.getElementById("backgroundSVG").style.left = (isWidthGreater ? (window.innerWidth - windowWidth * relativeSize) / 2 + "px" : "0px")
            document.getElementById("svg").style.height = document.getElementById("backgroundSVG").style.height = (windowHeight * relativeSize - 2) + "px"
            document.getElementById("svg").style.width = document.getElementById("backgroundSVG").style.width = (windowWidth * relativeSize - 2) + "px"
            console.log(window.innerWidth + ", " + window.innerHeight);
        })
    }
    catch(error) {
        log(error.stack)
    }
}

function gameLoop() {
    runInput()
    physics()
    render()
}

function runInput() {
	var currentTime = new Date().getTime()
    deltaTime = (currentTime - lastFrameTimeStamp) / 1000
    lastFrameTimeStamp = currentTime
    if(!paused && frozen < 1)
    {
        if (buttonsHeld[0]) {
            // Left
            currentPos = new Coordinate(currentPos.x - speed * deltaTime, currentPos.y)
        } if (buttonsHeld[1]) {
            // Right
            currentPos = new Coordinate(currentPos.x + speed * deltaTime, currentPos.y)
        } if(buttonsHeld[2]) {
            // Jump
            if(isOnGround) {
                verticalSpeed += jumpSpeed;
                // currentPos = new Coordinate(currentPos.x, currentpos.y - 1);
                justJumped = true;
            }
        }
    }
}

function physics() {
    if(!paused) {
        isOnGround = false;
        if(verticalSpeed <= 0 && doCollisions == false) {
            doCollisions = true;
        }
        if(doubleXPTimer > 0) {
            doubleXPTimer -= deltaTime;
        } else if(doubleXPCooldown) {
            doubleXPCooldown -= deltaTime;
        }
        if(doubleXPCooldown <= 0 && doubleXP && !doubleXPTimer) {
            doubleXPCooldown = 0;
            doubleXP = false;
        } else if(doubleXPTimer <= 0 && !doubleXPCooldown && doubleXP) {
            doubleXPTimer = 0;
            doubleXPCooldown = abilities[0].specs[1]
        }
        try {
            if (!stopPhysics) {
                // Wraparound, gravity, collisions, and point gain
                {
                    if(currentPos.x > windowWidth) {
                        // log("currentPos.x > windowWidth - size")
                        currentPos = new Coordinate(currentPos.x - windowWidth, currentPos.y)
                    } else if(currentPos.x < 0) {
                        // log("currentPos.x < 0")
                        currentPos = new Coordinate(currentPos.x + windowWidth, currentPos.y)
                    }
                    if(currentPos.y <= size.y - screenPos && !justJumped) {
                        verticalSpeed = 0;
                        currentPos = new Coordinate(currentPos.x, size.y - screenPos)
                        isOnGround = true
                    } else if(!isOnGround) {
                        verticalSpeed -= gravity * deltaTime
                        currentPos = new Coordinate(currentPos.x, currentPos.y + verticalSpeed * deltaTime)
                    }
                    if (currentPos.y <= -5 && screenPos > size.y) {
                        onDeath()
                        setTimeout(() => {
                            screenPos = 0;
                            platforms = [
                                [new Line(0, 0, 100, 0), 0]
                            ]
                            for(i = 0; i < platformAmount; i++) {
                                var x = generateRandomNumber(0, windowWidth - 160)
                                var y = generateRandomNumber(platforms[platforms.length - 1][0].point1.y + 10, platforms[platforms.length - 1][0].point1.y + 90)
                                //var z = generateRandomNumber(platforms[platforms.length - 1][0].point1.y + 10, platforms[platforms.length - 1][0].point1.y + 90)
                                var l = generateRandomNumber(80, 160)
                                var r = generateRandomNumber(0, 100) < stats[1].specs[1]
                                var b = generateRandomNumber(0, 100) < 2
                                platforms.push([new Line(x, y, x + l, y), r, b, (b ? 1 : 0)])
                            }
                            platforms.shift();
                            currentPos = new Coordinate(0, 80);
                            stopPhysics = false;
                        }, 500)
                    } else if(currentPos.y > windowHeight / 2 + size.y/2) {
                        for(i = 0; i < platforms.length; i++) {
                            platforms[i] = [new Line(platforms[i][0].point1.x, platforms[i][0].point1.y - (currentPos.y - windowHeight / 2 - size.y/2), platforms[i][0].point2.x, platforms[i][0].point2.y - (currentPos.y - windowHeight / 2 - size.y/2)), platforms[i][1], platforms[i][2], platforms[i][3]]
                            if(platforms[i][0].point1.y <= -100) {
                                platforms.splice(i, 1)
                                var x = generateRandomNumber(0, windowWidth - 160)
                                var y = generateRandomNumber(platforms[platforms.length - 1][0].point1.y + 10, platforms[platforms.length - 1][0].point1.y + 90)
                                //var z = generateRandomNumber(platforms[platforms.length - 1][0].point1.y + 10, platforms[platforms.length - 1][0].point1.y + 90)
                                var l = generateRandomNumber(80, 160)
                                var r = generateRandomNumber(0, 100) < stats[1].specs[1]
                                var b = generateRandomNumber(0, 100) < 2
                                platforms.push([new Line(x, y, x + l, y), r, b, (b ? 1 : 0)])
                            }
                        }
                        screenPos += ( doubleXPTimer && doubleXP ? ((currentPos.y - size.y/2) - windowHeight / 2) * 2 : (currentPos.y - size.y/2) - windowHeight / 2 );
                        currentPos = new Coordinate(currentPos.x, windowHeight / 2 + size.y/2)
                        console.log((currentPos.y - size.y/2) - windowHeight / 2)
                        if(Math.round(screenPos / 100) >= 20 && !achievements[0]) {
                            achievements[0] = 1
                            localStorage.setItem("achievements", JSON.stringify(achievements))
                            textToLog = achievements
                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/01.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> Score 20"
                            if(rATimeout !== undefined) {
                                clearTimeout(rATimeout)
                            }
                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                        } if(Math.round(screenPos / 100) >= 50 && !achievements[1]) {
                            achievements[1] = 1
                            localStorage.setItem("achievements", JSON.stringify(achievements))
                            textToLog = achievements
                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/02.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> Score 50"
                            if(rATimeout !== undefined) {
                                clearTimeout(rATimeout)
                            }
                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                        } if(Math.round(screenPos / 100) >= 100 && !achievements[2]) {
                            achievements[2] = 1
                            localStorage.setItem("achievements", JSON.stringify(achievements))
                            textToLog = achievements
                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/03.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> Score 100"
                            if(rATimeout !== undefined) {
                                clearTimeout(rATimeout)
                            }
                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                        } if(Math.round(screenPos / 100) >= 150 && !achievements[3]) {
                            achievements[3] = 1
                            localStorage.setItem("achievements", JSON.stringify(achievements))
                            textToLog = achievements
                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/04.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> Score 150"
                            if(rATimeout !== undefined) {
                                clearTimeout(rATimeout)
                            }
                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                        } if(Math.round(screenPos / 100) >= 200 && !achievements[4]) {
                            achievements[4] = 1
                            localStorage.setItem("achievements", JSON.stringify(achievements))
                            textToLog = achievements
                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/05.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> Score 200"
                            if(rATimeout !== undefined) {
                                clearTimeout(rATimeout)
                            }
                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                        } if(Math.round(screenPos / 100) >= 500 && !achievements[5]) {
                            achievements[5] = 1
                            localStorage.setItem("achievements", JSON.stringify(achievements))
                            textToLog = achievements
                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/06.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> Score 500"
                            if(rATimeout !== undefined) {
                                clearTimeout(rATimeout)
                            }
                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                        }
                    }

                    if(doCollisions) {
                        justJumped = false;
                        var shortestDistAndDir = getShortestDist(false)
                        if(shortestDistAndDir.dist < size.x / 2) {
                            currentPos = new Coordinate(currentPos.x + shortestDistAndDir.dir.x * (shortestDistAndDir.dist - size.x / 2), currentPos.y + shortestDistAndDir.dir.y * (shortestDistAndDir.dist - size.x / 2))
                            if(shortestDistAndDir.dir.y == -1) {
                                verticalSpeed = 0;
                                isOnGround = true;
                                if(typeof shortestDistAndDir.collision != "string" && shortestDistAndDir.collision[1]) {
                                    doCollisions = false;
                                    verticalSpeed = stats[1].specs[0];
                                    rpUsed++
                                    localStorage.setItem("rpUsed", rpUsed)
                                    if(!achievements[6]) {
                                        achievements[6] = 1
                                        localStorage.setItem("achievements", JSON.stringify(achievements))
                                        textToLog = achievements
                                        recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/07.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 1 Rocket used"
                                        if(rATimeout !== undefined) {
                                            clearTimeout(rATimeout)
                                        }
                                        rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                    }
                                    if(rpUsed >= 5 && !achievements[7]) {
                                        achievements[7] = 1
                                        localStorage.setItem("achievements", JSON.stringify(achievements))
                                        textToLog = achievements
                                        recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/08.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 5 Rockets used"
                                        if(rATimeout !== undefined) {
                                            clearTimeout(rATimeout)
                                        }
                                        rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                    }
                                    if(rpUsed >= 10 && !achievements[8]) {
                                        achievements[8] = 1
                                        localStorage.setItem("achievements", JSON.stringify(achievements))
                                        textToLog = achievements
                                        recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/09.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 10 Rockets used"
                                        if(rATimeout !== undefined) {
                                            clearTimeout(rATimeout)
                                        }
                                        rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                    }
                                    if(rpUsed >= 20 && !achievements[9]) {
                                        achievements[9] = 1
                                        localStorage.setItem("achievements", JSON.stringify(achievements))
                                        textToLog = achievements
                                        recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/10.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 20 Rockets used"
                                        if(rATimeout !== undefined) {
                                            clearTimeout(rATimeout)
                                        }
                                        rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                    }
                                    if(rpUsed >= 50 && !achievements[10]) {
                                        achievements[10] = 1
                                        localStorage.setItem("achievements", JSON.stringify(achievements))
                                        textToLog = achievements
                                        recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/11.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 50 Rockets used"
                                        if(rATimeout !== undefined) {
                                            clearTimeout(rATimeout)
                                        }
                                        rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                    }
                                    if(rpUsed >= 100 && !achievements[11]) {
                                        achievements[11] = 1
                                        localStorage.setItem("achievements", JSON.stringify(achievements))
                                        textToLog = achievements
                                        recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/12.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 100 Rockets used"
                                        if(rATimeout !== undefined) {
                                            clearTimeout(rATimeout)
                                        }
                                        rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                    }
                                }
                                if(typeof shortestDistAndDir.collision != "string" && shortestDistAndDir.collision[2]) {
                                    platforms[shortestDistAndDir.index][3] -= deltaTime / 0.5
                                    if(platforms[shortestDistAndDir.index][3] <= 0) {
                                        platforms.splice(shortestDistAndDir.index, 1)
                                        dpUsed++
                                        localStorage.setItem("dpUsed", dpUsed)
                                        if(!achievements[12]) {
                                            achievements[12] = 1
                                            localStorage.setItem("achievements", JSON.stringify(achievements))
                                            textToLog = achievements
                                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/13.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 1 Dissappearing pad used"
                                            if(rATimeout !== undefined) {
                                                clearTimeout(rATimeout)
                                            }
                                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                        }
                                        if(dpUsed >= 5 && !achievements[13]) {
                                            achievements[13] = 1
                                            localStorage.setItem("achievements", JSON.stringify(achievements))
                                            textToLog = achievements
                                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/14.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 5 Dissappearing pads used"
                                            if(rATimeout !== undefined) {
                                                clearTimeout(rATimeout)
                                            }
                                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                        }
                                        if(dpUsed >= 10 && !achievements[14]) {
                                            achievements[14] = 1
                                            localStorage.setItem("achievements", JSON.stringify(achievements))
                                            textToLog = achievements
                                            recentAchievement += "Achievement get!<br><img src=\"./Media/Achievements/15.png\" style=\"width:1em;height:1em; position:relative; top:2px;\" /> 10 Dissappearing pads used"
                                            if(rATimeout !== undefined) {
                                                clearTimeout(rATimeout)
                                            }
                                            rATimeout = setTimeout(function(){recentAchievement = ""; rATimeout = undefined}, 10000)
                                        }
                                    }
                                }
                            } else if(shortestDistAndDir.dir.y == 1) {
                                verticalSpeed = 0;
                            }
                        }
                    }
                } 
                if(frozen < 1 && currentLocation == "frozen") {
                    frozen += deltaTime / 15
                }   
            }
        }
        catch(error) {
            log(error.stack);
        }
        //textToLog = mobile
        
        log(`
            ${recentAchievement ? recentAchievement + "<br><br>" : ""}
            ${settings.showLog ? `<h4>General</h4>
            Current position: (${ Math.round(currentPos.x) + ", " + Math.round(currentPos.y) }) <br>
            Keys down: ${ ( buttonsHeld.toString() != [0, 0, 0].toString() ? ((buttonsHeld[0] ? (buttonsHeld[1] || buttonsHeld[2] ? "Left, " : "Left") : "") + (buttonsHeld[1] ? (buttonsHeld[2] ? "Right, " : "Right") : "") + "" + (buttonsHeld[2] ? "Jump" : "")) : "None" ) } <br>
            Vertical speed: ${ verticalSpeed } pixels per second <br>
            Deltatime: ${ deltaTime } seconds <br>
            <h4>Collisions</h4>
            Is on ground? ${ isOnGround ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
            Distance to nearest collision: ${ Math.round(shortestDistAndDir.dist) }<br>
            Direction to nearest collision: ${ JSON.stringify(shortestDistAndDir.dir) } <br>
            <h4>Game data</h4>` : ""}
            Score: ${ Math.round(screenPos / 100) } <br>
            Highscore: ${ window.localStorage.getItem("highscore") != '' || null ? (Math.round(screenPos / 100) > window.localStorage.getItem("highScore") ? "<span style=\"color:green\">" + Math.round(screenPos / 100) + "</span>" : window.localStorage.getItem("highScore")) : "<span style=\"color:green\">" + Math.round(screenPos / 100) + "</span>" }<br>
            ${ settings.showLog ? `Height: ${ Math.round(screenPos) }px <br>` : "" } 
            Usable points: ${ localStorage.getItem("points") ? localStorage.getItem("points") : 0 }
            ${ settings.showLog ? `<h4>Abilities</h4>
            <h5>Double XP</h5>
            Active:${ doubleXPTimer && doubleXP ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" }<br>
            Timer: ${ doubleXPTimer ? doubleXPTimer : doubleXPCooldown }<br>
            <h4>Biomes</h4>
            Current biome: ${ currentLocation }<br>
            <h5>Frozen</h5>
            Frozen: ${ frozen }<br>
            Click counter: ${ frozenClickCounter }` : "" }
            ${ settings.showLog ? "<br>" + textToLog : "" }&zwnj;
        `)
        // Intersecting with bottom? ${ currentPos.y > windowHeight - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
        // Intersecting with side? ${ currentPos.x > windowWidth - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
    }
}

function onDeath() { 
    if(localStorage.getItem("highScore") < Math.round(screenPos / 100)) {
        localStorage.setItem("highScore", Math.round(screenPos / 100))
    }
    localStorage.setItem("points", (Number(localStorage.getItem("points")) ? Number(localStorage.getItem("points")) + Math.round(screenPos / 100) : Math.round(screenPos / 100)))
    stopPhysics = true;
    doubleXPCooldown = 0; doubleXPTimer = 0; doubleXP = false;
}

function changeInput(button, digit) {
    //textToLog = "\"" + button + "\", " + typeof button;
    switch (button) {
        case "KeyA": case "ArrowLeft":
            buttonsHeld[0] = digit;
            break;
        case "KeyD": case "ArrowRight":
            buttonsHeld[1] = digit;
            break;
        case "Space": case "ArrowUp":
            buttonsHeld[2] = digit;
            break;
        case "ShiftLeft": case "ShiftRight":
            if(digit == 1) {
                speed = startingSpeed * speedMultiplier;
            } else {
                speed = startingSpeed;
            }
            console.log(speed);
            break;
        case "Escape":
            paused = true;
            document.getElementById("pauseMenu").style.display = "block"
            break;
        case "Digit1": case "Numpad1": case "1":
            if(!doubleXP && digit) {
                doubleXP = true;
                doubleXPTimer = abilities[0].specs[0];
            }
            break;
        default:
            break;
    }
}

function generateRandomNumber(min, max, step) {
    var number = Math.random() * (max - min) + min;
    if (step) {
        number /= step;
        number = Math.round(number);
        number *= step;
    }
    return number;
}

function log(data) {
    document.getElementById("log").innerHTML = data;
}
