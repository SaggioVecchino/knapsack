export default {
  UKP(
    W,
    objets,
    PopulationSize = 26,
    Generation = 100,
    RunSetting = 60,
    timeOut = 10000,
    MutationPercentage = 0.3,
    maxKTimes = 10
  ) {
    let t0 = new Date().getTime();
    var N = objets.length;
    var Weight = objets.map(o => o.poids);
    var Profits = objets.map(o => o.valeur);
    var CombinationBitOfItem = [];
    var Chromosomes = [];
    var Fitness = [];
    var BestChromosomes = [];
    var BestFitness = [];

    function GetSizeOfGen(maxBit) {
      let binary = (maxBit >>> 0).toString(2);
      return binary.length;
    }

    function ConvertBinaryToGen(bit, sizeOfGen) {
      let binary = (bit >>> 0).toString(2);
      let result = binary.padStart(sizeOfGen, "0");
      return result;
    }

    function ConvertStringToBinary(binary) {
      let result = 0;
      let k = 0;
      for (let i = binary.length - 1; i >= 0; i--) {
        if (binary[i] == "1") result += Math.pow(2, k);
        k++;
      }
      return result;
    }

    function CuttingGen(chromosome, end, start = 0) {
      let gens = chromosome.split(" ");
      let result = [];
      for (let i = 0; i < gens.length; i++) {
        if (start == 0) {
          if (i <= end) {
            result.push(gens[i]);
          }
        } else {
          if (i > start && i <= end) {
            result.push(gens[i]);
          }
        }
      }
      if (result.length == 0) return "";

      return result.join(" ");
    }

    function CalculateWeight(chromosome) {
      let gens = chromosome.split(" ");
      let totalWeight = 0;
      for (let i = 0; i < gens.length; i++) {
        totalWeight += ConvertStringToBinary(gens[i]) * Weight[i];
      }

      return totalWeight;
    }

    function CalculateFitness(chromosome) {
      let gens = chromosome.split(" ");
      let totalFitness = 0;
      for (let i = 0; i < gens.length; i++) {
        totalFitness += ConvertStringToBinary(gens[i]) * Profits[i];
      }

      return totalFitness;
    }

    function ParentSelection() {
      let size = Chromosomes.length;
      //Tournament Selection
      let parentIndex = Math.floor(Math.random() * size);
      let bestFitness = Fitness[parentIndex];

      let round = Math.floor(Math.random() * (size - 2)) + 2;
      for (let i = 1; i <= round; i++) {
        var index = Math.floor(Math.random() * size);
        if (index != parentIndex && bestFitness < Fitness[index]) {
          parentIndex = index;
          bestFitness = Fitness[index];
        }
      }

      return parentIndex;
    }

    function Parent() {
      let parentA = ParentSelection();
      let parentB = ParentSelection();
      if (parentA == parentB) return Parent();
      return [parentA, parentB];
    }

    function SortChromosomesByFitness() {
      // One by one move boundary of unsorted subarray
      var n = Chromosomes.length;

      for (let i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array
        let min_idx = i;
        for (let j = i + 1; j < n; j++)
          if (Fitness[j] > Fitness[min_idx]) min_idx = j;

        // Swap the found minimum element with the first
        // element
        let temp = Chromosomes[min_idx];
        Chromosomes[min_idx] = Chromosomes[i];
        Chromosomes[i] = temp;

        let indexTemp = Fitness[min_idx];
        Fitness[min_idx] = Fitness[i];
        Fitness[i] = indexTemp;
      }
    }

    function InitPopulation() {
      function shuffleIndices() {
        let shuffled = [];
        for (let i = 0; i < objets.length; i++) shuffled.push(i);
        for (let i = objets.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          let tmp = shuffled[i];
          shuffled[i] = j;
          shuffled[j] = tmp;
        }
        return shuffled;
      }
      let i = 0;
      while (i < PopulationSize) {
        let strs = [];
        let chromosomesWeight = 0;
        let chromosomesFitness = 0;
        let indices = shuffleIndices();
        let capacityLeft = W;
        for (let h = 0; h < CombinationBitOfItem.length; h++) {
          let itemIndex = indices[h];
          let item = CombinationBitOfItem[itemIndex];

          let r = Math.floor(Math.random() * item.length);
          var gen = item[r];

          // Calculate Total Weight of chromosome.
          let quantity = ConvertStringToBinary(gen);

          chromosomesWeight += quantity * Weight[itemIndex];
          if (capacityLeft < chromosomesWeight)
            //We can add the chromosome
            continue;
          capacityLeft -= chromosomesWeight;
          // Calculate Fitness of chromosome.
          chromosomesFitness += quantity * Profits[itemIndex];
          strs.push(item[r]);
        }

        Chromosomes.push(strs.join(" "));
        Fitness.push(chromosomesFitness);

        i++;
      }
    }

    function mxNbOccs(arr) {
      let counts = {};
      let mx = 0;
      for (let i = 0; i < arr.length; i++) {
        let ind = arr[i];
        counts[ind] = counts[ind] ? counts[ind] + 1 : 1;
        if (counts[ind] > mx) mx = counts[ind];
      }
      return mx;
    }

    //Preprocessing loop
    for (let i = 0; i < objets.length; i++) {
      let weight = Weight[i];
      let l = W / weight;
      let binaries = [];
      let maxSizeOfGen = GetSizeOfGen(l);
      for (let j = 0; j <= l; j++) {
        let binary = ConvertBinaryToGen(j, maxSizeOfGen);
        binaries.push(binary);
      }
      CombinationBitOfItem.push(binaries);
    }

    let runs = RunSetting;
    let t = 1;
    let T = 6;

    for (let r = 1; r <= runs && new Date().getTime() - t0 < timeOut; r++) {
      // GAs

      InitPopulation();

      for (let i = 0; i < Generation; i++) {
        // Sort By Fitness.
        SortChromosomesByFitness();

        // Take 70% Chromosomes
        let Take70Percent = (PopulationSize * 70) / 100;
        Chromosomes = Chromosomes.slice(0, Take70Percent);
        Fitness = Fitness.slice(0, Take70Percent);

        while (Chromosomes.length < PopulationSize) {
          // Parent Selection.
          let parent = Parent();
          let parentAIndex = parent[0];
          let parentBIndex = parent[1];

          //Single-point Crossover
          let division = Math.floor(Math.random() * (N - 3)) + 2; // random between 2 and N-1
          let childA =
            CuttingGen(Chromosomes[parentAIndex], division) +
            " " +
            CuttingGen(Chromosomes[parentBIndex], N, division);
          let childB =
            CuttingGen(Chromosomes[parentBIndex], division) +
            " " +
            CuttingGen(Chromosomes[parentAIndex], N, division);

          let totalWeightA = CalculateWeight(childA);
          if (totalWeightA > 0 && totalWeightA <= W) {
            Chromosomes.push(childA);
            Fitness.push(CalculateFitness(childA));
          }

          if (Chromosomes.length == PopulationSize) break;

          let totalWeightB = CalculateWeight(childB);
          if (totalWeightB > 0 && totalWeightB <= W) {
            Chromosomes.push(childB);
            Fitness.push(CalculateFitness(childB));
          }
        }
        //Mutation.
        if (Math.random() <= MutationPercentage) {
          let indexMutation = Math.floor(Math.random() * PopulationSize);
          let genMutation = Math.floor(Math.random() * N);
          let chromosome = Chromosomes[indexMutation];
          let gens = chromosome.split(" ");
          let newChromosome = [];
          for (let j = 0; j < gens.length; j++) {
            let gen = gens[j];
            if (j == genMutation) {
              let increasingGen = ConvertStringToBinary(gen) + 1;
              let strGen = (increasingGen >>> 0).toString(2);
              if (gen.length >= strGen.length) {
                let newGen = ConvertBinaryToGen(increasingGen, gen.length);
                if (!newGen.includes("0")) break;
                newChromosome.push(newGen);
              }
              break;
            } else {
              newChromosome.push(gen);
            }
          }

          if (
            newChromosome.length == N &&
            CalculateWeight(newChromosome.join(" "), Weight) <= W
          ) {
            Chromosomes[indexMutation] = string.Join(" ", newChromosome);
          }
        }
      }

      // Get best-value.
      let maxValue = Math.max(...Fitness);
      let indexBestValue = Fitness.findIndex(x => x == maxValue);

      BestChromosomes.push(Chromosomes[indexBestValue]);
      BestFitness.push(maxValue);

      let maxs = mxNbOccs(BestChromosomes);

      if (maxs >= maxKTimes) break;

      if (r == runs) runs++;

      t++;

      if (t % T == 0) {
        PopulationSize = Math.floor(PopulationSize * 2.5);
      }

      // console.log("Round: " + r + " Done!!! with maxs:", maxs);
    }
    // console.log("-----------------------");
    let indexResult = BestFitness.findIndex(x => x == Math.max(...BestFitness));
    // console.log("Value: " + Math.max(...BestFitness));
    return Math.max(...BestFitness);
    // console.log("Chromosomes: " + Chromosomes[indexResult]);
    // console.log("Weight: " + CalculateWeight(Chromosomes[indexResult], Weight));
  }
};
