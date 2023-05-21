<template>
  <CtCard title="Perfil" width="100%" min-height="100%" class="mx-auto">
    <v-row dense>
      <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      <v-container class="text-center">
        <v-col cols="12" v-if="user.eth_wallet" v-html="user.eth_wallet" />
        <CtBtn v-html="'Vincular MetaMask'" @click="linkWallet()" />
      </v-container>
    </v-row>
  </CtCard>
</template>

<script>
import { mapActions } from 'vuex'
import CtBtn from "../components/CtBtn"
import { ethers } from 'ethers'

export default {
  components: {CtBtn},
  middleware: 'authenticated',

  data() {
    return {
      etherProvider: null
    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    },

    user () {
      return this.$store.state.user.user
    },
  },

  mounted() {
    if (typeof web3 !== 'undefined') {
      console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
      this.etherProvider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      console.log('No Web3 Detected... please install Metamask')
    }
  },

  methods: {
    async linkWallet() {
      try {
        const accountsRequest = await this.etherProvider.send('eth_requestAccounts', []);
        const signer = this.etherProvider.getSigner();
        const upAddress = await signer.getAddress();
        const message = 'Bienvenid@ a Radge!';
        const signature = await this.etherProvider.send('personal_sign', [upAddress, message]);

        this.linkWalletPost(upAddress, signature);
      } catch (e) {
        console.log(e)
      }
    },

    postSave(message) {
      console.log(message)
    },

    linkWalletPost(address, signature) {
      this.$axios.post('/api/linkWallet', {address: address, signature: signature})
        .then((message) => this.postSave(message))
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error to link wallet.'))
      return
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>
