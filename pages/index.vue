<template>
  <div>
    Página de inicio
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    },
  },

  mounted() {
  },

  methods: {
    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>
