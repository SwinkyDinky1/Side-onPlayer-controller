var levels = [
    {
        name:"Debug",
        platforms:[
            [new Line(0, 100, 100, 100), false, false, 1],
            [new Line(100, 100, 200, 100), true, false, 1],
            [new Line(200, 100, 300, 100), false, true, 1],
            [new Line(300, 100, 400, 100), false, true, 0.5],
            [new Line(400, 100, 500, 100), true, true, 1]
        ],
        height:200
    },
    {
        name:"Jump",
        platforms:[
            [new Line(0, 0, 100, 0), false, false, 1],
            [new Line(100, 100, 200, 100), false, false, 1],
            [new Line(200, 200, 300, 200), false, false, 1],
            [new Line(300, 300, 400, 300), false, false, 1],
            [new Line(400, 400, 500, 400), false, false, 1],
            [new Line(500, 500, 600, 500), false, false, 1],
            [new Line(600, 600, 700, 600), false, false, 1],
            [new Line(700, 700, 800, 700), false, false, 1],
            [new Line(800, 800, 900, 800), false, false, 1],
            [new Line(900, 900, 1000, 900), false, false, 1]
        ],
        height:1000
    }
]