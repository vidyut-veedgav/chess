//defining global variables
const gameBoard = document.querySelector("#gameboard"); //gameboard
const messageBoxDisplay = document.querySelector("#messageBox")
const playerDisplay = document.querySelector("#player"); //player
const infoDisplay = document.querySelector("#info-display"); //info
const width = 8; //width of gameboard
let playerGo = 'black' //keeping track of who's turn it is
playerDisplay.textContent = "black"

//defines the starting positions of the pieces on the game board
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

/**
 * a function to create the game board and display it on the page
 */
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
 
const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement

/**
 * computes the starting ID and elemnt of the piece being dragged
 * @param {*} e 
 */
function dragStart(e) {
    startPositionId = e.target.closest('.square').getAttribute('square-id');
    console.log("STARTPOSITION CELL: ", e.target.closest('.square'));
    draggedElement = e.target //MAYBE USE CLOSEST ON THIS
    console.log("DRAGGED ELEMENT/E.TARGET", draggedElement);
}

/**
 * keeps the drag movement persisting as long as the user is dragging
 * @param {*} e 
 */
function dragOver(e) {
    e.preventDefault()
}

/**
 * central function of the program, computes the validity and subsequent changes of the game board after a dragged piece is dropped
 * @param {*} e 
 * @returns 
 */
function dragDrop(e) {

    e.stopPropagation()
    console.log("E.TARGET", e.target);

    //check if the correct player is going
    const correctTurn = draggedElement.firstChild.classList.contains(playerGo)
    console.log("isCorrectGo", correctTurn);

    //keeping track of the opponent's color for a given move
    const opponentTurn = playerGo === 'white' ? 'black' : 'white'
    console.log("isOpponentGo", opponentTurn);

    //check if something is taken
    const squareOccupied = e.target.classList.contains('piece');

    //check if something is taken by opponent
    const opponentPieceCaptured = (e.target !== null) && e.target.classList.contains(opponentTurn);
    console.log("opponentPieceCaptured", opponentPieceCaptured);

    //check if the movement is valid
    const validMove = checkIfValid(e.target)
    console.log("is valid: ", validMove);

    //checks if the correct player is going
    if (correctTurn) {

        //checks if the move is valid and is a taking action
        if (opponentPieceCaptured  && validMove) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            if (e.target.classList.contains('fa-shuttle-space')) {   
                console.log("Space Shuttle captured!");
                messageBoxDisplay.textContent = "Space Shuttle has been captured! Odyssey complete."
            }
            changePlayer()
            return
        }

        //checks if the move is just valid and no piece is taken
        if (validMove) {
            console.log("valid move?", validMove);
            console.log("Valid move: Normal move");
            e.target.append(draggedElement)
            changePlayer()
            return
        }
    }
}

/**
 * validates the movement of a dragged element and defines rules for each type of piece
 * @param {} target 
 * @returns 
 */
function checkIfValid(target) {

    console.log("VALIDITY CHECK");

    let targetId
    console.log(target);
    console.log(target.getAttribute('square-id') !== null);
    console.log(target.parentNode.getAttribute('square-id') !== null);
    console.log(target.parentNode.parentNode.getAttribute('square-id') !== null);

    //target itself
    if (target.getAttribute('square-id') !== null) {
        console.log("SQUARE ITSELF IS THE TARGET");
        targetId = Number(target.getAttribute('square-id')); 
        trueTargetSquare = target;
        console.log("trueTargetSquare" + trueTargetSquare);
    
    //1st parent
    } else if (target.parentNode.getAttribute('square-id') !== null) {
        console.log("1st PARENT");
        targetId = Number(target.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);

    //2nd parent
    } else if (target.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("2nd PARENT");
        targetId = Number(target.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);
    }

    //3rd parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("3rd PARENT");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);
    }

    //4th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("4th PARENT");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);
    }

    //5th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode.parentNode;
    }

    //6th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    }

    //7th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    }

    //8th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    }
    //9th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    }

    //10th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    }

    const startId = Number(startPositionId)
    const piece = draggedElement.id
    console.log('target', target);
    console.log("target's parent", target.parentNode);
    console.log("target's grandparent", target.parentNode.parentNode);
    console.log('startId', startId);
    console.log('targetId', targetId);
    console.log('piece', piece);

    switch (piece) {
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]

            //checks if the pawn is at starting position, and wants to move 2 squares forward
            if (starterRow.includes(startId) && (startId + width * 2 === targetId || startId + width === targetId)) {
                return true;
            }

            //checks if the pawn wants to move one square forward
            if (startId + width === targetId && trueTargetSquare.firstChild === null) {
                return true;
            }

            //checks if the pawn wants to take diagonally to the right but there is no piece
            if (startId + width - 1 === targetId && trueTargetSquare.firstChild === null) {
                return false;
            }

            //checks if the pawn wants to take diagonally to the left but there is no piece
            if (startId + width + 1 === targetId && trueTargetSquare.firstChild === null) {
                return false;
            }
            
            //checks if the pawn wants to take diagonally to the right
            if (startId + width - 1 === targetId && trueTargetSquare.firstChild.classList.contains('piece')) {
                return true;
            }

            //checks if the pawn wants to take diagonally to the left
            if (startId + width + 1 === targetId && trueTargetSquare.firstChild.classList.contains('piece')) {
                return true;
            }
            return false;

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
            console.log("BISHOP MOVEMENT: ");
            const isDiagonalMove = Math.abs(targetId % width - startId % width) === Math.abs(Math.floor(targetId / width) - Math.floor(startId / width))
            if (isDiagonalMove) {
                const directionX = targetId % width > startId % width ? 1 : -1;
                const directionY = Math.floor(targetId / width) > Math.floor(startId / width) ? 1 : -1;

                let currentSquare = startId + width * directionY + directionX;
                while (currentSquare !== targetId) {

                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);

                    console.log("currently on: " + currentSquareElement.firstChild);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    console.log(squareContent);
                    if (squareContent && currentSquare !== targetId) {
                        return false;
                    }
                    currentSquare += width * directionY + directionX;
                    console.log("moved to: " + currentSquare)
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

/**
 * reverses the players' turns
 */
function changePlayer() {
    if (playerGo === 'black') {
        reverseIds()
        playerGo = 'white'
        playerDisplay.textContent = "white"
    } else {
        revertIds()
        playerGo = 'black'
        playerDisplay.textContent = "black"
    }
}

/**
 * reverses the IDs of the board to simplify validation and drop computation 
 */
function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1) - i))
}

/**
 * reverts the IDs back to normal 
 */
function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings);
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

    