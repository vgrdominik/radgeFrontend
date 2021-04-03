<template>
  <CtCard title="Planos crafteables" width="500" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addBlueprint" />
    </template>
    <v-row dense>
      <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      <v-col cols="12" class="mt-5" v-for="blueprintItem in blueprintToCraftUsers" :key=" blueprintItem.id">
        <v-card color="primary" dark>
          <v-toolbar flat color="primary">
            <v-spacer />
            <slot name="centerTitleContent">
              <v-toolbar-title v-html=" blueprintItem.description" />
            </slot>
            <v-spacer />
          </v-toolbar>
          <v-container>
            Id: <span v-html="blueprintItem.id" /><br>
            Plano: <span v-html="blueprintItem.description" /><br>
            Propietario: <span v-html="blueprintItem.owner.description" /><br>
            <span v-html="blueprintItem.details" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <CtDialog v-model="form" :title="formTitle" width="500" class="mx-auto">
      <template v-slot:rightTitleContent>
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeBlueprint" />
      </template>
      <v-card-text>
        <v-container
          fluid
          id="scroll-target"
          style="max-height: 400px"
          class="overflow-y-auto"
        >
          <v-row dense style="height: 450px">
            <v-col cols="12" class="mt-5">
              <v-select :items="blueprints" item-text="description" item-value="id" append-icon="mdi-chevron-right" label="Plano" v-model="blueprintToCraft.blueprint_id"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-fingerprint" label="Código para desbloqueo" v-model="blueprintToCraft.code"/>
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
      blueprintToCraftUsers: [],
      blueprints: [],
      blueprintToCraft: {
        blueprint_id: null,
        code: '',
      },
      blueprintId: null,
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
    this.fetchBlueprint()
  },

  methods: {
    resetBlueprintData() {
      this.form = false
      this.formTitle = ''
      this.blueprintId = null
      this.blueprintToCraft.blueprint_id = null
      this.blueprintToCraft.code = ''
    },

    closeBlueprint() {
      this.resetBlueprintData()
    },

    addBlueprint() {
      this.resetBlueprintData()
      this.formTitle = 'Añadir plano crafteable'
      this.form = true
      this.blueprintId = 0
    },

    postSave() {
      this.fetch()
      this.closeBlueprint()
    },

    save() {
      if (this.blueprintId === 0) {
        this.$axios.post('/api/addBlueprintToCraftUser', this.blueprintToCraft)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error create blueprint.'))
        return
      }
      if (this.blueprintId !== null) {
        this.$axios.put('/api/blueprint/' + this.blueprintId, this.blueprint)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error update blueprint.'))
        return
      }

      return
    },

    fetch() {
      this.$axios.get('/api/getBlueprintToCraftUser')
        .then((response) => (response.data) ? this.blueprintToCraftUsers = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list blueprints.'))
    },

    fetchBlueprint() {
      this.$axios.get('/api/blueprint')
        .then((response) => (response.data) ? this.blueprints = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list nodes.'))
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>
