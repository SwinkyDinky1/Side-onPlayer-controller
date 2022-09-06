function drawRect(topLeft, bottomRight, svgID, styles) {
    document.getElementById(svgID).innerHTML += `
        <rect 
            x="${ topLeft.x }"
            y="${ topLeft.y }"
            width="${ Math.abs(bottomRight.x - topLeft.x) }"
            height="${ Math.abs(bottomRight.y - topLeft.y) }"
            style='fill:${ styles.fillColor };stroke:${ styles.strokeColor };stroke-width:${ styles.strokeWidth }px;'
        />
    `
}

function drawLine(topLeft, bottomRight, svgID, styles) {
    document.getElementById(svgID).innerHTML += `
        <line
            x1="${topLeft.x}"
            y1="${topLeft.y}"
            x2="${bottomRight.x}"
            y2="${bottomRight.y}"
            stroke="${styles.stroke}"
            stroke-width="${styles.strokeWidth}"
        />
    `
}

function drawCircle(pos, radius, svgID, styles) {
    document.getElementById(svgID).innerHTML += `
        <circle
            cx="${ pos.x }"
            cy="${ pos.y }"
            r="${ radius }"
            stroke="${ styles.stroke }"
            stroke-width="${ styles.strokeWidth }"
            fill="${ styles.fillColor }"
        />
    `
}

function drawSlice(x1, y1, radius, percentage, options, id) {
    document.getElementById(id).innerHTML += `
        <circle
            cx="${x1}"
            cy="${y1}"
            r="${radius / 2}"
            stroke="${options.stroke}"
            stroke-width="${radius}"
            stroke-dasharray="calc(${percentage + " * " + Math.PI * radius + ") " + Math.PI * radius}"
            fill="rgba(0, 0, 0, 0)"
            transform="rotate(270 400,400)"
        />
    `
}