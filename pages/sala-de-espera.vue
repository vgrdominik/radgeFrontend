<template>
    <CtCard title="Sala de espera" width="300" class="mx-auto">
      <v-row dense>
        <v-col cols="12" class="mt-5">
          En breves momentos serás redirigido hacia la página de propiedades.
        </v-col>
        <v-col cols="12" class="mt-5">
          <v-row>
            <v-spacer />
            <v-subheader v-html="'¿Ha pasado más de 5 segundos?'" />
            <v-spacer />
          </v-row>
        </v-col>
        <v-col cols="12" class="my-5">
          <CtBtn to="/propiedades" type="accent" block>
            Ir a propiedades
          </CtBtn>
        </v-col>
      </v-row>
    </CtCard>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => this.$router.push({ path: '/propiedades' }), 3000)
  }
}
</script>
