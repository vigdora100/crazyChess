import { opponentColor } from './helpers'
import PlusSign from '../Chessboard/svg/weapons/plus.svg';
import RemoveSign from '../Chessboard/svg/weapons/remove.svg';
import UpgradeSign from '../Chessboard/svg/weapons/upgrade.svg'
import DowngradeSign from '../Chessboard/svg/weapons/downgrade.svg'
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';

import React from 'react'

export default {
    AddPiece: {
        weaponFire: ({ weaponUsage, playerColor, square, gameEngine }) => {
            const { options: { pieceType: pieceType } } = weaponUsage
            let pieceCode = playerColor + pieceType.toUpperCase() + 'weapon'
            let weaponObj = {
                [square]: {
                    color: playerColor,
                    ...weaponUsage.options, pieceCode: pieceCode, weaponType: 'AddPiece'
                }
            }
            let piece = { type: pieceType, color: playerColor }
            gameEngine.put(piece, square)
            let lastMove = { to: square, type: pieceType, moveType: 'weapon', color: playerColor }
            return { weaponObj, lastMove }
        },
        weaponRemoved: ({ weaponsOnBoardCopy, gameEngine, square }) => {
            delete weaponsOnBoardCopy[square]
            gameEngine.remove(square)
            gameEngine.load(gameEngine.fen())
        },
        movementLogic: (weaponsOnBoardCopy, targetSquare, sourceSquare, ) => {
            weaponsOnBoardCopy[targetSquare] = weaponsOnBoardCopy[sourceSquare]
            delete weaponsOnBoardCopy[sourceSquare]
            weaponsOnBoardCopy[targetSquare].duration = weaponsOnBoardCopy[targetSquare].duration - 1
            return weaponsOnBoardCopy;
        },
        durationLogic: () => {
            // duration logic runs at movementLogic
        },
        validate: ({ gameEngine, square, playerColor, weaponsOnBoard }) => {
            let isTherePiece = gameEngine.get(square)
            //TODO: weapon do no effect other weapons
            return crossWeaponValid(isTherePiece,weaponsOnBoard,square) && gameEngine.turn() === playerColor && !isTherePiece
        },
        weaponImageCode: () => { //weaponBoardImageCode
            return 'classic';
        },
        weaponArsenalDisplay: (playerColor, pieceType,duration) => {
            return (
                <React.Fragment>
                    <img src={`/${PlusSign}`} ></img>
                    {defaultPieces[playerColor + pieceType.toUpperCase()]}
                    {duration}
                </React.Fragment>
            )
        }
    },
    RemovePiece: {
        weaponFire: ({ weaponUsage, playerColor, square, gameEngine }) => {
            const { options: { pieceType: pieceType } } = weaponUsage
            let pieceCode = 'noPiece';
            let weaponObj = {
                [square]: {
                    color: opponentColor(playerColor),
                    ...weaponUsage.options, pieceCode: pieceCode, weaponType: 'RemovePiece'
                }
            }
            gameEngine.remove(square)
            let lastMove = { to: square, type: pieceType, moveType: 'weapon', playerColor }
            return { lastMove, weaponObj }
        },

        weaponRemoved: ({ weaponsOnBoardCopy, gameEngine, playerNumber, weapon, square }) => {
            const { pieceType, color } = weapon;
            let opponentPlayerNumber = playerNumber == 'p1' ? 'p2' : 'p1';
            let isTherePiece = gameEngine.get(square)
            let piece = { type: pieceType, color: color }
            if (!isTherePiece) {
                gameEngine.put(piece, square)
                gameEngine.load(gameEngine.fen())
                delete weaponsOnBoardCopy[square]
            } else {//this code doesnt work!!! every piece/weapon taking this will remove
                //we need to create an event mechanizem 
                let weaponToAdd = { weaponType: 'ADD_PIECE', options: { pieceType: pieceType } };
                let oponentPlayerWeapons = get(gameInDB, `[${opponentPlayerNumber}].weapons`)
                oponentPlayerWeapons.push(weaponToAdd)
                return { [opponentPlayerNumber]: { weapons: oponentPlayerWeapons } }
            }
        },
        movementLogic: () => {
        },
        durationLogic: (weaponsOnBoardCopy, targetSquare) => {
            weaponsOnBoardCopy[targetSquare].duration = weaponsOnBoardCopy[targetSquare].duration - 1
        },
        validate: ({ gameEngine, playerColor, square, weaponUsage, weaponsOnBoard }) => {
            const { options: { pieceType: pieceType } } = weaponUsage
            let isTherePiece = gameEngine.get(square)
            //TODO: weapon do no effect other weapons
            return crossWeaponValid(isTherePiece,weaponsOnBoard,square) && gameEngine.turn() === playerColor && isTherePiece && isTherePiece.type == pieceType &&
                isTherePiece.color != playerColor
        },
        weaponImageCode: () => {
            return false;
        },
        weaponArsenalDisplay: (playerColor, pieceType,duration) => {
            return (
                <React.Fragment>
                    <img src={`/${RemoveSign}`} ></img>
                    {defaultPieces[opponentColor(playerColor) + pieceType.toUpperCase()]}
                    {duration}
                </React.Fragment>
            )
        }
    },
    UpgradePiece: {
        weaponFire: (gameParams) => {
            const { square, gameEngine, playerColor } = gameParams
            let pieceInSquare = gameEngine.get(square)
            let newPiece = { type: upgradingMap[pieceInSquare.type], color: pieceInSquare.color }
            return changeOponnentPiece(gameParams, playerColor, pieceInSquare, newPiece, 'UpgradePiece')
        },
        weaponRemoved: ({ weaponsOnBoardCopy, gameEngine, weapon, square }) => {
            let pieceToPut = weapon.originalPieceInSquare
            putPiece(gameEngine, pieceToPut, square)
            delete weaponsOnBoardCopy[square]
            //TODO: check if turns to queen
        },
        movementLogic: (weaponsOnBoardCopy, targetSquare, sourceSquare, gameEngine) => {
            movePiece(weaponsOnBoardCopy, targetSquare, sourceSquare, gameEngine)
            PieceDurationTick(weaponsOnBoardCopy, targetSquare)
            return weaponsOnBoardCopy;
        },
        durationLogic: () => {
            // duration logic runs at movementLogic
        },
        validate: ({ gameEngine, square, playerColor, weaponsOnBoard }) => {
            let isTherePiece = gameEngine.get(square)
            //TODO: weapon do no effect other weapons
            return crossWeaponValid(isTherePiece,weaponsOnBoard,square) && gameEngine.turn() === playerColor && isTherePiece && isTherePiece.color == playerColor
        },
        weaponImageCode: () => {
            return 'classic';
        },
        weaponArsenalDisplay: (playerColor, pieceType,duration) => {
            return (
                <React.Fragment>
                    <img src={`/${UpgradeSign}`} ></img>
                    {duration}
                </React.Fragment>
            )
        }
    },
    DowngradePiece: {
        weaponFire: (gameParams) => {
            const { square, gameEngine, playerColor } = gameParams
            let pieceInSquare = gameEngine.get(square)
            let newPiece = { type: downGradingMap[pieceInSquare.type], color: pieceInSquare.color }
            return changeOponnentPiece(gameParams, playerColor, pieceInSquare, newPiece, 'DowngradePiece')
        },
        weaponRemoved: ({ weaponsOnBoardCopy, gameEngine, weapon, square }) => {
            let pieceToPut = weapon.originalPieceInSquare
            putPiece(gameEngine, pieceToPut, square)
            delete weaponsOnBoardCopy[square]
            //TODO: check if turns to queen
        },
        movementLogic: (weaponsOnBoardCopy, targetSquare, sourceSquare, gameEngine) => {
            movePiece(weaponsOnBoardCopy, targetSquare, sourceSquare, gameEngine)
            PieceDurationTick(weaponsOnBoardCopy, targetSquare)
            return weaponsOnBoardCopy;
        },
        durationLogic: () => {
            // duration logic runs at movementLogic
        },
        validate: ({ gameEngine, square, playerColor, weaponsOnBoard }) => {
            let isTherePiece = gameEngine.get(square)
            //TODO: weapon do no effect other weapons
            return crossWeaponValid(isTherePiece,weaponsOnBoard,square) && gameEngine.turn() === playerColor && isTherePiece && isTherePiece.color != playerColor
        },
        weaponImageCode: () => {
            return 'classic';
        },
        weaponArsenalDisplay: (playerColor, pieceType,duration) => {
            return (
                <React.Fragment>
                    <img src={`/${DowngradeSign}`} ></img>
                    {duration}
                </React.Fragment>
            )
        }
    }
}

