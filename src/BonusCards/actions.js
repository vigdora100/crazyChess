

export const useWeapon =(weaponType)=> {

    return {
        type: "USE_WEAPON",
        weaponType: weaponType
    }

}