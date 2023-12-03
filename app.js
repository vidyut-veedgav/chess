//defining global variables
const gameBoard = document.querySelector("#gameboard"); //gameboard
const playerDisplay = document.querySelector("#player"); //player
const infoDisplay = document.querySelector("#info-display"); //info
const width = 8; //width of gameboard
let playerGo = 'black'
playerDisplay.textContent = "black's"

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
     pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
     '', '', '', '', '', '', '', '', 
     '', '', '', '', '', '', '', '', 
     '', '', '', '', '', '', '', '', 
     '', '', '', '', '', '', '', '', 
     pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
     rook, knight, bishop, queen, king, bishop, knight, rook,
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        //square.classList.add('beige')
        const row = Math.floor((63 - i)/ 8) + 1
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
        }
        if (i <= 15) { 
            square.firstChild.firstChild.classList.add('black');
        } else if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }
        gameBoard.append(square)
    })
}
createBoard()
 
const allSquares = document.querySelectorAll("#gameboard .square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation() 
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    
    if (correctGo) {

        if (takenByOpponent && valid) {
            console.log("Valid move: Take opponent's piece");
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
            return
        }

        if (taken && !takenByOpponent) {
            console.log("Invalid move: Square already occupied");
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        }

        if (valid) {
            console.log("Valid move: Normal move");
            e.target.append(draggedElement)
            changePlayer()
            return
        }
    }
    console.log("Invalid move: Incorrect piece or invalid destination");
    changePlayer()
}

function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const piece = draggedElement.id
    console.log('targetId', targetId);
    console.log('startId', startId);
    console.log('piece', piece);

    switch (piece) {
        case 'pawn':
            console.log("PAWN HAS BEEN MOVED");
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (starterRow.includes(startId) && startId + width * 2 === targetId
            || startId + width === targetId
            || startId + width - 1 === targetId && document.querySelector('[square-id="${startId + width - 1}"]').firstChild
            || startId + width + 1 === targetId && document.querySelector('[square-id="${startId + width + 1}"]').firstChild) 
            {
                return true
            }
            break; 
        case 'knight':
            console.log("KNIGHT HAS BEEN MOVED");
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width - 2 === targetId ||
                startId - width + 2 === targetId
                ) {
                    return true
            }
            break;
            
        case 'bishop':
            console.log("BISHOP HAS BEEN MOVED");
            const isDiagonalMove = Math.abs(targetId % width - startId % width) === Math.abs(Math.floor(targetId / width) - Math.floor(startId / width))
            if (isDiagonalMove) {
                const directionX = targetId % width > startId % width ? 1 : -1;
                const directionY = Math.floor(targetId / width) > Math.floor(startId / width) ? 1 : -1;

                let currentSquare = startId + width * directionY + directionX;

                while (currentSquare !== targetId) {

                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent && currentSquare !== targetId) {
                        return false;
                    }
                    currentSquare += width * directionY + directionX;
                }
                return true
            } 
            break;

        case 'rook':
            console.log("ROOK HAS BEEN MOVED");
            const isVerticalMove = startId % width === targetId % width;
            const isHorizontalMove = Math.floor(startId / width) === Math.floor(targetId / width);
            if (isVerticalMove) {
                const direction = targetId > startId ? 1 : -1;
                const increment = width * direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else if (isHorizontalMove) {
                const direction = targetId > startId ? 1 : -1;
                const increment = direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else {
                break;
            }
        case 'queen':
            console.log("QUEEN HAS BEEN MOVED");
            const isDiagonalMove_Queen = Math.abs(targetId % width - startId % width) === Math.abs(Math.floor(targetId / width) - Math.floor(startId / width))
            const isVerticalMove_Queen = startId % width === targetId % width;
            const isHorizontalMove_Queen = Math.floor(startId / width) === Math.floor(targetId / width);
            if (isDiagonalMove_Queen) {
                const directionX = targetId % width > startId % width ? 1 : -1;
                const directionY = Math.floor(targetId / width) > Math.floor(startId / width) ? 1 : -1;

                let currentSquare = startId + width * directionY + directionX;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }
                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += width * directionY + directionX;
                }
                return true
            } else if (isVerticalMove_Queen) {
                const direction = targetId > startId ? 1 : -1;
                const increment = width * direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else if (isHorizontalMove_Queen) {
                const direction = targetId > startId ? 1 : -1;
                const increment = direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else {
                break;
            }
        case 'king':
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width - 1 === targetId ||
                startId + width + 1 === targetId ||
                startId - width - 1 === targetId ||
                startId - width + 1 === targetId
            ) {
                return true
            }
            break;
    }
}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIds()
        playerGo = 'white'
        playerDisplay.textContent = "white's"
    } else {
        revertIds()
        playerGo = 'black'
        playerDisplay.textContent = "black's"
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings);
    if (kings.some(kings => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (kings.some(kings => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

    /*
    switch (piece) {
        case 'pawn' :
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (starterRow.includes(startId) && startId + width * 2 === targetId
            || startId + width === targetId
            || startId + width - 1 === targetId && document.querySelector('[square-id="${startId + width - 1}"]').firstChild
            || startId + width + 1 === targetId && document.querySelector('[square-id="${startId + width + 1}"]').firstChild) 
            {
                return true
            }
            break; 
        case 'knight' :
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width - 2 === targetId ||
                startId - width + 2 === targetId
                ) {
                    return true
            }
            break;
        case 'bishop' :
            if (
                //moving in the rightward direction
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild === targetId ||
                startId + width * 3 + 3 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild ||
                startId + width * 4 + 4 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild ||
                startId + width * 5 + 5 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 + 4}"]').firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 + 5}"]').firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 + 5}"]').firstChild && !document.querySelector('[square-id="${startId + width * 6 + 6}"]').firstChild ||
                //moving in the leftward direction
                startId - width - 1 === targetId ||
                startId - width * 3 - 3 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild ||
                startId - width * 2 - 2 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild ||
                startId - width * 4 - 4 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild ||
                startId - width * 5 - 5 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 - 4}"]').firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 - 5}"]').firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 - 5}"]').firstChild && !document.querySelector('[square-id="${startId - width * 6 - 6}"]').firstChild ||

                //moving backwards in the rightward direction
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild ||
                startId - width * 3 + 3 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild ||
                startId - width * 4 + 4 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild ||
                startId - width * 5 + 5 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 + 4}"]').firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 + 5}"]').firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 + 5}"]').firstChild && !document.querySelector('[square-id="${startId - width * 6 + 6}"]').firstChild ||

                //moving backwards in the leftward direction
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild ||
                startId + width * 4 - 4 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild ||
                startId + width * 5 - 5 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 - 4}"]').firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 - 5}"]').firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 - 5}"]').firstChild && !document.querySelector('[square-id="${startId + width * 6 - 6}"]').firstChild
            ) {
                return true
            }
            break;
    }
    */

    /*  const isHorizontalMove = Math.floor(startId / width) === Math.floor(targetId / width);
            if (isHorizontalMove) {
                const direction = targetId > startId ? 1 : -1;
                const increment = direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            }*/