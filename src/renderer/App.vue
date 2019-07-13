<template>
  <div id="app">
    <header>
      <ul class="navbar">
        <li>
          <a href="#" :class="{selected : k01}" @click="selectK01">Knapsack01</a>
        </li>
        <li>
          <a href="#" :class="{selected : !k01}" @click="selectUKP">UKP</a>
        </li>
      </ul>
    </header>
    <form @submit.prevent>
      <div class="gettingInfo">
        <div class="info">
          <label>
            Nombre d'objets:
            <input name="taille" type="text" v-model="taille" />
          </label>
          <a href="#" @click="taille++" class="plusmoins">+</a>
          <a href="#" @click="taille--" class="plusmoins">-</a>
        </div>
        <div class="info">
          <label>
            Capacité du sac:
            <input name="w" type="text" v-model="w" />
          </label>
          <a href="#" @click="w++" class="plusmoins">+</a>
          <a href="#" @click="w--" class="plusmoins">-</a>
        </div>
        <div class="objets" v-if="taille <= 20">
          <Objet
            v-for="(objet, index) in objets"
            :key="index"
            :poids.sync="objets[index].poids"
            :valeur.sync="objets[index].valeur"
          />
        </div>
        <button @click="aleatoire(false)">Générer les objets aléatoirement</button>
        <br />
        <!-- <button @click="aleatoire(true)">Générer tout aléatoirement et calculer</button>
        <br>-->
        <input type="file" name="dataset" @change="importDataset" id="datasetFile" />
        <br />
        <!-- <button v-if="taille>0" @click="trierObjets">Trier</button> -->
        <input type="submit" value="Calculer" @click="this.calculate" />
        <br />
        <div id="infosgen">
          <h3>Somme des poids: {{this.objets.reduce((pv, cv) => pv + cv.poids, 0)}}</h3>
          <h3>Somme des valeurs: {{this.objets.reduce((pv, cv) => pv + cv.valeur, 0)}}</h3>
          <h3>Poids d'objet maximal: {{Math.max(...this.objets.map(o=>o.poids))}}</h3>
          <h3>Poids d'objet minimal: {{Math.min(...this.objets.map(o=>o.poids))}}</h3>
          <h3>Valeur d'objet maximale: {{Math.max(...this.objets.map(o=>o.valeur))}}</h3>
          <h3>Valeur d'objet minimale: {{Math.min(...this.objets.map(o=>o.valeur))}}</h3>
          <h3>Densité d'objet maximale: {{Math.max(...this.objets.map(o=>o.valeur/o.poids)).toFixed(3)}}</h3>
          <h3>Densité d'objet minimale: {{Math.min(...this.objets.map(o=>o.valeur/o.poids)).toFixed(3)}}</h3>
        </div>
      </div>
      <div v-if="k01" class="sols">
        <h1>Knapsack 01</h1>
        <div>
          <label class="container">
            <input type="checkbox" v-model="DPK01toBeCalculated" @change="wantK01SolutionsChanged" />
            <p :class="{ notselected: !DPK01toBeCalculated }">
              <b>Dynamic Programming Solution:</b>
              {{DPK01}}
              <br />
              Time: {{DPK01t}}ms
            </p>
            <span class="checkmark"></span>
          </label>
        </div>
        <div>
          <label class="container">
            <input type="checkbox" v-model="BBK01toBeCalculated" />
            <p :class="{ notselected: !BBK01toBeCalculated }">
              <b>Branch And Bound Solution:</b>
              {{BBK01}}
              <br />
              Time: {{BBK01t}}ms
            </p>
            <span class="checkmark"></span>
          </label>
        </div>
        <div>
          <label class="container">
            <input type="checkbox" v-model="RecK01toBeCalculated" />
            <p :class="{ notselected: !RecK01toBeCalculated }">
              <b>Solution Recursive Solution:</b>
              {{RecK01}}
              <br />
              Time: {{RecK01t}}ms
            </p>
            <span class="checkmark"></span>
          </label>
        </div>
        <div>
          <label class="container">
            <input
              type="checkbox"
              v-model="wantK01Solutions"
              @change="wantK01SolutionsChanged"
              id="cbWantK01Solutions"
            />
            <p :class="{ notselected: !wantK01Solutions }">Solutions: {{k01Solutions}}</p>
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
      <div v-else class="sols">
        <h1>UKP</h1>
        <header>
          <ul class="navbar">
            <li>
              <a href="#" :class="{selected : UKPExact}" @click="UKPExact = true">Méthodes exactes</a>
            </li>
            <li>
              <a href="#" :class="{selected : !UKPExact}" @click="UKPExact = false">Heuristiques</a>
            </li>
          </ul>
        </header>
        <div v-if="UKPExact">
          <div>
            <label class="container">
              <input type="checkbox" v-model="DPUKPtoBeCalculated" />
              <p :class="{ notselected: !DPUKPtoBeCalculated }">
                <b>Dynamic Programming Solution:</b>
                {{DPUKP}}
                <br />
                Time: {{DPUKPt}}ms
              </p>
              <span class="checkmark"></span>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="BBUKPtoBeCalculated" />
              <p :class="{ notselected: !BBUKPtoBeCalculated }">
                <b>Branch And Bound Solution:</b>
                {{BBUKP}}
                <br />
                Time: {{BBUKPt}}ms
              </p>
              <span class="checkmark"></span>
            </label>
          </div>
          <p :class="{ notselected: !BBUKPtoBeCalculated }">
            Une solution:
            <span v-if="BBUKPtoBeCalculated">{{UKPSolutions}}</span>
          </p>
        </div>
        <div v-else>
          <div>
            <label class="container">
              <input type="checkbox" v-model="greedyDensityUKPtoBeCalculated" />
              <p :class="{ notselected: !greedyDensityUKPtoBeCalculated }">
                <b>Greedy basé sur la densité, Solution:</b>
                {{greedyDensityUKP}}
                <br />
                Time: {{greedyDensityUKPt}}ms
              </p>
              <span class="checkmark"></span>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="greedyPoidsUKPtoBeCalculated" />
              <p :class="{ notselected: !greedyPoidsUKPtoBeCalculated }">
                <b>Greedy basé sur le poids, Solution:</b>
                {{greedyPoidsUKP}}
                <br />
                Time: {{greedyPoidsUKPt}}ms
              </p>
              <span class="checkmark"></span>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="greedyValeurUKPtoBeCalculated" />
              <p :class="{ notselected: !greedyValeurUKPtoBeCalculated }">
                <b>Greedy basé sur la valeur, Solution:</b>
                {{greedyValeurUKP}}
                <br />
                Time: {{greedyValeurUKPt}}ms
              </p>
              <span class="checkmark"></span>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="fptasUKPtoBeCalculated" />
              <p :class="{ notselected: !fptasUKPtoBeCalculated }">
                <b>FPTAS Solution:</b>
                {{fptasUKP}}
                <br />
                Time: {{fptasUKPt}}ms
              </p>
              <label v-show="fptasUKPtoBeCalculated">
                <br />Epsilon:
                <input type="text" v-model="fptasUKPEpsilon" />
              </label>
              <span class="checkmark"></span>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="reducedWUKPtoBeCalculated" />
              <p :class="{ notselected: !reducedWUKPtoBeCalculated }">
                <b>Reduced Weight by a factor Solution:</b>
                {{reducedWUKP}}
                <br />
                Time: {{reducedWUKPt}}ms
              </p>
              <label v-show="reducedWUKPtoBeCalculated">
                <br />Facteur:
                <input type="text" v-model="reducedWUKPFactor" />
              </label>
              <span class="checkmark"></span>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="tabouUKPtoBeCalculated" />
              <p :class="{ notselected: !tabouUKPtoBeCalculated }">
                <b>Tabou Solution:</b>
                {{tabouUKP}}
                <br />
                Time: {{tabouUKPt}}ms
              </p>
              <span class="checkmark"></span>
              <div v-show="tabouUKPtoBeCalculated">
                <label>
                  <br />Nombre d'itérations:
                  <input type="text" v-model="tabouUKPNbIter" />
                </label>
                <label>
                  <br />Taille de la liste Tabou:
                  <input type="text" v-model="tabouUKPTailleLT" />
                </label>
                <label>
                  <br />Selection aléatoire à partir du voisinage:
                  <input
                    type="checkbox"
                    v-model="tabouUKPRandomFromVS"
                  />
                </label>
                <label>
                  <br />Fonction de voisinage donne des résultats différent pour une même instance:
                  <input
                    type="checkbox"
                    v-model="tabouUKPRandomInitV"
                  />
                </label>
                <label>
                  <br />Temps d'exécution maximum:
                  <input type="text" v-model="tabouUKPTimeOuts" />
                </label>
              </div>
            </label>
          </div>
          <div>
            <label class="container">
              <input type="checkbox" v-model="AGUKPtoBeCalculated" />
              <p :class="{ notselected: !AGUKPtoBeCalculated }">
                <b>Algorithme génétique:</b>
                {{AGUKP}}
                <br />
                Time: {{AGUKPt}}ms
              </p>
              <span class="checkmark"></span>
              <div v-show="AGUKPtoBeCalculated">
                <label>
                  <br />Taille de la population:
                  <input type="text" v-model="AGUKPPopulationSize" />
                </label>
                <label>
                  <br />Generation:
                  <input type="text" v-model="AGUKPGeneration" />
                </label>
                <label>
                  <br />Nombre de rounds initialement:
                  <input type="text" v-model="AGUKPRunSetting" />
                </label>
                <label>
                  <br />Temps d'exécution maximum:
                  <input type="text" v-model="AGUKPTimeOuts" />
                </label>
                <label>
                  <br />Pourcentage de mutation:
                  <input type="text" v-model="AGUKPMutationPercentage" />
                </label>
                <label>
                  <br />maxKTimes:
                  <input type="text" v-model="AGUKPMaxKTimes" />
                </label>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import branch_and_bound from "@/assets/knapsack/exact/branch_and_bound";
