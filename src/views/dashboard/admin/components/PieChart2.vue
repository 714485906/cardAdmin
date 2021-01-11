<template>

  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    OrderCountData:[String, Number,Object,Array]
  },
  data() {
    return {
      chart: null,
      titleData: undefined,
      OrderCountData1:this.OrderCountData,
      list: undefined,
    }
  },
  watch: {
    OrderCountData: {
      deep: true,  // 深度监听
      handler(newVal) {
        // 监听props OrderCountData 数据变化
        this.OrderCountData1 = newVal
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
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    initChart() { // 画图
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.titleData
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.list,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    aaa(){
      if(this.OrderCountData1!= undefined){
        if(this.OrderCountData1.length != 0){
          this.titleData = ['移动', '联通', '电信']
          this.list = [
              {name:'移动',value:this.OrderCountData1.ydCount},
              {name:'联通',value:this.OrderCountData1.ltCount},
              {name:'电信',value:this.OrderCountData1.dxCount}
            ]
          this.$nextTick(() => {
            this.initChart()
          })
        }else{
          //没有数据
          this.titleData = ['无数据']
          this.list = [{name:'无数据',value:500}]
          this.$nextTick(() => {
            this.initChart()
          })
        }
      }else{
       //没有数据
        this.titleData = ['无数据']
        this.list = [{name:'无数据',value:500}]
        this.$nextTick(() => {
          this.initChart()
        })
      }

    }
  },

}
</script>
