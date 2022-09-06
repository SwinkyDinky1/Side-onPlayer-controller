/**
 * A coordinate in 2D space.
 * @param {Number} x The X coordinate of the coordinate.
 * @param {Number} y The Y coordinate of the coordinate.
 * @class
 */

class Coordinate {
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
        var xy = this.y;
        var firstX = x2 - (coord.x || 0);
        var firstY = y2 - (coord.y || 0);
        var secX = firstX ** 2;
        var secY = firstY ** 2;
        return Math.sqrt(secX + secY);
    }
}

class Rect {
    constructor(x1,y1,x2,y2) {
        this.topLeft = new Coordinate(x1,y1)
        this.bottomRight = new Coordinate(x2,y2)
    }
}