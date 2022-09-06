var startingSpeed = 320;
var speedMultiplier = 1.5;
var speed = startingSpeed;
var currentPos = new Coordinate(0, 0);
var screenPos = new Coordinate(0, 0)
var size = 80;
var buttonsHeld = [0, 0, 0, 0]
var lastFrameTimeStamp = new Date().getTime();
var renderingLFTS = new Date().getTime();
var searchParams = new URLSearchParams(new URL(window.location.href).search)
var biome = searchParams.get("location")
var boxes = levels[biome].collisions
var levelSize = levels[biome].size
var textToLog = ""
var renderingFps = 30
var screenSize = new Coordinate()

function onStart() {
    move(true)
    document.addEventListener("keydown", function(event) {
        changeInput(event.code, 1);
    })
    document.addEventListener("keyup", function(event) {
        changeInput(event.code, 0);
    })
    setInterval(move, 20);
    setInterval(render, 33+1/3)
    document.addEventListener("resize", function(event) {
        console.log(window.innerWidth + ", " + window.innerHeight);
    })
}

function move() {
    var deltaTime = new Date().getTime() - lastFrameTimeStamp;
    deltaTime /= 1000;
    lastFrameTimeStamp = new Date().getTime();

    if(buttonsHeld.toString() != [0, 0, 0, 0].toString()) {
        if (buttonsHeld.toString() == ([1, 0, 0, 0].toString() || [1, 1, 0, 1,].toString())) {
            // console.log("Up");
            currentPos = new Coordinate(currentPos.x, currentPos.y - speed * deltaTime)
        } else if(buttonsHeld.toString() == [1, 1, 0, 0].toString()) {
            // console.log("Upper left");
            currentPos = new Coordinate(currentPos.x - (speed * deltaTime / Math.sqrt(2)), currentPos.y - (speed * deltaTime / Math.sqrt(2)))
        } else if (buttonsHeld.toString() == ([0, 1, 0, 0].toString() || [1, 1, 1, 0,].toString())) {
            // console.log("Left");
            currentPos = new Coordinate(currentPos.x - speed * deltaTime, currentPos.y)
        } else if(buttonsHeld.toString() == [0, 1, 1, 0].toString()) {
            // console.log("Bottom left");
            currentPos = new Coordinate(currentPos.x - (speed * deltaTime / Math.sqrt(2)), currentPos.y + (speed * deltaTime / Math.sqrt(2)))
        } else if (buttonsHeld.toString() == ([0, 0, 1, 0].toString() || [0, 1, 1, 1,].toString())) {
            // console.log("Down");
            currentPos = new Coordinate(currentPos.x, currentPos.y + speed * deltaTime)
        } else if(buttonsHeld.toString() == [0, 0, 1, 1].toString()) {
            // console.log("Bottom right");
            currentPos = new Coordinate(currentPos.x + (speed * deltaTime / Math.sqrt(2)), currentPos.y + (speed * deltaTime / Math.sqrt(2)))
        } else if (buttonsHeld.toString() == ([0, 0, 0, 1].toString() || [1, 0, 1, 1,].toString())) {
            // console.log("Right");
            currentPos = new Coordinate(currentPos.x + speed * deltaTime, currentPos.y)
        } else if(buttonsHeld.toString() == [1, 0, 0, 1].toString()) {
            // console.log("Top right");
            currentPos = new Coordinate(currentPos.x + (speed * deltaTime / Math.sqrt(2)), currentPos.y - (speed * deltaTime / Math.sqrt(2)))
        }

        var shift = new Coordinate(0,0)

        if(currentPos.x + size/2 < window.innerWidth/2 && screenPos.x > 0) {
            screenPos.x -= window.innerWidth/2 - (currentPos.x + size/2)
            shift.x = window.innerWidth/2 - (currentPos.x + size/2)
            currentPos.x = window.innerWidth/2 - size/2
        } else if(currentPos.x + size/2 > window.innerWidth/2 && screenPos.x < levelSize.x - window.innerWidth) {
            screenPos.x += (currentPos.x + size/2) - window.innerWidth/2
            shift.x = window.innerWidth/2 - (currentPos.x + size/2)
            currentPos.x = window.innerWidth/2 - size/2
        }
        if(currentPos.y + size/2 < window.innerHeight/2 && screenPos.y > 0) {
            screenPos.y -= window.innerHeight/2 - (currentPos.y + size/2)
            shift.y = window.innerHeight/2 - (currentPos.y + size/2)
            currentPos.y = window.innerHeight/2 - size/2
        } else if(currentPos.y + size/2 > window.innerHeight/2 && screenPos.y < levelSize.y - window.innerHeight) {
            screenPos.y += (currentPos.y + size/2) - window.innerHeight/2
            shift.y = window.innerHeight/2 - (currentPos.y + size/2)
            currentPos.y = window.innerHeight/2 - size/2
        }

        for(i = 0; i < boxes.length; i++) {
            boxes[i].topLeft.x += shift.x
            boxes[i].bottomRight.x += shift.x
            boxes[i].topLeft.y += shift.y
            boxes[i].bottomRight.y += shift.y
        }

        //textToLog = screenPos.x - levelSize.x - window.innerWidth

        /* // Wraparound */
        // Wall collision detection
        {
            if(currentPos.x > window.innerWidth - size) {
                //console.log("currentPos.x > window.innerWidth - size")
                currentPos = new Coordinate(window.innerWidth - size, currentPos.y)
            } else if(currentPos.x < 0) {
                //console.log("currentPos.x < 0")
                currentPos = new Coordinate(0, currentPos.y)
            }
            if(currentPos.y > window.innerHeight - size) {
                //console.log("currentPos.y > window.innerHeight - size")
                currentPos = new Coordinate(currentPos.x, window.innerHeight - size)
            } else if(currentPos.y < 0) {
                //console.log("currentPos.y < 0")
                currentPos = new Coordinate(currentPos.x, 0)
            }
            
            // Checks to draw duplicates

            /*if (currentPos.y > window.innerHeight - size) {
                drawRect(new Coordinate(currentPos.x, 0), new Coordinate(currentPos.x + size, currentPos.y - window.innerHeight + size), {
                    fillColor: "blue",
                    strokeColor: "blue",
                    strokeWidth: 1
                })
            } if (currentPos.x > window.innerWidth - size) {
                drawRect(new Coordinate(0, currentPos.y), new Coordinate(currentPos.x - window.innerWidth + size, currentPos.y + size), {
                    fillColor: "blue",
                    strokeColor: "blue",
                    strokeWidth: 1
                })
            } if (currentPos.x > window.innerWidth - size && currentPos.y > window.innerHeight - size) {
                drawRect(Coordinate.zero, new Coordinate(currentPos.x - window.innerWidth + size, currentPos.y - window.innerHeight + size), {
                    fillColor: "blue",
                    strokeColor: "blue",
                    strokeWidth: 1
                })
            }*/
            
        }
    }
    log(`
        Current position: (${ Math.round(currentPos.x) + ", " + Math.round(currentPos.y) }) <br>
        Screen position: (${ Math.round(screenPos.x) + ", " + Math.round(screenPos.y) }) <br>
        Keys down: ${ ( buttonsHeld.toString() != [0, 0, 0, 0].toString() ? (buttonsHeld[0] ? (buttonsHeld[1] || buttonsHeld[2] || buttonsHeld[3] ? "Up, " : "Up") : "") + (buttonsHeld[1] ? (buttonsHeld[2] || buttonsHeld[3] ? "Left, " : "Left") : "") + "" + (buttonsHeld[2] ? (buttonsHeld[3] ? "Down, " : "Down") : "") + "" + (buttonsHeld[3] ? "Right" : "") : "None") } <br>
        Speed: ${ (speed / startingSpeed).toPrecision(2) }x <br>
        Intersecting top? ${ currentPos.y > window.innerHeight - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
        ${ /*Touching bottom? ${ currentPos.y == window.innerHeight - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" }*/ "" }
        Intersecting side? ${ currentPos.x > window.innerWidth - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
        ${ /*Touching right side? ${ currentPos.x == window.innerWidth - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" }*/ "" }
        Deltatime: ${ deltaTime } seconds <br>
        Logic FPS: ${ Math.round(1/deltaTime) } <br>
        Rendering FPS: ${ Math.round(renderingFps) }<br>
        ${ textToLog }&zwnj;
    `)
    // Intersecting with bottom? ${ currentPos.y > window.innerHeight - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
    // Intersecting with side? ${ currentPos.x > window.innerWidth - size ? "<span style=\"color:green\">True</span>" : "<span style=\"color:red\">False</span>" } <br>
}

