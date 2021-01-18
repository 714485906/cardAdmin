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
    provinceOrderCounts: [String, Number, Object, Array]
  },
  data() {
    return {
      chart: null,
      provinceOrderCountsData: this.provinceOrderCounts,
      provinceName1: Array,
      ydData: Array,
      ltData: Array,
      dxData: Array
    }
  },
  watch: {
    provinceOrderCounts: {
      deep: true, // 深度监听
      handler(newVal) {
        // 监听props 中的accountOrderCountsData 数据变化
        this.provinceOrderCountsData = newVal
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
          data: this.provinceName1,
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
          name: '移动',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.ydData,
          animationDuration
        }, {
          name: '联通',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.ltData,
          animationDuration
        }, {
          name: '电信',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.dxData,
          animationDuration
        }]
      })
    },
    aaa() {
      if (this.provinceOrderCountsData != undefined) {
        if (this.provinceOrderCountsData.length != 0) {
          // 有数据
          const provinceName1 = []
          const ydData = []
          const ltData = []
          const dxData = []
          this.provinceOrderCountsData.forEach(function(value, i) {
            provinceName1.push(value.provinceName) // 城市名称
            ydData.push(value.provinceYdSuccessCount) // 移动数据
            ltData.push(value.provinceLtSuccessCount)// 联通数据
            dxData.push(value.provinceDxSuccessCount)// 电信数据
          })
          this.provinceName1 = provinceName1
          this.ydData = ydData
          this.ltData = ltData
          this.dxData = dxData

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
