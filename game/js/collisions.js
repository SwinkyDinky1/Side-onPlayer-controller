// Gets the distance to the nearest collision
function getShortestDist(showCircle) {
    var pos = new Coordinate(currentPos.x + size.x / 2, currentPos.y - size.y / 2)
    var dists = [pos.y + screenPos];
    var dirs = [new Coordinate(0, 1)]
    var indecies = [0]
    var collisions = ["Floor"];
    for(i = 0; i < platforms.length; i++) {
        /*var dir = -(new Coordinate(platforms[i][0].point2.x - platforms[i][0].point1.x, platforms[i][0].point2.y - platforms[i][0].point1.y).unitVector.UVToRadians())
        pos = Coordinate.rotateAroundPoint(pos, platforms[i][0].point1, dir);
        var point2 = Coordinate.rotateAroundPoint(platforms[i][0].point2, platforms[i][0].point1, dir);*/
        if(pos.x < platforms[i][0].point1.x) {
            dists.push(pos.distanceBetweenPoints(platforms[i][0].point1))
            dirs.push(new Coordinate((platforms[i][0].point1.x - pos.x) / dists[dists.length - 1], (platforms[i][0].point1.y - pos.y) / dists[dists.length - 1]))
            collisions.push(platforms[i])
            indecies.push(i)
        } else if(pos.x > platforms[i][0].point2.x) {
            dists.push(pos.distanceBetweenPoints(platforms[i][0].point2))
            dirs.push(new Coordinate((platforms[i][0].point2.x - pos.x) / dists[dists.length - 1], (platforms[i][0].point2.y - pos.y) / dists[dists.length - 1]))
            collisions.push(platforms[i])
            indecies.push(i)
        } else {
            try {
                dists.push(Math.abs(platforms[i][0].point1.y - pos.y))
                dirs.push(new Coordinate(0, (platforms[i][0].point1.y - pos.y) / dists[dists.length - 1]))
                collisions.push(platforms[i])
                indecies.push(i)
            } catch(error) {
                textToLog = error;
            }
        }
        if(platforms[i][0].point1.x < size.x) {
            if(pos.x < platforms[i][0].point1.x + windowWidth) {
                dists.push(pos.distanceBetweenPoints(new Coordinate(platforms[i][0].point1.x + windowWidth, platforms[i][0].point1.y)))
                dirs.push(new Coordinate((platforms[i][0].point1.x - pos.x + windowWidth) / dists[dists.length - 1], (platforms[i][0].point1.y - pos.y) / dists[dists.length - 1]))
                collisions.push(platforms[i])
                indecies.push(i)
            } else if(pos.x > platforms[i][0].point2.x + windowWidth) {
                dists.push(pos.distanceBetweenPoints(new Coordinate(platforms[i][0].point2.x + windowWidth, platforms[i][0].point2.y)))
                dirs.push(new Coordinate((platforms[i][0].point2.x - pos.x + windowWidth) / dists[dists.length - 1], (platforms[i][0].point2.y - pos.y) / dists[dists.length - 1]))
                collisions.push(platforms[i])
                indecies.push(i)
            } else {
                try {
                    dists.push(Math.abs(platforms[i][0].point1.y - pos.y))
                    dirs.push(new Coordinate(0, (platforms[i][0].point1.y - pos.y) / dists[dists.length - 1]))
                    collisions.push(platforms[i])
                    indecies.push(i)
                } catch(error) {
                    textToLog = error;
                }
            }
        }
        //pos = Coordinate.rotateAroundPoint(pos, platforms[i][0].point1, dir);
    }
    var closestDist = Math.min(...dists);
    var closestDir = dirs[dists.indexOf(closestDist)];
    closestDir.y *= 1
    var closestCol = collisions[dists.indexOf(closestDist)];
    var closestIndex = indecies[dists.indexOf(closestDist)]
    if(showCircle) {
        drawCircle(new Coordinate(pos.x*relativeSize, (windowHeight - pos.y)*relativeSize), closestDist*relativeSize, "svg", {
            stroke: "white",
            strokeWidth: 3*relativeSize,
            fillColor: "rgba(128, 128, 128, 0.5)"
        })
        drawLine(
            new Coordinate(
                pos.x*relativeSize, 
                (windowHeight - pos.y)*relativeSize
                ), 
                new Coordinate(
                    (pos.x + (closestDir.x * Math.sqrt(1000**2 + 500**2) /*closestDist*/))*relativeSize, 
                    (windowHeight - pos.y + closestDir.y * /*closestDist*/ Math.sqrt(1000**2 + 500**2) * -1)*relativeSize
                ), 
                "svg", 
                {
                    stroke: "darkGrey",
                    strokeWidth: 2*relativeSize
                }
        )
        //if(pos.x <= closestDist + 3) {
            drawCircle(new Coordinate((windowWidth + pos.x)*relativeSize, (windowHeight - pos.y)*relativeSize), closestDist*relativeSize, "svg", {
                stroke: "white",
                strokeWidth: 3*relativeSize,
                fillColor: "rgba(128, 128, 128, 0.5)"
            })
            drawLine(new Coordinate((windowWidth + pos.x)*relativeSize, (windowHeight - pos.y)*relativeSize), new Coordinate((windowWidth + pos.x + (closestDir.x * Math.sqrt(1000**2 + 500**2)/*closestDist*/))*relativeSize, (windowHeight - pos.y + closestDir.y * /*closestDist*/ Math.sqrt(1000**2 + 500**2) * -1)*relativeSize), "svg", {
                stroke: "darkGrey",
                strokeWidth: 2*relativeSize
            })
        //} if(pos.x >= windowWidth - closestDist - 3) {
            drawCircle(new Coordinate((pos.x - windowWidth)*relativeSize, (windowHeight - pos.y)*relativeSize), closestDist*relativeSize, "svg", {
                stroke: "white",
                strokeWidth: 3*relativeSize,
                fillColor: "rgba(128, 128, 128, 0.5)"
            })
            drawLine(new Coordinate((pos.x - windowWidth)*relativeSize, (windowHeight - pos.y)*relativeSize), new Coordinate((pos.x - windowWidth + (closestDir.x * closestDist))*relativeSize, (windowHeight - pos.y + closestDir.y * closestDist * -1)*relativeSize), "svg", {
                stroke: "darkGrey",
                strokeWidth: 2*relativeSize
            })
        //}
    }
    return {
        dist : closestDist,
        dir : closestDir,
        collision : closestCol,
        index: closestIndex
    }
}