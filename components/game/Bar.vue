<template>
    <div>
        <div id="bar" v-html="ant"></div>
    </div>
</template>

<script>
import Snap from 'snapsvg'

export default {
  name: 'Bar',

  data () {
    return {
      ant: null,
      antElements: {}
    }
  },

  mounted () {
    this.$axios
      .get('/static/game/bar1.svg')
      .then(response => {
        this.ant = response.data

        this.$nextTick(() => {
          this.addScreenElement({key: 'bar1'})

          this.addScreenElement({
            key: 'tamburete1',
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
    newId () {
      return '_' + Math.random().toString(36).substr(2, 9)
    },

    addScreenElement (arg) {
      let newId = this.newId()
      document.getElementById(arg.key).id = newId
      this.antElements[arg.key] = Snap('#' + newId)
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