import dynamic_programming from "@/assets/knapsack/exact/dynamic_programming";
import solution_recursive from "@/assets/knapsack/exact/solution_recursive";
import dynamic_programming_UKP from "@/assets/knapsack/exact/dynamic_programming_UKP";
import branch_and_bound_UKP from "@/assets/knapsack/exact/branch_and_bound_UKP";
import fptas_UKP from "@/assets/knapsack/heuristique/fptas_UKP";
import greedy_density_UKP from "@/assets/knapsack/heuristique/greedy_density_UKP";
import greedy_weight_UKP from "@/assets/knapsack/heuristique/greedy_weight_UKP";
import greedy_value_UKP from "@/assets/knapsack/heuristique/greedy_value_UKP";
import reducedW_UKP from "@/assets/knapsack/heuristique/reducedW_UKP";
import tabou_UKP from "@/assets/knapsack/heuristique/tabou_UKP";
import AG_UKP from "@/assets/knapsack/heuristique/AG";

import Objet from "@/components/objet.vue";

import { setInterval, clearInterval } from "timers";

import fs from "fs";

export default {
  name: "app",
  components: {
    Objet
  },
  data() {
    return {
      wantK01Solutions: false,
      DPK01toBeCalculated: false,
      BBK01toBeCalculated: false,
      RecK01toBeCalculated: false,
      DPUKPtoBeCalculated: false,
      BBUKPtoBeCalculated: false,
      greedyDensityUKPtoBeCalculated: true,
      greedyPoidsUKPtoBeCalculated: true,
      greedyValeurUKPtoBeCalculated: true,
      fptasUKPtoBeCalculated: false,
      reducedWUKPtoBeCalculated: true,
      tabouUKPtoBeCalculated: true,
      AGUKPtoBeCalculated: true,
      k01: false,
      DPK01: "",
      DPK01t: 0,
      BBK01: "",
      BBK01t: 0,
      RecK01: "",
      RecK01t: 0,
      k01Solutions: [],
      BBUKP: "",
      BBUKPt: 0,
      DPUKP: "",
      DPUKPt: 0,
      greedyDensityUKP: "",
      greedyDensityUKPt: 0,
      greedyPoidsUKP: "",
      greedyPoidsUKPt: 0,
      greedyValeurUKP: "",
      greedyValeurUKPt: 0,
      fptasUKP: "",
      fptasUKPt: 0,
      fptasUKPEpsilon: 0.3,
      reducedWUKP: "",
      reducedWUKPt: 0,
      reducedWUKPFactor: 5,
      tabouUKP: "",
      tabouUKPt: 0,
      tabouUKPNbIter: 50,
      tabouUKPTailleLT: 7,
      tabouUKPRandomFromVS: false,
      tabouUKPRandomInitV: true,
      tabouUKPTimeOuts: 10000,
      AGUKP: "",
      AGUKPt: 0,
      AGUKPPopulationSize: 26,
      AGUKPGeneration: 100,
      AGUKPRunSetting: 60,
      AGUKPTimeOuts: 10000,
      AGUKPMutationPercentage: 0.3,
      AGUKPMaxKTimes: 10,
      UKPSolutions: [],
      w: 0,
      objets: [],
      UKPExact: true
    };
  },
  computed: {
    taille: {
      set(nvTaille) {
        if (nvTaille === "" || isNaN(nvTaille) || nvTaille < 0) {
          return nvTaille;
        }
        if (nvTaille > this.objets.length) {
          let diff = nvTaille - this.objets.length;
          let toPush = [];
          for (let i = 0; i < diff; i++) toPush.push({ poids: 0, valeur: 0 });
          this.objets = [...this.objets, ...toPush];
          return nvTaille;
        }
        if (nvTaille < this.objets.length) {
          this.objets = this.objets.slice(0, nvTaille);
          return nvTaille;
        }
        return nvTaille;
      },
      get() {
        return this.objets.length;
      }
    },
    AGUKPTimeOut() {
      return parseInt(this.AGUKPTimeOuts);
    },
    tabouUKPTimeOut() {
      return parseInt(this.tabouUKPTimeOuts);
    }
  },
  methods: {
    calculateDPK01(wantAllSolutions = false) {
      let t0 = new Date().getTime();
      let tmp = dynamic_programming.knapsack01(
        this.w,
        this.objets,
        wantAllSolutions
      );
      this.DPK01t = new Date().getTime() - t0;
      this.DPK01 = tmp[0];
      this.k01Solutions = tmp[1];
    },
    calculateBBK01() {
      let t0 = new Date().getTime();
      this.BBK01 = branch_and_bound.knapsack01(this.w, this.objets);
      this.BBK01t = new Date().getTime() - t0;
    },
    calculateRecK01() {
      let t0 = new Date().getTime();
      this.RecK01 = solution_recursive.knapsack01(this.w, this.objets);
      this.RecK01t = new Date().getTime() - t0;
    },
    calculateDPUKP() {
      let t0 = new Date().getTime();
      this.DPUKP = dynamic_programming_UKP.UKP(this.w, this.objets);
      this.DPUKPt = new Date().getTime() - t0;
    },
    calculateBBUKP() {
      let t0 = new Date().getTime();
      let tmp = branch_and_bound_UKP.UKP(this.w, this.objets);
      this.BBUKPt = new Date().getTime() - t0;
      this.BBUKP = tmp.value;
      this.UKPSolutions = tmp.tuple;
    },
    calculateGreedyDensityUKP() {
      let t0 = new Date().getTime();
      this.greedyDensityUKP = greedy_density_UKP.UKP(
        this.w,
        this.objets
      ).valeurOptimale;
      this.greedyDensityUKPt = new Date().getTime() - t0;
    },
    calculateGreedyPoidsUKP() {
      let t0 = new Date().getTime();
      this.greedyPoidsUKP = greedy_weight_UKP.UKP(
        this.w,
        this.objets
      ).valeurOptimale;
      this.greedyPoidsUKPt = new Date().getTime() - t0;
    },
    calculateGreedyValeurUKP() {
      let t0 = new Date().getTime();
      this.greedyValeurUKP = greedy_value_UKP.UKP(
        this.w,
        this.objets
      ).valeurOptimale;
      this.greedyValeurUKPt = new Date().getTime() - t0;
    },
    calculateFPTASUKP(epsilon) {
      let t0 = new Date().getTime();
      this.fptasUKP = fptas_UKP.UKP(this.w, this.objets, epsilon);
      this.fptasUKPt = new Date().getTime() - t0;
    },
    calculateReducedWUKP(factor) {
      let t0 = new Date().getTime();
      this.reducedWUKP = reducedW_UKP.UKP(this.w, this.objets, factor);
      this.reducedWUKPt = new Date().getTime() - t0;
    },
    calculateTabouUKP(
      nbIterations = 500,
      tailleLT = 7,
      randomFromVS = false,
      randomInitV = true,
      timeOut = 10000
    ) {
      let t0 = new Date().getTime();
      this.tabouUKP = tabou_UKP.UKP(
        this.w,
        this.objets,
        nbIterations,
        tailleLT,
        randomFromVS,
        randomInitV,
        timeOut
      ).valeur;
      this.tabouUKPt = new Date().getTime() - t0;
    },
    calculateAGUKP(
      PopulationSize = 26,
      Generation = 100,
      RunSetting = 60,
      timeOut = 10000,
      MutationPercentage = 0.3,
      maxKTimes = 10
    ) {
      let t0 = new Date().getTime();
      this.AGUKP = AG_UKP.UKP(
        this.w,
        this.objets,
        PopulationSize,
        Generation,
        RunSetting,
        timeOut,
        MutationPercentage,
        maxKTimes
      );
      this.AGUKPt = new Date().getTime() - t0;
    },
    calculate() {
      if (this.DPK01toBeCalculated) this.calculateDPK01(this.wantK01Solutions);
      if (this.BBK01toBeCalculated) this.calculateBBK01();
      if (this.RecK01toBeCalculated) this.calculateRecK01();
      if (this.DPUKPtoBeCalculated) this.calculateDPUKP();
      if (this.BBUKPtoBeCalculated) this.calculateBBUKP();
      if (this.greedyDensityUKPtoBeCalculated) this.calculateGreedyDensityUKP();
      if (this.greedyPoidsUKPtoBeCalculated) this.calculateGreedyPoidsUKP();
      if (this.greedyValeurUKPtoBeCalculated) this.calculateGreedyValeurUKP();
      if (this.fptasUKPtoBeCalculated)
        this.calculateFPTASUKP(this.fptasUKPEpsilon);
      if (this.reducedWUKPtoBeCalculated)
        this.calculateReducedWUKP(this.reducedWUKPFactor);
      if (this.tabouUKPtoBeCalculated)
        this.calculateTabouUKP(
          this.tabouUKPNbIter,
          this.tabouUKPTailleLT,
          this.tabouUKPRandomFromVS,
          this.tabouUKPRandomInitV,
          this.tabouUKPTimeOut
        );
      if (this.AGUKPtoBeCalculated)
        this.calculateAGUKP(
          this.AGUKPPopulationSize,
          this.AGUKPGeneration,
          this.AGUKPRunSetting,
          this.AGUKPTimeOut,
          this.AGUKPMutationPercentage,
          this.AGUKPMaxKTimes
        );
    },
    aleatoire(tout = false) {
      if (tout) this.taille = Math.floor(Math.random() * 400) + 30;
      this.objets = this.objets.map(() => {
        let p = Math.floor(Math.random() * 5000) + 500;
        return {
          poids: p,
          valeur: parseInt((p + Math.floor(Math.random() * 3 - 6)) / 8)
        };
      });
      if (tout) {
        let tmp = Math.floor(
          (Math.random() * this.objets.reduce((pv, cv) => pv + cv.poids, 0)) /
            3.5
        );
        this.w = Math.min(tmp, 65);
        this.calculate();
      }
    },
    trierObjets() {
      this.objets.sort(
        (a, b) =>
          b.valeur / (b.poids > 0 ? b.poids : 1) -
          a.valeur / (a.poids > 0 ? a.poids : 1)
      );
    },
    importDataset() {
      let el = document.querySelector("#datasetFile");
      if (el.files) {
        let path = el.files[0].path;
        let file = fs.readFileSync(path, { encoding: "utf8" }).split("\n");
        this.w = parseInt(file[5].substr(3));
        this.objets = file
          .slice(8, -2)
          .map(line => line.split("\t"))
          .map(e => ({ valeur: parseInt(e[1]), poids: parseInt(e[0]) }));
      }
    },
    selectK01() {
      this.k01 = true;
      this.DPUKPtoBeCalculated = false;
      this.BBUKPtoBeCalculated = false;
      this.greedyDensityUKPtoBeCalculated = false;
      this.greedyPoidsUKPtoBeCalculated = false;
      this.greedyValeurUKPtoBeCalculated = false;
      this.reducedWUKPtoBeCalculated = false;
      this.fptasUKPtoBeCalculated = false;
      this.tabouUKPtoBeCalculated = false;
      this.AGUKPtoBeCalculated = false;
    },
    selectUKP() {
      this.k01 = false;
      this.wantK01Solutions = false;
      this.DPK01toBeCalculated = false;
      this.BBK01toBeCalculated = false;
      this.RecK01toBeCalculated = false;
    },
    wantK01SolutionsChanged() {
      this.wantK01Solutions = this.wantK01Solutions && this.DPK01toBeCalculated;
      document.querySelector(
        "#cbWantK01Solutions"
      ).checked = this.wantK01Solutions;
    }
  },
  created() {}
};
</script>

