import oponentColor  from './helpers'

export default {
    AddPiece : {
            weaponFire : ({weaponUsage, playerColor, square, gameEngine, gameInDB,changeTurn,weaponsOnBoard,playerNumber}) => {
                const { options: {pieceType :pieceType}, weaponType, index } = weaponUsage
                let pieceCode = playerColor + pieceType.toUpperCase();
                let weaponsOnBoardObj = { weaponsOnBoard : Object.assign(weaponsOnBoard,{[square]: {color: playerColor, 
                    ...weaponUsage.options, pieceCode: pieceCode, isWeapon: true, weaponType:'AddPiece'}})}
                let piece = { type: pieceType, color: playerColor }
                gameEngine.put(piece, square)
                let lastMove = { to: square, type: pieceType, moveType: 'weapon', color:playerColor }
                let game = Object.assign(changeTurn(weaponType, lastMove, playerColor, playerNumber, index),weaponsOnBoardObj);
                game.moveNumber = gameInDB.moveNumber+1
                return game
            },
            weaponRemoved: ({weaponsOnBoardCopy, gameEngine, square}) => {
                delete weaponsOnBoardCopy[square]
                gameEngine.remove(square)
                gameEngine.load(gameEngine.fen())
            },
            movementLogic: (weaponsOnBoardCopy, targetSquare, sourceSquare,) =>{
                weaponsOnBoardCopy[targetSquare] = weaponsOnBoardCopy[sourceSquare]
                delete weaponsOnBoardCopy[sourceSquare]
                weaponsOnBoardCopy[targetSquare].duration = weaponsOnBoardCopy[targetSquare].duration-1
                return weaponsOnBoardCopy;
            },
            durationLogic: () => {
                        // duration logic runs at movementLogic
            },
            validate: ({gameEngine, square, playerColor,weaponsOnBoard}) => {
                let isTherePiece = gameEngine.get(square)
                //TODO: weapon do no effect other weapons
                let isThereWeapon = weaponsOnBoard[square];
                return !isThereWeapon && gameEngine.turn() === playerColor && !isTherePiece
            },
            weaponImageCode: () => {
                return 'classic';
            }
        },
    RemovePiece : {
        weaponFire : ({weaponUsage, playerColor, square, gameEngine, gameInDB,changeTurn,weaponsOnBoard,playerNumber}) => {
            const { options: {pieceType :pieceType}, weaponType, index } = weaponUsage
            let pieceCode = oponentColor(playerColor) + pieceType.toUpperCase();
            let weaponsOnBoardObj = { weaponsOnBoard :Object.assign(weaponsOnBoard, {[square]: {color: oponentColor(playerColor), 
                ...weaponUsage.options, pieceCode: pieceCode, isWeapon:true, weaponType: 'RemovePiece'}})}
            gameEngine.remove(square)
            let lastMove = { to: square, type: pieceType, moveType: 'weapon', playerColor }
            let game = Object.assign(changeTurn(weaponType, lastMove, playerColor, playerNumber,index),weaponsOnBoardObj);
            game.moveNumber = gameInDB.moveNumber+1
            return game
        },
        
        weaponRemoved: ({weaponsOnBoardCopy ,gameEngine,modifyWeaponsCollection, playerNumber, weapon, square}) =>{
            const { pieceType, color} = weapon;
            let opponentPlayerNumber = playerNumber == 'p1' ? 'p2' : 'p1';
            let isTherePiece = gameEngine.get(square)
            let lastMove = { from: square, moveType: 'remove-weapon', color:opponentPlayerNumber }
            let piece = { type: pieceType, color: color }
            if(!isTherePiece){
                gameEngine.put(piece,square)
                gameEngine.load(gameEngine.fen())
                delete weaponsOnBoardCopy[square]
            }else{
                let weaponToAdd = {weaponType: 'ADD_PIECE', options: {pieceType: pieceType}};
                modifyWeaponsCollection('REMOVE_PIECE',weaponToAdd, lastMove, gameEngine.fen(),opponentPlayerNumber, 'ADD' )
            }
        },
        movementLogic: () =>{
        },
        durationLogic: (weaponsOnBoardCopy,targetSquare) => {
            weaponsOnBoardCopy[targetSquare].duration = weaponsOnBoardCopy[targetSquare].duration-1
        },
        validate: ({gameEngine,playerColor, square, weaponUsage,weaponsOnBoard}) => {
            const { options: {pieceType: pieceType } } = weaponUsage
            let isTherePiece = gameEngine.get(square)
            //TODO: weapon do no effect other weapons
            let isThereWeapon = weaponsOnBoard[square];
            return !isThereWeapon && gameEngine.turn() === playerColor && isTherePiece && isTherePiece.type == pieceType &&
            isTherePiece.color != playerColor   
        },
        weaponImageCode: () => {
            return false;
        }
        },
        UpgradePiece : {
        weaponFire : (gameParams) => {
            const {square, gameEngine, playerColor} = gameParams
            let pieceInSquare = gameEngine.get(square)
            let newPiece = { type : upgradingMap[pieceInSquare.type] , color: pieceInSquare.color } 
            return changeOponnentPiece(gameParams,playerColor,pieceInSquare,newPiece,'UpgradePiece')
        },
        weaponRemoved: ({weaponsOnBoardCopy ,gameEngine, weapon, square}) => {
            let pieceToPut = weapon.originalPieceInSquare
            putPiece(gameEngine, pieceToPut,square)
            delete weaponsOnBoardCopy[square]
            //TODO: check if turns to queen
        },
        movementLogic: (weaponsOnBoardCopy, targetSquare, sourceSquare,gameEngine) =>{
                movePiece(weaponsOnBoardCopy,targetSquare,sourceSquare, gameEngine)
                PieceDurationTick(weaponsOnBoardCopy,targetSquare)
                return weaponsOnBoardCopy;
        },
        durationLogic: () => {
                // duration logic runs at movementLogic
        },
        validate: ({gameEngine, square, playerColor,weaponsOnBoard}) => {
            let isTherePiece = gameEngine.get(square)
             //TODO: weapon do no effect other weapons
             let isThereWeapon = weaponsOnBoard[square];
            return !isThereWeapon && gameEngine.turn() === playerColor && isTherePiece && isTherePiece.color == playerColor
        },
        weaponImageCode: () => {
            return 'classic';
        }
        },
        DowngradePiece : {
            weaponFire : (gameParams) => {
                const {square, gameEngine,playerColor} = gameParams
                let pieceInSquare = gameEngine.get(square)
                let newPiece = { type : downGradingMap[pieceInSquare.type] , color: pieceInSquare.color } 
                return changeOponnentPiece(gameParams,playerColor, pieceInSquare,newPiece,'DowngradePiece')
            },
            weaponRemoved: ({weaponsOnBoardCopy ,gameEngine, weapon, square}) => {
                let pieceToPut = weapon.originalPieceInSquare
                putPiece(gameEngine, pieceToPut,square)
                delete weaponsOnBoardCopy[square]
                //TODO: check if turns to queen
            },
            movementLogic: (weaponsOnBoardCopy, targetSquare, sourceSquare, gameEngine) =>{       
                movePiece(weaponsOnBoardCopy,targetSquare,sourceSquare, gameEngine)
                PieceDurationTick(weaponsOnBoardCopy,targetSquare)
                return weaponsOnBoardCopy;
            },
            durationLogic: () => {
                        // duration logic runs at movementLogic
            },
            validate: ({gameEngine, square, playerColor,weaponsOnBoard}) => {
                let isTherePiece = gameEngine.get(square)
                //TODO: weapon do no effect other weapons
                let isThereWeapon = weaponsOnBoard[square];
                return !isThereWeapon && gameEngine.turn() === playerColor && isTherePiece && isTherePiece.color != playerColor
            },
            weaponImageCode: () => {
                return 'classic';
            }
        }
}

