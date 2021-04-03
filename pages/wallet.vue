<template>
  <CtCard title="Cartera" width="500" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addTransfer" />
    </template>
    <v-row dense>
      <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      <v-col cols="12" class="mt-5">
        <v-card color="primary" dark>
          <v-container v-if="wallet" class="text-center">
            <span v-html="wallet.balance + ' Zen'" style="font-size: 36px" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <CtDialog v-model="form" :title="formTitle" width="500" class="mx-auto">
      <template v-slot:rightTitleContent>
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeTransfer" />
      </template>
      <v-card-text>
        <v-container
          fluid
          id="scroll-target"
          style="max-height: 400px"
          class="overflow-y-auto"
        >
          <v-row dense style="height: 450px">
            <v-col cols="12">
              <v-select :items="users" item-text="name" item-value="id" append-icon="mdi-chevron-right" label="Usuario al que transferir" v-model="transfer.user_id_to_transfer"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-fingerprint" label="Cantidad" v-model="transfer.amount"/>
            </v-col>
            <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <CtBtn @click="save()" type="primary" block>
          Guardar
        </CtBtn>
      </v-card-actions>
    </CtDialog>
  </CtCard>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  middleware: 'authenticated',

  data() {
    return {
      wallet: null,
      users: [],
      transfer: {
        user_id_to_transfer: null,
        amount: 0,
      },
      transferId: null,
      formTitle: '',
      form: false
    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    },
  },

  mounted() {
    this.fetch()
    this.fetchUsers()
  },

  methods: {
    resetTransferData() {
      this.form = false
      this.formTitle = ''
      this.transferId = null
      this.transfer.user_id_to_transfer = null
      this.transfer.amount = 0
    },

    closeTransfer() {
      this.resetTransferData()
    },

    addTransfer() {
      this.resetTransferData()
      this.formTitle = 'Hacer una transferencia'
      this.form = true
      this.transferId = 0
    },

    postSave() {
      this.fetch()
      this.closeTransfer()
    },

    save() {
      this.$axios.post('/api/wallet/transferZen', this.transfer)
        .then(() => this.postSave())
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error create transfer.'))
      return
    },

    fetch() {
      this.$axios.get('/api/wallet/show')
        .then((response) => (response.data) ? this.wallet = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list transfers.'))
    },

    fetchUsers() {
      this.$axios.get('/api/listUsers')
        .then((response) => (response.data) ? this.users = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list nodes.'))
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>
