<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    orderCounts: [String, Number, Object, Array]
  },
  data() {
    return {
      chart: null,
      orderCountsData: this.orderCounts,
      provinceName1: Array,
      ydData: Array,
      ltData: Array,
      dxData: Array
    }
  },
  watch: {
    orderCounts: {
      deep: true, // 深度监听
      handler(newVal) {
        // 监听props 中的accountOrderCountsData 数据变化
        this.orderCountsData = newVal
        this.aaa()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.aaa()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.orderCountsData.name,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '总单量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.orderCountsData.value,
          animationDuration
        }]
      })
    },
    aaa() {
      if (this.orderCountsData != undefined) {
        if (this.orderCountsData.length != 0) {
          this.$nextTick(() => {
            this.initChart()
          })
        }
      } else {
        // 没有数据
      }
    }
  }

}
</script>
