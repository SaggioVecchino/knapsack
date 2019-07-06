export default {
    UKP(W, objets) {

        let wt = objets.map(obj => obj.poids);
        let v = objets.map(obj => obj.valeur);

        let separate = function (W, sortedObjects, tuple) {
            let j = 0
            for (let i of tuple) {
                if (i != -1) {
                    W -= i * sortedObjects[j].weight
                    j++
                }
            }
            let maxIndex = 0
            while (W - (maxIndex + 1) * sortedObjects[j].weight >= 0) {
                maxIndex++
            }
            let returnedArray = []
            for (let i = 0; i <= maxIndex; i++)
                returnedArray.push(i)
            return returnedArray
        }

        let isAsoltion = function (W, sortedObjects, tuple) {
            let j = 0
            for (let i of tuple) {
                W -= i * sortedObjects[j].weight
                j++
            }
            while (j < sortedObjects.length) {
                if (W - sortedObjects[j].weight >= 0)
                    break
                else j++
            }
            return j === sortedObjects.length
        }

        let evaluate = function (W, sortedObjects, tuple) {
            if (isAsoltion(W, sortedObjects, tuple)) {
                let sum = 0
                for (let i = 0; i < tuple.length; i++) {
                    sum += tuple[i] * sortedObjects[i].value
                }
                while (tuple.length < sortedObjects.length)
                    tuple.push(0)
                return {
                    isAsloution: true,
                    value: sum,
                    tuple: tuple
                }
            }
            let j = 0
            let sum = 0
            for (let i of tuple) {
                W -= i * sortedObjects[j].weight
                sum += i * sortedObjects[j].value
                j++
            }
            sum += (W / sortedObjects[j].weight) * sortedObjects[j].value
            return {
                isAsloution: false,
                value: sum,
                tuple: tuple
            }
        }

        let sortObjects = function (wt, v) {
            let X = []
            for (let i = 0; i < wt.length; i++) {
                X.push({
                    weight: wt[i],
                    value: v[i]
                })
            }
            X.sort((a, b) => (a.value / a.weight) - (b.value / b.weight)).reverse()
            return X
        }

        let findSolution = function (W, sortedObjects) {
            let objIndex = 0
            let val = 0
            let tuple = Array(sortedObjects.length).fill(0)
            while (objIndex < sortedObjects.length) {
                if (W >= sortedObjects[objIndex].weight) {
                    W -= sortedObjects[objIndex].weight
                    val += sortedObjects[objIndex].value
                    tuple[objIndex]++
                } else
                    objIndex++
            }
            return {
                tuple: tuple,
                value: val
            }
        }

        let nodes = []
        let sortedObjects = sortObjects(wt, v)
        let AcctualSolution = findSolution(W, sortedObjects)
        let tuple = [-1]
        let separationArray = separate(W, sortedObjects, tuple)
        for (let i of separationArray) {
            tuple[0] = i
            let evaluation = evaluate(W, sortedObjects, tuple)
            if (evaluation.isAsloution) {
                if (evaluation.value > AcctualSolution.value) {
                    AcctualSolution.value = evaluation.value
                    AcctualSolution.tuple = evaluation.tuple
                }
            } else {
                if (evaluation.value >= AcctualSolution.value + 1)
                    nodes.push({
                        depth: 0,
                        tuple: [...tuple],
                        eval: evaluation.value
                    })
            }
        }
        while (nodes.length) {
            let activeNode = nodes.pop()
            if (activeNode.eval >= AcctualSolution.value + 1) {
                tuple = activeNode.tuple
                tuple.push(-1)
                separationArray = separate(W, sortedObjects, tuple)
                for (let i of separationArray) {
                    tuple[activeNode.depth + 1] = i
                    let evaluation = evaluate(W, sortedObjects, tuple)
                    if (evaluation.isAsloution) {
                        if (evaluation.value > AcctualSolution.value) {
                            AcctualSolution.value = evaluation.value
                            AcctualSolution.tuple = evaluation.tuple
                        }
                    } else {
                        if (evaluation.value > AcctualSolution.value + 1)
                            nodes.push({
                                depth: activeNode.depth + 1,
                                tuple: [...tuple],
                                eval: evaluation.value
                            })
                    }
                }
            }
        }
        return AcctualSolution
    }

}