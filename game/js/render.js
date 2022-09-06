function render() {
    if(!paused) {
        try {
            if(!doRender) {
                return;
            }
            document.getElementById("svg").innerHTML = ""
            document.getElementById("backgroundSVG").innerHTML = "";
            document.getElementById("htmlImgs").innerHTML = "";
            for(i = 0; i < platforms.length; i++) {
                drawLine(new Coordinate(platforms[i][0].point1.x*relativeSize, (windowHeight - platforms[i][0].point1.y)*relativeSize), new Coordinate(platforms[i][0].point2.x*relativeSize, (windowHeight - platforms[i][0].point2.y)*relativeSize), "backgroundSVG", {
                    stroke: (platforms[i][2] ? "rgba(255, 127, 0, " + platforms[i][3] + ")" : "lightGrey"),
                    strokeWidth: 10*relativeSize
                })
                if(platforms[i][1]) {
                    drawCircle(new Coordinate((platforms[i][0].point1.x + platforms[i][0].point2.x)/2*relativeSize, (windowHeight - platforms[i][0].point1.y - 30)*relativeSize), 20*relativeSize, "svg", {
                        stroke: "chocolate",
                        strokeWidth: 5*relativeSize,
                        fillColor: "darkGoldenRod"
                    })
                }
            }
            if (currentPos.x > windowWidth - size.x) {
                drawCircle(new Coordinate((currentPos.x - windowWidth + size.x / 2)*relativeSize, (windowHeight - (currentPos.y - size.x / 2))*relativeSize), size.x/2*relativeSize, "svg", {
                    fillColor: "blue",
                    stroke: "darkblue",
                    strokeWidth: 5*relativeSize
                })
            }
            drawCircle(new Coordinate((currentPos.x + size.x / 2)*relativeSize, (windowHeight - (currentPos.y - size.y / 2))*relativeSize), size.x/2*relativeSize, "svg", {
                fillColor: "blue",
                stroke: "darkblue",
                strokeWidth: 5*relativeSize
            })
            if(settings.showCircle) {
                getShortestDist(true)
            }
            if(doubleXP) {
                drawSlice(108.75, 24.75, 24.75, doubleXPTimer ? doubleXPTimer / abilities[0].specs[0] : doubleXPCooldown / abilities[0].specs[1], {
                    stroke: "rgba(0, 0, 0, 0.3)"
                }, "backgroundSVG")
            }
            if(frozen >= 1) {
                document.getElementById("screenColoring").style.backgroundColor = "rgba(0, 0, 255, " + frozenClickCounter/6 + ")"
            } else {
                document.getElementById("screenColoring").style.backgroundColor = "rgba(0, 0, 0, 0)"
            }
        } catch (error) {
            log(error.stack)
        }
    }
}