import { clone } from 'lodash'


let initialState = {currentWeapon: {name: "", option: ""},
 weaponCollection: [{weaponType: 'DOWNGRADE_PIECE'},
 {weaponType: 'REMOVE_PIECE', options: {pieceType: 'b'}},
 {weaponType:'ADD_PIECE',options: {pieceType: 'b'}},
 {weaponType:'UPGRADE_PIECE'}
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


