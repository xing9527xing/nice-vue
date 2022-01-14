<template>
  <div class="haha">
    {{name}}-{{age}}
  </div>
</template>

<script>
import B from "./B.vue";
export default {
  name: 'acomponent',
  components: { B },
  props: ['name','age'],
  data() {
    return {
    };
  },
  mounted() {
   console.log(this.$attrs);
  },
  methods: {
    
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
