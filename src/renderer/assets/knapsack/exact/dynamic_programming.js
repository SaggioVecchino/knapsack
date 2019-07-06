export default {
    knapsack01(W, objets, wantAllSolutions = false) {
        let n = objets.length; //Le nombre d'objets

        //On initialise la matrice de solution
        //(On peut éviter les 0 sur la première ligne et la première colonne)
        //Mais ceci ne diminue pas la complexité mémoire de manière significative
        //Et rend le code plus difficile à lire
        //On opte pour la lisibilité
        let K = [
            []
        ];
        //Construction de la première ligne
        for (let k = 0; k <= W; k++) K[0][k] = 0;
        //Construction de la première colonne
        for (let k = 1; k <= n; k++) {
            K.push([]);
            K[k][0] = 0;
        }
        //Construction du reste de la matrice selon la fonction de la programmation dynamique
        //correspondant à ce problème
        for (let i = 1; i <= n; i++)
            for (let w = 1; w <= W; w++)
                K[i][w] =
                objets[i - 1].poids <= w ?
                Math.max(
                    objets[i - 1].valeur + K[i - 1][w - objets[i - 1].poids],
                    K[i - 1][w]
                ) :
                K[i - 1][w];

        //Pour obtenir toutes les combinaisons des objets permettant d'obtenir
        //la solution optimale (dans le cas wantAllSolutions == true)
        let combinaisons = null;
        if (wantAllSolutions) {
            let trouverCombinaisons = function (
                nbObjets,
                contrainte,
                objets,
                matriceSolution
            ) {
                let combinaisons = [];
                let ind = 0;
                let i = nbObjets; //Juste pour rendre les commentaires plus lisibles
                combinaisons[ind] = [];

                while (i > 0 && contrainte > 0) {
                    //comparaison pour savoir est ce qu'on a pris cette valeur du troisième cas de l'equation de l'algorithme
                    //choisi pour ce problème, on peut avoir 3 cas ">", "=", "<"
                    // pour le cas "=" on a deux possibilités: ne pas prendre le i ou le prendre ce qui va donner deux sous solutions
                    let comparaison =
                        matriceSolution[i - 1][contrainte - objets[i - 1].poids] +
                        objets[i - 1].valeur -
                        matriceSolution[i - 1][contrainte];
                    if (comparaison >= 0) {
                        if (comparaison == 0) {
                            let combsSansPrendreI = trouverCombinaisons(
                                i - 1,
                                contrainte,
                                objets,
                                matriceSolution
                            );
                            let combSave = [...combinaisons[ind]]; //pour rajouter les solutions aux éléments obtenus jusqu'à maintenant
                            for (let loop = 0; loop < combsSansPrendreI.length; loop++) {
                                combinaisons[ind].push(...combsSansPrendreI[loop]);
                                ind++;
                                combinaisons[ind] = [...combSave];
                            }
                        }
                        //comparaison > 0 dans ce cas on doit prendre i ou bien comparaison = 0 et là
                        //on a déjà traité le cas de la non prise du i et on traite maintenant le cas où on prend i
                        combinaisons[ind].push(i);
                        contrainte -= objets[i - 1].poids;
                        i--;
                    } else {
                        //comparaison < 0
                        i--;
                    }
                }
                return combinaisons;
            };

            combinaisons = trouverCombinaisons(n, W, objets, K);
        }

        return [K[n][W], combinaisons];
    }
};