class Coordinate {
    /**
     * A coordinate in 2D space.
     * @param {Number} x The X coordinate of the coordinate.
     * @param {Number} y The Y coordinat of the coordinate.
     * @class
     */

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get dist() {
        return this.distanceBetweenPoints()
    }
    get unitVector() {
        return new Coordinate(this.x / this.dist, this.y / this.dist);
    }
    
    static zero = new Coordinate(0, 0);

    /**
     * Gets the distance between the current coordinate and either (0, 0) or the specified coordinates.
     * @param {Coordinate} [coord] The coordinates of the starting point. Optional.
     * @returns The distance.
     */

    distanceBetweenPoints(coord) {
        var x2 = this.x;
        var y2 = this.y;
        var firstX = x2 - (coord ? coord.x : 0);
        var firstY = y2 - (coord ? coord.y : 0);
        var secX = firstX ** 2;
        var secY = firstY ** 2;
        return Math.sqrt(secX + secY);
    }

    static rotateVector(coord, rad) {
        var x = coord.x; var y = coord.y;
        var result = Coordinate.zero;
        result.x = x * Math.cos(rad) - y * Math.sin(rad);
        result.y = x * Math.sin(rad) + y * Math.cos(rad);
        return result;
    }

    static rotateAroundPoint(coord, point, rad) {
        var newPoint = new Coordinate(coord.x - point.x, coord.y - point.y)
        var r = Coordinate.rotateVector(newPoint, rad)
        return new Coordinate(r.x + point.x, r.y + point.y)
    }

    UVToRadians() {
        return Math.atan2(this.y,this.x);
    }
}

class Rect {
    constructor(x1, y1, x2, y2) {
        this.point1 = new Coordinate(x1, y1);
        this.point2 = new Coordinate(x2, y2);
    }

    get area() {
        return this.width * this.height
    }

    get width() {
        return Math.abs(this.point1.x - this.point2.x)
    }

    get height() {
        return Math.abs(this.point1.y - this.point2.y)
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.point1 = new Coordinate(x1, y1);
        this.point2 = new Coordinate(x2, y2);
    }
    get length() {
        return this.point1.distanceBetweenPoints(this.point2)
    }
}