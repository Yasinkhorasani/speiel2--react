import React, { useState } from 'react';
import "./board.css";

// CONSTANTS

/* Example coordinate grid
[1,1] [2,1] [3,1] [4,1]
[1,2] [2,2] [3,2] [4,2]
[1,3] [2,3] [3,3] [4,3]
[1,4] [2,4] [3,4] [4,4]
*/

// Board dimensions
const sizeX = 5
const sizeY = 5

// +1 is needed, because the coordinates start at 1, not 0
const userStartX = ~~(sizeX / 2) + 1
const userStartY = ~~(sizeY / 2) + 1

// Enables the user to move around the border
const isCyclicalX = true;
const isCyclicalY = true;

const userAvatar = <i className="fa-solid fa-user"></i>;

// HELPER FUNCTIONS

// Returns a string with the allowed directions of a landscape
function direction(x, y) {
    let directions = ['N', 'E', 'S', 'W'];

    // the start landscale should have all directions
    if (x === userStartX && y === userStartY) return directions

    // zufällige Richtung
    function randomDirection(possibleDirections) {
        const randomIndex = ~~(Math.random() * possibleDirections.length);
        return directions[randomIndex]
    }

    // Start with a single random direction
    let allowedDirections = randomDirection(directions)

    // Filter out first direction, so that it can't be picked again
    directions = directions.filter(direction => direction !== allowedDirections)

    // Add more random directions based on a coin flip
    while (directions.length > 0) {
        const coin = ~~(Math.random() * 2)

        if (coin === 1) {
            const newRandomDirection = randomDirection(directions)
            allowedDirections += newRandomDirection
            // Filter out new random direction, so that it can't be picked again
            directions = directions.filter(direction => direction !== newRandomDirection)
        } else {
            return allowedDirections
        }
    }
    return allowedDirections
}

// Duplikate entfernen
// function removeDuplicates(str) {
//     let result = str.split('')
//     result = new Set(result)
//     result = Array.from(result)
//     result = result.join('')
//     //console.log(result);

//     return result
// }

// Initialize all allowed directions and store them in a two-dimensional map! 
const directionMap = new Map;

function createDirectionMap() {
    for (let x = 1; x < sizeX + 1; x++) {
        const innerMap = new Map;
        for (let y = 1; y < sizeY + 1; y++) {
            innerMap.set(y, direction(x, y))
        }
        directionMap.set(x, innerMap);
    }
}

createDirectionMap();

////////////////////////////// COMPONENT FUNCTION
export default function Board() {
    // State
    const [userX, setUserX] = useState(userStartX);
    const [userY, setUserY] = useState(userStartY);

    // Move player, if possible
    const moveIfDirectionLegal = direction => {
        // is the player standing on a landscape that allows movement in the desired direction?
        const isDirectionLegal = directionMap.get(userX).get(userY).includes(direction)

        if (isDirectionLegal) {
            switch (direction) {
                case 'N':
                    if ((userY > 1 && userY < sizeY + 1)) setUserY(userY - 1)
                    else if (isCyclicalY && userY === 1) setUserY(sizeY)
                    break;
                case 'E':
                    if ((userX > 0 && userX < sizeX)) setUserX(userX + 1)
                    else if (isCyclicalX && userX === sizeX) setUserX(1)
                    break;
                case 'S':
                    if ((userY > 0 && userY < sizeY)) setUserY(userY + 1)
                    else if (isCyclicalY && userY === sizeY) setUserY(1)
                    break;
                case 'W':
                    if ((userX > 1 && userX < sizeX + 1)) setUserX(userX - 1)
                    else if (isCyclicalX && userX === 1) setUserX(sizeX)
                    break;

                default:
                    break;
            }
        }
    }

    // window.addEventListener("keyDown", moveUser, false);
    window.onkeydown = function handleKeypress(evt) {
        // First check for boundary conditions, then for allowed directions
        switch (evt.keyCode) {
            case 38: moveIfDirectionLegal('N')
                // console.log("Pfeil nach oben");
                break;
            case 87: moveIfDirectionLegal('N')
                // console.log("W");
                break;
            case 39: moveIfDirectionLegal('E')
                // console.log("Pfeil nach rechts");
                break;
            case 68: moveIfDirectionLegal('E')
                // console.log("D");
                break;
            case 40: moveIfDirectionLegal('S')
                // console.log("Pfeil nach unten");
                break;
            case 83: moveIfDirectionLegal('S')
                // console.log("S");
                break;
            case 37: moveIfDirectionLegal('W')
                // console.log("Pfeil nach links");
                break;
            case 65: moveIfDirectionLegal('W')
                // console.log("D");
                break;
            default:
                break;
        }
    }

    // Single landscape field
    function makeLandscape(coordinate) {
        const x = coordinate[0]
        const y = coordinate[1]
        // allowed directions, e.g. "NSW"
        const directions = directionMap.get(x).get(y)

        return <div
            className="landscape"
            datax={x}
            datay={y}
            key={`${x},${y}`}
        >
            {directions.includes("W") ? <i className="fa-solid fa-arrow-left"></i> : ''}
            {directions.includes("N") ? <i className="fa-solid fa-arrow-up"></i> : ''}
            {directions.includes("E") ? <i className="fa-solid fa-arrow-right"></i> : ''}
            {directions.includes("S") ? <i className="fa-solid fa-arrow-down"></i> : ''}
            {((userX === x) && (userY === y)) ? userAvatar : ''}
        </div>
    }

    // Row for landscapes
    function makeRow(y) {
        // const Array = [[1,y],[2,y],[3,y]]
        const coordinates = [];
        for (let x = 1; x < sizeX + 1; x++) {
            coordinates.push([x, y]);
        }
        return (
            <div className='row' key={y}>
                {coordinates.map(makeLandscape)}
            </div>
        )

    }

    // The board is a column of landscape rows
    function makeBoard() {
        const rows = []
        for (let y = 1; y < sizeY + 1; y++) {
            rows.push(makeRow(y))
        }
        return (
            <div className='board'>
                {rows}
            </div>
        )
    }

    // Return the whole board!
    return makeBoard();
}
