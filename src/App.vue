<template>
  <div>
    <!--引用部分（vue文件）-->
    <tag-select v-model="value" :allTags="allTags" />
  </div>
</template>

<script>
import tagSelect from "./components/select";
export default {
  data() {
    return {
      value: [],
      allTags: [
        {
          id: "a",
          label: "a",
          children: [
            {
              id: "aa",
              label: "aa",
            },
            {
              id: "ab",
              label: "ab",
            },
          ],
        },
        {
          id: "b",
          label: "b",
        },
        {
          id: "c",
          label: "c",
        },
      ],
    };
  },
  components: {
    tagSelect,
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
</style>
