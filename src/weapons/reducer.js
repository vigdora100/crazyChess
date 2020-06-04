import { clone } from 'lodash'


let initialState = {currentWeapon: {name: "", option: ""},
 weaponCollection: [{weaponType: 'DowngradePiece', options: { duration: 2}},
 {weaponType: 'RemovePiece', options: {pieceType: 'b', duration: 2}},
 {weaponType:'AddPiece',options: {pieceType: 'b', duration: 3}},
 {weaponType:'AddPiece',options: {pieceType: 'r', duration: 2}},
 {weaponType:'AddPiece',options: {pieceType: 'q', duration: 3}},
 {weaponType: 'RemovePiece', options: {pieceType: 'p', duration: 2}},
 {weaponType:'UpgradePiece', options: { duration: 2}}
]};


const BonusCardsReducer = (state = initialState, action) => {

    switch (action.type) {

        case('USE_WEAPON') : {
            return Object.assign({},state, {currentWeapon: {name: action.weaponType, options: action.weaponOptions }})
        }
        case('REMOVE_WEAPON') : {
            let weaponCollection = clone(state.weaponCollection)
            weaponCollection.splice(weaponCollection.indexOf(action.weaponType),1)
            return Object.assign({},state, {weaponCollection: weaponCollection})
        }
        default:
            return initialState;
    }
}


export default BonusCardsReducer


