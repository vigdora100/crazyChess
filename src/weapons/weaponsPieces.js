import pieces from '../Chessboard/svg/chesspieces/weapons';
import React from 'react';


const generateSimpleWeaponCB = (weaponPiece) =>{
    return ({ squareWidth, isDragging, duration }) => (
        <div style={{position: 'relative'}}>
            <svg viewBox={`1 1 43 43`} width={squareWidth} height={squareWidth}>
                <g>{pieces[weaponPiece]}</g>
            </svg>
        <div style={{position: 'absolute', bottom: '1px', right: '1px'}}>{duration}</div>
        </div> 
    )
}

export default {
    wQweapon: generateSimpleWeaponCB('wQ'),
    wPweapon: generateSimpleWeaponCB('wP'),
    wNweapon: generateSimpleWeaponCB('wN'),
    wBweapon: generateSimpleWeaponCB('wB'),
    wRweapon: generateSimpleWeaponCB('wR'),
    bQweapon: generateSimpleWeaponCB('bQ'),
    bPweapon: generateSimpleWeaponCB('bP'),
    bNweapon: generateSimpleWeaponCB('bN'),
    bBweapon: generateSimpleWeaponCB('bB'),
    bRweapon: generateSimpleWeaponCB('bR'),
    noPiece: ({ squareWidth, isDragging, duration }) => (
        <div style={{position: 'relative', width: squareWidth+'px', height: squareWidth+'px'}} >
        <div style={{position: 'absolute', bottom: '1px', right: '1px'}}>{duration}</div>
        </div> 
    )
}
    

 