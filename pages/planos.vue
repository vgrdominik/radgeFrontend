<template>
  <CtCard title="Planos" width="500" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addBlueprint" />
    </template>
    <v-row dense>
      <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      <v-col cols="12" class="mt-5" v-for="blueprintItem in blueprints" :key=" blueprintItem.id">
        <v-card color="primary" dark>
          <v-toolbar flat color="primary">
            <CtBtn type="icon" color="white" :icon="['fas', 'edit']" @click="updateBlueprint(blueprintItem.id)" />
            <v-spacer />
            <slot name="centerTitleContent">
              <v-toolbar-title v-html=" blueprintItem.description" />
            </slot>
            <v-spacer />
            <CtBtn type="icon" color="warning" :icon="['fas', 'trash']" @click="removeBlueprint(blueprintItem.id)" />
          </v-toolbar>
          <v-container>
            Id: <span v-html="blueprintItem.id" /><br>
            Código para desbloqueo: <span v-html="blueprintItem.code" /><br>
            Fichero: <span v-html="blueprintItem.scene" /><br>
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
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="blueprint.description"/>
            </v-col>
            <v-col cols="12">
              <CtTextarea append-icon="mdi-subject" label="Detalles" v-model="blueprint.details"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-subject" label="Código para desbloqueo" v-model="blueprint.code"/>
            </v-col>
            <v-col cols="12">
              <CtTextarea append-icon="mdi-subject" label="Fichero" v-model="blueprint.scene"/>
            </v-col>
            <v-col cols="12">
              <v-select :items="users" item-text="name" item-value="id" append-icon="mdi-chevron-right" label="Propietario" v-model="blueprint.owner_id"/>
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
      blueprints: [],
      users: [],
      blueprint: {
        description: '',
        code: '',
        details: '',
        creator_id: null,
        owner_id: null,
        scene: '',
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
    this.fetchUsers()
    this.blueprint.creator_id = this.$store.state.user.user.id
  },

  methods: {
    resetBlueprintData() {
      this.form = false
      this.formTitle = ''
      this.blueprintId = null
      this.blueprint.description = ''
      this.blueprint.code = ''
      this.blueprint.details = ''
      this.blueprint.owner_id = null
    },

    closeBlueprint() {
      this.resetBlueprintData()
    },

    addBlueprint() {
      this.resetBlueprintData()
      this.formTitle = 'Añadir plano'
      this.form = true
      this.blueprintId = 0
    },

    initUpdateBlueprint(blueprint) {
      this.formTitle = 'Modificar plano'
      this.form = true
      this.blueprintId = blueprint.id
      this.blueprint = blueprint
      this.blueprint.creator_id = blueprint.creator.id
    },

    updateBlueprint(blueprintId) {
      this.$axios.get('/api/blueprint/' + blueprintId)
        .then((response) => (response.data) ? this.initUpdateBlueprint(response.data) : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error get blueprint.'))
    },

    removeBlueprint(blueprintId) {
      if (blueprintId !== null) {
        this.$axios.delete('/api/blueprint/' + blueprintId)
          .then((response) => this.fetch())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error remove blueprint.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeBlueprint()
    },

    save() {
      if (this.blueprintId === 0) {
        this.$axios.post('/api/blueprint', this.blueprint)
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
      this.$axios.get('/api/blueprint')
        .then((response) => (response.data) ? this.blueprints = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list blueprints.'))
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