const upgradingMap = {
    'b' : 'r',
    'n': 'r',
    'p': Math.random() > 0.5 ? 'n' : 'b',
    'r': 'q',
    'k': 'k'
}

const downGradingMap = {
    'b' : 'p',
    'n': 'p',
    'r': Math.random() > 0.5 ? 'n' : 'b',
    'q': 'r',
    'k': 'k'
}

const changeOponnentPiece = (gameParams,playerColor,pieceToReplace,newPiece, weaponType) =>{
    const {weaponUsage, square, gameEngine, gameInDB,changeTurn,weaponsOnBoard, playerNumber} = gameParams
    gameEngine.put(newPiece, square)
    let pieceCode = playerColor + newPiece.type.toUpperCase();
    let weaponsOnBoardObj = { weaponsOnBoard : Object.assign(weaponsOnBoard,{[square]: {color: playerColor, 
        ...weaponUsage.options, pieceCode: pieceCode, isWeapon: true,
         weaponType: weaponType, originalPieceInSquare:pieceToReplace}})}
    let lastMove = { to: square, moveType: 'weapon', color:playerColor }
    let game = Object.assign(changeTurn(weaponType, lastMove, playerColor, playerNumber,weaponUsage.index),weaponsOnBoardObj);
    game.moveNumber = gameInDB.moveNumber+1
    return game
}


const putPiece = (gameEngine, pieceToPut,square) => {
    gameEngine.put(pieceToPut,square)
    gameEngine.load(gameEngine.fen())
}

const movePiece = (weaponsOnBoard,targetSquare, sourceSquare,gameEngine) => {
    weaponsOnBoard[targetSquare] = weaponsOnBoard[sourceSquare]
    delete weaponsOnBoard[sourceSquare]
    gameEngine.remove(sourceSquare)
    gameEngine.load(gameEngine.fen())

}

const PieceDurationTick = (weaponsOnBoard,targetSquare) => {
    weaponsOnBoard[targetSquare].duration = weaponsOnBoard[targetSquare].duration-1
}
