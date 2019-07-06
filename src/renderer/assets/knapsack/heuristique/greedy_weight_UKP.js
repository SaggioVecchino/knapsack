export default {
    UKP(W, objets) {
        let mesObjets = [...objets];
        mesObjets.sort((a, b) => a.poids - b.poids);
        let solution = [];
        let valeurOptimale = 0;
        let poidsTotal = 0;
        for (let i = 0; i < mesObjets.length; i++)
            solution.push(0);

        for (let i = 0; i < mesObjets.length; i++) {
            if (W >= mesObjets[i].poids) {
                solution[i] = Math.floor(W / mesObjets[i].poids);
                let poidsObjsI = solution[i] * mesObjets[i].poids
                W -= poidsObjsI;
                poidsTotal += poidsObjsI;
                valeurOptimale += solution[i] * mesObjets[i].valeur;
                if (W == 0)
                    break;
            }
        }

        return {
            solution,
            valeurOptimale,
            poidsTotal
        };
    }
}