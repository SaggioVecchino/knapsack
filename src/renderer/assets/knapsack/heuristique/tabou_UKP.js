export default {
    UKP(W, objets, nbIterations = 5000, tailleLT = 7, randomFromVS = false, randomInitV = true) {
        let mesObjets = [...objets]; //Une deepcopy de la liste des objets
        mesObjets.sort((a, b) => b.valeur / b.poids - a.valeur / a.poids); //On ordonne les éléments suivant les densités d'une manière décroissante, pour trouver la solution initiale et pour générer un bon voisinage à chaque étape de l'algorithme

        let LT = []; //Des couples : (valeur, liste)

        let voisinage = function (S) {
            let dansLT = function (laListe) { // retourne vrai si laListe est déjà dans LT
                for (let i = 0; i < LT.length; i++) {
                    let estCetteListe = true;
                    for (let j = 0; j < mesObjets.length; j++) {
                        if (laListe[j] != LT[i].liste[j]) {
                            estCetteListe = false;
                            break;
                        }
                    }
                    if (estCetteListe) return true;
                }
                return false;
            };
            let poidsTotal = 0; //Pour garder trace lors de la génération des éléments du voisinage de la capacité restante du sac (gagner en performance, ne pas avoir à recalculer la capacité à chaque rajout ou retrait d'objet)
            for (let i = 0; i < mesObjets.length; i++)
                poidsTotal += mesObjets[i].poids * S.liste[i];
            let listes = []; //Contient le voisinage

            for (let i = 0; i < mesObjets.length; i++) { //Pour chaque objet
                for (let k = S.liste[i]; k > 0; k--) { //essayer de supprimer k fois l'objet et le remplacer par d'autres objets et à chaque fois on rajoute la nouvelle solution dans la liste qui contient le voisinage (pour k allant du nombre d'objets d'indice i dans la solution dont on veut obtenir le voisinage à 1)
                    let changed = false; //Pour vérifier qu'on a une nouvelle solution
                    let v = S.valeur;
                    let p = poidsTotal;
                    let nouvelleListe = [...S.liste]; //Deepcopy de S.liste
                    nouvelleListe[i] -= k; //Supprimer k fois l'objet
                    v -= k * mesObjets[i].valeur; //MàJ la valeur de la solution courante
                    p -= k * mesObjets[i].poids; //MàJ du poids total de la solution courante
                    //choisir l'index de départ, 0 si on veut que pour une solution donné on veut obtenir toujours le même voisinage, aléatoire sinon
                    let initJ = randomInitV ? Math.floor(Math.random() * mesObjets.length) : 0;
                    let j = initJ;
                    do {
                        // if (i == j) continue; //On rajoute pas l'objet d'indice i (qu'on veut essayer d'omettre et de remplacer par d'autres objets)
                        if (i != j) {
                            let poidsRestant = W - p; //MàJ de la capacité restante du sac
                            let nbObj = Math.floor(poidsRestant / mesObjets[j].poids); //on prend le maximum de fois l'objet d'indice j
                            if (nouvelleListe[j] < nbObj) {
                                v += (nbObj - nouvelleListe[j]) * mesObjets[j].valeur; //MàJ de la valeur de la solution courante
                                p += (nbObj - nouvelleListe[j]) * mesObjets[j].poids; //MàJ du poids total de la solution courante
                                nouvelleListe[j] = nbObj; //MàJ du nombre d'objet d'indice j dans la solution courante
                                changed = true; //Pour indiquer qu'on a bel et bien une nouvelle solution
                            }
                        }
                        j = (j + 1) % mesObjets.length; //Passer à l'objet suivant (considérer les objets comme une liste circulaire)
                    } while (j != initJ); //Jusqu'à ce qu'on fait le tour sur tous les objets
                    if (changed && !dansLT(nouvelleListe)) //On a une nouvelle liste qui n'est pas dans LT, on l'a rajoute dans le voisinage
                        listes.push({
                            liste: [...nouvelleListe],
                            valeur: v
                        });
                    if (!changed) break; //Si on a enlever k objets d'indice i sans trouver de solution voisine, on trouvera pas une telle solution en enlevant k-1 objets d'indice i (la boucle tourne dans le sens décroissant des k)
                }
            }
            return listes;
        }; // retourne des couples : (valeur, liste) voisinant S et n'appartenant pas à LT

        let selectMeilleureSolution = function (VS) {
            if (randomFromVS) return {
                ...VS[Math.floor(Math.random() * VS.length)]
            };
            let best = {
                ...VS[0]
            };
            for (let i = 1; i < VS.length; i++) {
                if (best.valeur < VS[i].valeur)
                    best = {
                        ...VS[i]
                    };
            }
            return best;
        }; // retourne le couple (valeur, liste) ayant la plus grande valeur dans les couples de VS

        let maJLT = function (Sol) { //Met à jour la liste LT
            if (LT.length == tailleLT)
                // garder toujours la taille de la liste Tabou <= tailleLT donnée en paramètre
                LT.shift();
            LT.push(Sol);
        };

        //Obtenir la solution initial par l'algorithme glouton basé sur la densité
        let Si = (function () {
            let liste = new Array(objets.length).fill(0);
            let valeur = 0;
            let poidsTotal = 0;

            for (let i = 0; i < mesObjets.length; i++) {
                let poidsRestant = W - poidsTotal;
                if (poidsRestant >= mesObjets[i].poids) {
                    liste[i] = Math.floor(poidsRestant / mesObjets[i].poids);
                    let poidsObjsI = liste[i] * mesObjets[i].poids;
                    poidsTotal += poidsObjsI;
                    valeur += liste[i] * mesObjets[i].valeur;
                    if (poidsTotal == W) break;
                }
            }

            return {
                liste,
                valeur
            };
        })(); //Solution initiale est un couple (valeur, liste)

        let S = {
            ...Si
        };

        let Sopt = {
            ...S
        }; //Initialement la solution optimale est la solution initiale

        let cptIter = nbIterations;

        //L'algorithme Tabou
        while (cptIter-- > 0) {
            let VS = voisinage(S);
            if (VS.length == 0) break;
            let Stmp = selectMeilleureSolution(VS);
            if (Stmp.valeur > Sopt.valeur) {
                Sopt = {
                    ...Stmp
                };
            }
            S = {
                ...Stmp
            };
            maJLT({
                ...S
            });
        }
        return Sopt;
    }
}