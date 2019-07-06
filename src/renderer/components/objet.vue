<template>
  <div class="objet">
    <div>
      <label>
        Poids:
        <input name="poids" type="text" v-model="poidsData">
      </label>
    </div>
    <div>
      <label>
        Valeur:
        <input name="valeur" type="text" v-model="valeurData">
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "Objet",
  props: {
    poids: Number,
    valeur: Number,
    id: Number
  },
  computed: {
    poidsData: {
      set(nvPoids) {
        this.poids = nvPoids === "" ? "" : parseInt(nvPoids);
      },
      get() {
        this.$emit("update:poids", this.poids);
        return this.poids;
      }
    },
    valeurData: {
      set(nvValeur) {
        this.valeur = nvValeur === "" ? "" : parseInt(nvValeur);
      },
      get() {
        this.$emit("update:valeur", this.valeur);
        return this.valeur;
      }
    }
  }
};
</script>

<style scoped>
.objet {
  margin: 4px;
  padding: 2px;
  color: white;
  width: 200px;
  border: 1px solid white;
}

input {
  width: 50px;
}
</style>
