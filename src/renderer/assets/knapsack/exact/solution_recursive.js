export default {
    knapsack01(W, objets) {
        //On démarre avec une solution optimale = 0
        // le cas où aucun objet n'est pris
        let solutionOpt = 0;

        //La fonction qui sert à faire les appels récursifs
        let knapsack01rec = (indObjCourant, poidsCourant, valeurCourante) => {
            if (indObjCourant == objets.length) {
                //on a traité tous les objets pour une combinaison de prise ou non prise,
                //c'est le temps de vérifier si on a une nouvelle solution optimale
                solutionOpt = Math.max(solutionOpt, valeurCourante);
                return;
            }

            if (poidsCourant + objets[indObjCourant].poids <= W) {
                //On peut prendre l'objet, on traite alors le cas de sa prise
                knapsack01rec(
                    indObjCourant + 1,
                    poidsCourant + objets[indObjCourant].poids,
                    valeurCourante + objets[indObjCourant].valeur
                );
            }
            //On traite le cas où on prend pas l'objet
            knapsack01rec(indObjCourant + 1, poidsCourant, valeurCourante);
        };

        //L'appel initial
        knapsack01rec(0, 0, 0);
        return solutionOpt;
    }
};