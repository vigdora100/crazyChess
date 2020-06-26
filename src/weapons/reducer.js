import { clone, get } from 'lodash'

let initialState = { weaponsCollection: [] }

/*  weaponCollection: [{weaponType: 'DowngradePiece', options: { duration: 2}},
 {weaponType: 'RemovePiece', options: {pieceType: 'b', duration: 2}},
 {weaponType:'AddPiece',options: {pieceType: 'b', duration: 3}},
 {weaponType:'AddPiece',options: {pieceType: 'r', duration: 2}},
 {weaponType:'AddPiece',options: {pieceType: 'q', duration: 3}},
 {weaponType: 'RemovePiece', options: {pieceType: 'p', duration: 2}},
 {weaponType:'UpgradePiece', options: { duration: 2}}
]}; */


const WeaponsReducer = (state = initialState, action) => {
    switch (action.type) {
        case('ADD_WEAPON') : {
            const weaponObject = action;
            const tempWeaponsCollection = clone(get(state,`weaponsCollection`))
            tempWeaponsCollection.push(weaponObject)
            return Object.assign({},state, {weaponsCollection:tempWeaponsCollection })
        }
        case('REMOVE_WEAPON') : {
            const tempWeaponsCollection =state.weaponsCollection.filter((val, i) => i !== action.weaponIndex )
            return Object.assign({},state, {weaponsCollection: tempWeaponsCollection})
        }
        default:
            return initialState;
    }
}


export default WeaponsReducer


