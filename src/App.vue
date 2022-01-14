<template>
  <div id="haha">
    <!-- <A v-bind="company"></A> -->
    {{ company.name }}-{{ company.age }}-{{ company.ha }}
    <button @click="getBadgeValue">12312</button>
  </div>
</template>

<script>
// import A from "./A.vue";
import Vue from 'vue'
export default {
  name: "App",
  // components: { A },
  data() {
    return {
      company: {
        name: "jintu",
        age: 20,
      },
      comName: "",
    };
  },
  methods: {
    me() {
      this.company.name = "123";
      this.$nextTick(()=>{
        Vue.set(this.company,'ha','haha')
      })
      setTimeout(() => {
        this.company.ha = "xixix";
      }, 3000);
    },
    getBadgeValue() {
      const xtable = this.$refs.xTable
      return xtable ? (xtable.getInsertRecords().length + xtable.getUpdateRecords().length) : 0
    }
  },
  mounted() {
    console.log(this.company === this.$data.company);
  },
};
</script>

<style scoped lang="scss">
</style>
