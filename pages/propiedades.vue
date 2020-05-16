<template>
  <CtCard title="Propiedades" width="500" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addNode" />
    </template>
    <v-row dense>
      <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      <v-col cols="12" class="mt-5" v-for="nodeItem in nodes" :key=" nodeItem.id">
        <v-card color="primary" dark>
          <v-toolbar flat color="primary">
            <CtBtn type="icon" color="white" :icon="['fas', 'edit']" @click="updateNode(nodeItem.id)" />
            <v-spacer />
            <slot name="centerTitleContent">
              <v-toolbar-title v-html=" nodeItem.description" />
            </slot>
            <v-spacer />
            <CtBtn type="icon" color="warning" :icon="['fas', 'trash']" @click="removeNode(nodeItem.id)" />
          </v-toolbar>
          <v-container>
            Posición (<span v-html=" nodeItem.translation_x" />, <span v-html=" nodeItem.translation_y" />, <span v-html=" nodeItem.translation_z" />)<br>
            Rotación (<span v-html=" nodeItem.rotation_x" />, <span v-html=" nodeItem.rotation_y" />, <span v-html=" nodeItem.rotation_z" />)<br>
            Tamaño (<span v-html=" nodeItem.scale_x" />, <span v-html=" nodeItem.scale_y" />, <span v-html=" nodeItem.scale_z" />)<br>
            Fichero: <span v-html=" nodeItem.scene" /><br>
            <span v-html=" nodeItem.details" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <CtDialog v-model="form" :title="formTitle" width="500" class="mx-auto">
      <template v-slot:rightTitleContent>
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeNode" />
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
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="node.description"/>
            </v-col>
            <v-col cols="12">
              <CtTextarea append-icon="mdi-subject" label="Detalles" v-model="node.details"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-chevron-right" label="Fichero" v-model="node.scene"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-location_search" label="Posición X" v-model="node.translation_x"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-location_search" label="Posición Y" v-model="node.translation_y"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-location_search" label="Posición Z" v-model="node.translation_z"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-3d_rotation" label="Rotación X" v-model="node.rotation_x"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-3d_rotation" label="Rotación Y" v-model="node.rotation_y"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-3d_rotation" label="Rotación Z" v-model="node.rotation_z"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Tamaño X" v-model="node.scale_x"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Tamaño Y" v-model="node.scale_y"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Tamaño Z" v-model="node.scale_z"/>
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
      nodes: [],
      node: {
        description: '',
        details: '',
        creator_id: null,
        scene: '',
        translation_x: 0,
        translation_y: 0,
        translation_z: 0,
        rotation_x: 0,
        rotation_y: 0,
        rotation_z: 0,
        scale_x: 0,
        scale_y: 0,
        scale_z: 0,
      },
      nodeId: null,
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
    this.node.creator_id = this.$store.state.user.user.id
  },

  methods: {
    resetNodeData() {
      this.form = false
      this.formTitle = ''
      this.nodeId = null
      this.node.description = ''
      this.node.details = ''
      this.node.scene = ''
      this.node.translation_x = 0
      this.node.translation_y = 0
      this.node.translation_z = 0
      this.node.rotation_x = 0
      this.node.rotation_y = 0
      this.node.rotation_z = 0
      this.node.scale_x = 0
      this.node.scale_y = 0
      this.node.scale_z = 0
    },

    closeNode() {
      this.resetNodeData()
    },

    addNode() {
      this.resetNodeData()
      this.formTitle = 'Añadir propiedad'
      this.form = true
      this.nodeId = 0
    },

    initUpdateNode(node) {
      this.formTitle = 'Modificar propiedad'
      this.form = true
      this.nodeId = node.id
      this.node = node
      this.node.creator_id = node.creator.id
    },

    updateNode(nodeId) {
      this.$axios.get('/api/node/' + nodeId)
        .then((response) => (response.data) ? this.initUpdateNode(response.data) : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error get node.'))
    },

    removeNode(nodeId) {
      if (nodeId !== null) {
        this.$axios.delete('/api/node/' + nodeId)
          .then((response) => this.fetch())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error remove node.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeNode()
    },

    save() {
      if (this.nodeId === 0) {
        this.$axios.post('/api/node', this.node)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error create node.'))
        return
      }
      if (this.nodeId !== null) {
        this.$axios.put('/api/node/' + this.nodeId, this.node)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error update node.'))
        return
      }

      return
    },

    fetch() {
      this.$axios.get('/api/node')
        .then((response) => (response.data) ? this.nodes = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list nodes.'))
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>