const upgradingMap = {
    'b': 'r',
    'n': 'r',
    'p': Math.random() > 0.5 ? 'n' : 'b',
    'r': 'q',
    'k': 'k'
}

const downGradingMap = {
    'b': 'p',
    'n': 'p',
    'r': Math.random() > 0.5 ? 'n' : 'b',
    'q': 'r',
    'k': 'k'
}

const changeOponnentPiece = (gameParams, playerColor, pieceToReplace, newPiece, weaponType) => {
    const { weaponUsage, square, gameEngine } = gameParams
    gameEngine.put(newPiece, square)
    let pieceCode = newPiece.color + newPiece.type.toUpperCase() + 'weapon';
    let weaponObj = {
        [square]: {
            color: playerColor,
            ...weaponUsage.options, pieceCode: pieceCode,
            weaponType: weaponType, originalPieceInSquare: pieceToReplace
        }
    }
    let lastMove = { to: square, moveType: 'weapon', color: playerColor }
    return { lastMove, weaponObj }
}


const putPiece = (gameEngine, pieceToPut, square) => {
    gameEngine.put(pieceToPut, square)
    gameEngine.load(gameEngine.fen())
}

const movePiece = (weaponsOnBoard, targetSquare, sourceSquare, gameEngine) => {
    weaponsOnBoard[targetSquare] = weaponsOnBoard[sourceSquare]
    delete weaponsOnBoard[sourceSquare]
    gameEngine.remove(sourceSquare)
    gameEngine.load(gameEngine.fen())

}

const PieceDurationTick = (weaponsOnBoard, targetSquare) => {
    weaponsOnBoard[targetSquare].duration = weaponsOnBoard[targetSquare].duration - 1
}

const crossWeaponValid = (isTherePiece,weaponsOnBoard,square) =>{
    let isKing = isTherePiece && isTherePiece.type == 'k'
    let isThereWeapon = weaponsOnBoard[square];
    return !isThereWeapon && !isKing
}
