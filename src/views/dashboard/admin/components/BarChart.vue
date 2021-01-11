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
      default: '600px'
    },
    provinceOrderCounts:[String, Number,Object,Array]
  },
  data() {
    return {
      chart: null,
      provinceOrderCountsData: this.provinceOrderCounts,
      provinceName1: undefined,
      ydData: undefined,
      ltData: undefined,
      dxData: undefined
    }
  },
  watch: {
    provinceOrderCounts: {
      deep: true,  // 深度监听
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
  created(){
   // this.aaa()
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageB',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageC',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }]
      })
    },
    aaa() {
      if(this.provinceOrderCountsData!= undefined){
        if(this.provinceOrderCountsData.length != 0){
          //有数据
          console.log(this.provinceOrderCountsData)
          this.provinceOrderCountsData.forEach(function (value) {
            this.provinceName1.push(value.provinceName)  //城市名称
            this.ydData.push(value.provinceYdSuccessCount) //移动数据
            this.ltData.push(value.provinceLtSuccessCount)//联通数据
            this.dxData.push(value.provinceDxSuccessCount)//电信数据
          });
          console.log(this.provinceName1)
        }
      }else{
        //没有数据
      }
    }
  }

}
</script>