<style>
html,
body,
* {
  box-sizing: border-box;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 300px;
}

header {
  border: 1px #2c3e50 solid;
  margin: 0 0 10px 0;
}

ul.navbar {
  list-style-type: none;
  margin: 0;
  padding: 10px;
  display: flex;
  justify-content: center;
}

ul.navbar li a {
  display: block;
  width: 130px;
  height: 100%;
  color: #2c3e50;
  padding: 8px 16px;
  text-decoration: none;
}

ul.navbar li a:hover {
  background-color: #415b75;
  color: white;
}

ul.navbar li a.selected {
  background-color: #2c3e50;
  color: white;
}

.gettingInfo {
  padding: 5px;
  background-color: #2c3e50;
  color: white;
}

.plusmoins {
  color: white;
  text-decoration: none;
  margin: 0 2px;
  font-size: 20px;
}

.info {
  margin: 7px 0;
}

.objets {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

h3 {
  margin: 3px 0;
}

#infosgen {
  margin: 15px 0 0 0;
}

.sols p {
  display: inline-block;
}

.notselected {
  color: #ddd;
}

.container {
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container > input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -5px;
  left: -30px;
  height: 20px;
  width: 20px;
  background-color: #ddd;
}

.container:hover input ~ .checkmark {
  background-color: #ccc;
}

.container input:checked ~ .checkmark {
  background-color: #415b75;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
  left: 6px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

p {
  margin-bottom: -3px;
  margin-top: 50px;
}

label {
  height: 12px;
}
</style>
