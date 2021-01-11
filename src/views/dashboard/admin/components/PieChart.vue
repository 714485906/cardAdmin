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
    accountOrderCountsData:[String, Number,Object,Array]
  },
  data() {
    return {
      chart: null,
      titleData: undefined,
      accountOrderCountsData1:this.accountOrderCountsData,
      list: undefined,
    }
  },
  watch: {
    accountOrderCountsData: {
      deep: true,  // 深度监听
      handler(newVal) {
        // 监听props 中的accountOrderCountsData 数据变化
        this.accountOrderCountsData1 = newVal
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

      if(this.accountOrderCountsData1!= undefined){
        if(this.accountOrderCountsData1.length != 0){
          //有数据
          let q1 = [];
          let w1= [];
          this.accountOrderCountsData.forEach(function (value) {
            q1.push(value.accountName)
            w1.push(value.accountSuccessCount+value.accountFailCount)
          });
          this.titleData = q1
          this.list = q1.map((name,i) => ({name, value: w1[i]})); // Es6数据合并
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