function changeInput(button, digit) {
    switch (button) {
        case "KeyW": case "ArrowUp":
            buttonsHeld[0] = digit;
            break;
        case "KeyA": case "ArrowLeft":
            buttonsHeld[1] = digit;
            break;
        case "KeyS": case "ArrowDown":
            buttonsHeld[2] = digit;
            break;
        case "KeyD": case "ArrowRight":
            buttonsHeld[3] = digit;
            break;
        case "ShiftLeft": case "ShiftRight":
            if(digit == 1) {
                speed = startingSpeed * speedMultiplier;
            } else {
                speed = startingSpeed;
            }
            console.log(speed);
        default:
            break;
    }
}

function render() {
    {
        var deltaTime = new Date().getTime() - renderingLFTS;
        deltaTime /= 1000;
        renderingLFTS = new Date().getTime();
        renderingFps = 1/deltaTime
        document.getElementById("svg").innerHTML = ""
    }
    drawRect(new Coordinate(currentPos.x, currentPos.y), new Coordinate(currentPos.x + size, currentPos.y + size), {
        fillColor: "blue",
        strokeColor: "blue",
        strokeWidth: 1
    })
    for(i = 0; i < boxes.length; i++) {
        drawRect(boxes[i].topLeft, boxes[i].bottomRight, {
            fillColor: "lightGrey",
            strokeColor: "grey",
            strokeWidth: 5
        })
    }
}

function drawRect(topLeft, bottomRight, styles) {
    document.getElementById("svg").innerHTML += `
        <rect 
            x="${ topLeft.x }"
            y="${ topLeft.y }"
            width="${ bottomRight.x - topLeft.x }"
            height="${ bottomRight.y - topLeft.y }"
            style='fill:${ styles.fillColor };stroke:${ styles.strokeColor };stroke-width:${ styles.strokeWidth }px;'
        />
    `
}

function log(data) {
    document.getElementById("log").innerHTML = data;
}