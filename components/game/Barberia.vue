<template>
    <div>
        <div id="barberia" v-html="ant"></div>
    </div>
</template>

<script>
export default {
  name: 'Barberia',

  data () {
    return {
      ant: null,
      antElements: {}
    }
  },

  mounted () {
    console.log(window.location.protocol + '//' + window.location.host + '/game/barberia1-2.svg')
    this.$axios
      .get(window.location.protocol + '//' + window.location.host + '/game/barberia1-2.svg')
      .then(response => {
        this.ant = response.data

        this.$nextTick(() => {
          this.addScreenElement({key: 'barberia'})
          this.addScreenElement({
            key: 'barberia1Crema1',
            animation: {
              name: 'increase',
              parameters: {
                sizeIncrease: '1.5',
                sizeDecrease: '1'
              }
            }
          })
        })
      })
  },

  methods: {
    addScreenElement (arg) {
      this.antElements[arg.key] = Snap('#' + arg.key)
      if (arg.animation !== undefined && arg.animation.name !== undefined) {
        this[arg.animation.name](arg.key, (arg.animation.parameters !== undefined) ? arg.animation.parameters : null)
      }
    },

    increase (element, parameters) {
      this.antElements[element]
        .animate({ transform: 's' + parameters.sizeIncrease }, 3000, window.mina.bounce, () => this.decrease(element, parameters))
    },
    decrease (element, parameters) {
      this.antElements[element]
        .animate({ transform: 's' + parameters.sizeDecrease }, 3000, window.mina.bounce, () => this.increase(element, parameters))
    }
  }
}
</script>

<style>
  #barberia {
    width: 50%;
    margin: 0 25vw;
  }
</style>
