import  RemovePiece  from './removePiece'
import  RemovePiecePicker from './weaponsPickers/removePiecePicker'
import  AddPiecePicker from './weaponsPickers/addPiecePicker'
import  downgradePiecePicker from './weaponsPickers/downgradePiecePicker'
import  upgradePiecePicker from './weaponsPickers/upgradePiecePicker'
import AddPiece from './addPiece'
import DowngradePiece from './downgradePiece'
import UpgradePiece from './upgradePiece'


export const MapWeaponCardsToClass ={
    "RemovePiece" : RemovePiece,
    "AddPiece": AddPiece,
    "DowngradePiece" :  DowngradePiece,
    "UpgradePiece" :  UpgradePiece,
}

export const MapWeaponPickersToClass ={
    "RemovePiece" : RemovePiecePicker,
    "AddPiece": AddPiecePicker,
    "DowngradePiece" :  downgradePiecePicker,
    "UpgradePiece" :  upgradePiecePicker,
}