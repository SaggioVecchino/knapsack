export default {
    knapsack01(W, objets) {
        let n = objets.length;

        objets = [...objets] //ne pas toucher à objets de l'extérieur (travailler sur une copie)

        // La fonction "majorant" retourne la limite du profit dans le sous-arbre ayant pour racine u
        // La fonction utilise la la méthode de la solution gloutonne pour majorer la solution optimale
        // u est un objet {level, profit, majorant, poids}
        let majorant = function (u, W, objets) {
            let n = objets.length;
            // Si le poids dépasse la capacité du sac on retourne 0 comme majorant
            if (u.poids >= W) return 0;

            // initialiser la limite par le profit courant
            let majorant = u.profit;

            // On commence à rajouter les objets à partir de l'objet qui suit l'objet courant
            let j = u.level + 1;
            let poidsTotal = u.poids;
            while (j < n && poidsTotal + objets[j].poids <= W) {
                poidsTotal += objets[j].poids;
                majorant += objets[j].valeur;
                j++;
            }

            // Si k n'est pas n, on inclut le dernier objet partiellement
            // (comme si c'était un liquide) pour obtenir le majorant
            if (j < n)
                majorant += ((W - poidsTotal) * objets[j].valeur) / objets[j].poids;

            return majorant;
        };

        //Effectuer un tri décroissant des objets suivant le rapport: valeur/poids
        objets.sort((a, b) => b.valeur / b.poids - a.valeur / a.poids);

        //Créer un file pour traverser le noeud
        let file = [];
        // un noeud pour commencer l'algorithme
        let u = {
            level: -1,
            profit: 0,
            majorant: null,
            poids: 0
        };
        file.push(u);

        let v = null;

        // Un à un on extrait un objet de l'arbre de décision
        // on calcule le profit de tous ses fils
        // tout en continuant à enregistrer le profit max
        let maxProfit = 0;

        //TQ la file n'est pas vide
        while (file.length > 0) {
            // Défiler un noeud
            u = file.shift();

            // S'il n y a rien dans le niveau suivant
            if (u.level == n - 1) continue;

            // Sinon si ce n'est pas le dernier noeud, on incrémente le niveau
            // et on calcule le profit des noeuds fils
            v = {
                level: null,
                profit: null,
                majorant: null,
                poids: null
            }; // (re)initialiser v
            v.level = u.level + 1;
            v.poids = u.poids + objets[v.level].poids;
            v.profit = u.profit + objets[v.level].valeur;

            // Si on n'a pas atteint la capacité max du sac et le profit est > au maxProfit
            // on met à jour maxProfit
            if (v.poids <= W && v.profit > maxProfit) maxProfit = v.profit;

            // Obtenir le majorant pour décider d'enfiler ou pas v
            v.majorant = majorant(v, W, objets);

            // Si le majorant est > au maxProfit alors là seulement on enfile v
            // pour de futures considérations
            if (v.majorant > maxProfit) file.push(v);

            // On refait la même chose mais sans prendre l'objet dans le sac
            v = {
                ...v
            }; // Copie profonde de v (pour avoir un nouveau v différent du v précédant)
            v.poids = u.poids;
            v.profit = u.profit;
            v.majorant = majorant(v, W, objets);
            if (v.majorant > maxProfit) file.push(v);
        }

        return maxProfit;
    }
};