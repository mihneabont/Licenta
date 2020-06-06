<template>
    <v-file-input dense :clearable="false" @change="loadTextFromFile" outlined style="height:60px;" label="Fișier date pontaj"></v-file-input>
</template>

<script>
export default {
  data() {
    return {}},
  methods: {
    loadTextFromFile(file) {
      if(file){
      let reader = new FileReader();

      reader.onload = e => this.$emit("load", e.target.result);
      reader.readAsText(file);
      }
    },
  }
};
</script>

<style>

</style>