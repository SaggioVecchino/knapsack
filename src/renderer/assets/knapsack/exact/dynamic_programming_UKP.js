export default {
    UKP(W, objets) {
        let dp = [];
        for (let i = 0; i <= W; i++)
            dp.push(0)
        for (let i = 0; i <= W; i++)
            for (let j = 0; j < objets.length; j++)
                if (objets[j].poids <= i)
                    dp[i] = Math.max(dp[i], dp[i - objets[j].poids] + objets[j].valeur);
        return dp[W];
    }
}