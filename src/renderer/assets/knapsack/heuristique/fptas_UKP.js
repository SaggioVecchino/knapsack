export default {
    //fonction principal
    UKP(W, objets, epsilon) {
        //fonction DP dont la complexité n'est pas en fonction de W
        //mais de la valeur maximal qui majore la solution optimale
        let minimumCostDPUKP = function (W, objets) {
            let potentielV = objets[0].valeur / objets[0].poids;
            for (let i = 1; i < objets.length; i++) {
                let tmpPotentiel = objets[i].valeur / objets[i].poids
                if (potentielV < tmpPotentiel) {
                    potentielV = tmpPotentiel;
                }
            }
            //A ce stade potenielV contient la plus grande densité
            let valMax = Math.ceil(W * potentielV);
            //La valeur maximale qui majore la solution optimale
            //Elle sert à donner taille au tableau de la DP

            let dp = []; //Tableau de la DP

            //Dans la suite: la description dynamique lié à ce problème
            for (let v = 1; v <= valMax; v++) dp.push(Math.ceil(v / objets[0].valeur) * objets[0].poids);
            let result = 0;
            for (let i = 1; i < objets.length; i++) {
                for (let v = 0; v < valMax; v++) {
                    if (objets[i].poids >= dp[v])
                        continue;
                    if (v + 1 <= objets[i].valeur) {
                        dp[v] = Math.min(dp[v], objets[i].poids)
                    } else {
                        dp[v] = Math.min(dp[v], dp[v - objets[i].valeur] + objets[i].poids);
                    }
                    if (dp[v] <= W)
                        result = Math.max(result, v + 1);
                }
            }

            return result;
        }

        let maxVal = 0;
        for (let i = 0; i < objets.length; i++)
            maxVal = Math.max(maxVal, objets[i].valeur);
        //maxVal contient la valeur maximal
        let scalingFactor = epsilon * maxVal;
        return Math.floor(scalingFactor * minimumCostDPUKP(W, objets.map(o => ({
            poids: o.poids,
            valeur: Math.floor(o.valeur / scalingFactor)
        }))));

    }
}