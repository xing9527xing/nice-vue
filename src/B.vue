<template>
  <div class="haha">
    
  </div>
</template>

<script>
export default {
  props: ["name"],
  data() {
    return {
      // myName: this.name
      obj: {name: "b"}
    };
  },
  methods: {
    haha() {
      this.$emit('myEvent')
    }
  },
  computed: {
    myName() {
      return this.name;
    },
  },
};
</script>

<style scoped lang="scss">
.haha {
  color: red;
}
</style>
