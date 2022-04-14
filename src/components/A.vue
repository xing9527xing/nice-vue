<template>
  <div>
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["name"],
  beforeCreate() {
    console.log("beforeCreate22");
  },
  created() {
    console.log("created22");
  },
  updated() {
    console.log("updated22");
  },
  mounted() {
    console.log("mountede22");
  },
};
</script>

<style scoped lang="scss">
</style>
