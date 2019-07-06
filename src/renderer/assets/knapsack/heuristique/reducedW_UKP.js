import dynamic_programming_UKP from "../exact/dynamic_programming_UKP"

export default {
    UKP(W, objets, factor) {
        W = Math.floor(W / factor); //On prend la partie entière W/factor
        let mesObjets = [...objets].map(o => ({
            valeur: o.valeur,
            poids: Math.ceil(o.poids / factor)
            //On prend l'entier supérieur du poids/factor pour être certain
            //que la solution qu'on obtier pour le nouveau problème est
            //inférieure ou égale à la solution optimale du problème originale
        }));
        return dynamic_programming_UKP.UKP(W, mesObjets);
    }
}