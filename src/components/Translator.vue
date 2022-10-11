<template>
  <form action="/api/post/test">
    <input type="text" v-model="testdata">
    <button @click.prevent="okGoogle">GOOGLE</button>
  </form>
</template>

<script>
  import axios from 'axios';
export default {
  data() {
    return {
      testdata: '',
    }
  },
  created() {
  },
  methods: {
    okGoogle() {
      axios.post('/api/translate/post/test', testdata)
      .then(res => {
        console.log(res);
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>