<template>
  <div class="dashboard-editor-container">
    <!--    <github-corner class="github-corner" />-->
    <el-radio-group v-model="transactionlistQuery.periodType" size="medium" @change="handleChange">
      <el-radio-button :label="0">全量</el-radio-button>
      <el-radio-button :label="1">上月</el-radio-button>
      <el-radio-button :label="2">本月</el-radio-button>
      <el-radio-button :label="3">上周</el-radio-button>
      <el-radio-button :label="4">本周</el-radio-button>
      <el-radio-button :label="5">昨日</el-radio-button>
      <el-radio-button :label="6">今日</el-radio-button>
      <el-radio-button :label="7">自定义</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-if="dateTimeShow"
      v-model="dateTime1"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束时间"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="width: 260px;margin-left: 20px"
      @change="ChangeTimeDateType7"
    />
    <!--总量统计-->
    <panel-group :order-count-data="OrderCountData" />

    <!--渠道账号统计-->
    <account-order-counts :account-order-counts="OrderCountData.accountOrderCounts" />

    <el-row :gutter="32">
      <el-col :xs="12" :sm="12" :lg="8">
        <div class="chart-wrapper">
          <pie-chart2 :order-count-data="OrderCountData" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :account-order-counts-data="OrderCountData.accountOrderCounts" />
        </div>
      </el-col>
    </el-row>
    <!--城市统计-->
    <el-radio-group v-model="transactionlistQuery.periodType" size="medium" style="padding: 10px 0px" @change="handleChange">
      <el-radio-button :label="0">全量</el-radio-button>
      <el-radio-button :label="1">上月</el-radio-button>
      <el-radio-button :label="2">本月</el-radio-button>
      <el-radio-button :label="3">上周</el-radio-button>
      <el-radio-button :label="4">本周</el-radio-button>
      <el-radio-button :label="5">昨日</el-radio-button>
      <el-radio-button :label="6">今日</el-radio-button>
      <el-radio-button :label="7">自定义</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-if="dateTimeShow"
      v-model="dateTime1"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束时间"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="width: 260px;margin-left: 20px"
      @change="ChangeTimeDateType7"
    />
    <el-row style="height: 600px">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-col>
            <div class="chart-wrapper">
              <bar-chart :province-order-counts="OrderCountData.provinceOrderCounts" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!--渠道-->
    <el-radio-group v-model="transactionlistQuery.periodType" size="medium" style="padding: 10px 0px" @change="handleChange">
      <el-radio-button :label="0">全量</el-radio-button>
      <el-radio-button :label="1">上月</el-radio-button>
      <el-radio-button :label="2">本月</el-radio-button>
      <el-radio-button :label="3">上周</el-radio-button>
      <el-radio-button :label="4">本周</el-radio-button>
      <el-radio-button :label="5">昨日</el-radio-button>
      <el-radio-button :label="6">今日</el-radio-button>
      <el-radio-button :label="7">自定义</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-if="dateTimeShow"
      v-model="dateTime1"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束时间"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="width: 260px;margin-left: 20px"
      @change="ChangeTimeDateType7"
    />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :xs="24" :sm="24" :lg="8">
        <h4>营销员</h4>
        <div class="chart-wrapper">
          <account-bar-chart :order-counts="userOrderCountsData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <h4>渠道账号</h4>
        <div class="chart-wrapper">
          <account-bar-chart :order-counts="accountOrderCountsData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <h4>渠道平台</h4>
        <div class="chart-wrapper">
          <account-bar-chart :order-counts="channelOrderCountsData" />
        </div>
      </el-col>
    </el-row>
    <!--时间/总量统计-->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <h4>时间/总量统计</h4>
      <el-date-picker
        v-model="listQuery.createDate"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="width: 150px;margin-left: 20px"
        @change="ChangeTime"
      />
      <el-radio-group v-model="listQuery.operatorType" size="medium" style="padding: 10px 0px;margin-left: 20px" @change="operatorTypeChange">
        <el-radio-button :label="1">移动</el-radio-button>
        <el-radio-button :label="2">联通</el-radio-button>
        <el-radio-button :label="3">电信</el-radio-button>
      </el-radio-group>
      <el-select
        v-model="accountIdsToString"
        multiple
        collapse-tags
        style="margin-left: 20px;"
        @change="accountIdsChange"
        placeholder="请选择">
        <el-option
          v-for="item in AccountData"
          :key="item.accountId"
          :label="item.accountName+'-('+item.username+')'"
          :value="item.accountId">
        </el-option>
      </el-select>
      <line-chart :chart-data="orderCountourHour" />
    </el-row>
    <!--时间/点击量统计-->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <h4>时间/点击量统计</h4>
      <line-chart :chart-data="clickCountData" />
    </el-row>

    <!--时间/平均点击率-->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <h4>时间/平均点击率</h4>
      <line-chart :chart-data="clickRateData" />
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import accountOrderCounts from './components/accountOrderCounts'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import PieChart2 from './components/PieChart2'
import BarChart from './components/BarChart'
import accountBarChart from './components/accountBarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import AccountOrderCounts from '@/views/dashboard/admin/components/accountOrderCounts'

import { transactionList, getOrderCountByHour } from '@/api/remote-search'
import { getgetAccounts } from '@/api/channel'

export default {
  name: 'DashboardAdmin',
  components: {
    AccountOrderCounts,
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    PieChart2,
    BarChart,
    accountBarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      transactionlistQuery:{
        periodType: 6,
        beginCreateDate: undefined,
        endCreateDate: undefined
      },
      dateTime1: '',
      dateTimeShow: false,
      accountIdsToString:undefined,
      listQuery:{
        accountIds:undefined,
        createDate:undefined,
        operatorType:2
      },
      OrderCountData: [],
      orderCountourHour: {
        accountName:undefined,
        hourOrderCounts:[],
      },
      clickCountData: {
        accountName:undefined,
        hourOrderCounts:[],
      },
      clickRateData: {
        accountName:undefined,
        hourOrderCounts:[],
      },
      AccountData:undefined,
      userOrderCountsData:{
        name: undefined,
        value: undefined
      },
      accountOrderCountsData:{
        name: undefined,
        value: undefined
      },
      channelOrderCountsData:{
        name: undefined,
        value: undefined
      }

    }
  },
  created() {
    this.fetchData()
    this.getOrderCountByHourFun()
    this.getgetAccountsFun()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleChange(val) {
      this.dateType = val
      if (val == 7) {
        this.dateTimeShow = true
      } else {
        this.dateTime1 = ''
        this.transactionlistQuery.beginCreateDate = undefined
        this.transactionlistQuery.endCreateDate = undefined
        this.dateTimeShow = false
        this.fetchData()
      }
    },
    operatorTypeChange(){
      this.getOrderCountByHourFun()
    },
    ChangeTimeDateType7(val){
      console.log(val)
      this.transactionlistQuery.beginCreateDate = val[0]
      this.transactionlistQuery.endCreateDate = val[1]
      this.fetchData()
    },
    accountIdsChange(val){
      this.listQuery.accountIds =this.accountIdsToString.join(',')
      this.getOrderCountByHourFun()
    },
    ChangeTime(){
     this.getOrderCountByHourFun()
    },
    fetchData() { //初始单量统计
      transactionList(this.transactionlistQuery).then(response => {
        let that = this;
        this.OrderCountData = response.data
          this.userOrderCountsData.name = [] // 每一次调用清空
          this.userOrderCountsData.value = []// 每一次调用清空
          this.accountOrderCountsData.name = [] // 每一次调用清空
          this.accountOrderCountsData.value = []// 每一次调用清空
          this.channelOrderCountsData.name = [] // 每一次调用清空
          this.channelOrderCountsData.value = []// 每一次调用清空

        /*用户总单量*/
        response.data.userOrderCounts.forEach(function(item){
          that.userOrderCountsData.name.push(item.username) //用户名称
          that.userOrderCountsData.value.push(item.userTotalCount) //用户总单量
        })
        //渠道账号
        response.data.accountOrderCounts.forEach(function(item){
          that.accountOrderCountsData.name.push(item.accountName+"("+item.username+")") //渠道账号名称
          that.accountOrderCountsData.value.push(item.accountSuccessCount) //渠道账号成功单量
        })

        //渠道账号
        response.data.channelOrderCounts.forEach(function(item){
          that.channelOrderCountsData.name.push(item.channelName) //渠道名称
          that.channelOrderCountsData.value.push(item.channelTotalCount) //渠道总单量
        })

      })
    },
    getOrderCountByHourFun() { //初始按小时统计单量

      getOrderCountByHour(this.listQuery).then(response => {
        this.getOrderCountByHourData = response.data
        //公共数据
        let accountNameData = []; //账号名称 和订单总数量
        let accountNameData1 = []; //账号名称 和点击总数量
        let accountNameData2 = []; //账号名称
        let orderCountourHour1 = []; // 存储时间总量统计 需要的数据
        let orderCountourHour2 = []; // 存储时间点击量统计 需要的数据
        let orderCountourHour3 = []; // 存储时间平均点击率 需要的数据
        this.getOrderCountByHourData.forEach(function(item,index,arr){
          accountNameData.push(item.accountName+'(总计:'+item.orderCount+')')
          accountNameData1.push(item.accountName+'(总计:'+item.clickCount+')')
          accountNameData2.push(item.accountName)
          let person = { accountName:item.accountName+'(总计:'+item.orderCount+')', clickValue:[] } //时间总量统计
          let person2 = { accountName:item.accountName+'(总计:'+item.clickCount+')', clickValue:[] } //时间点击量统计
          let person3 = { accountName:item.accountName, clickValue:[] } //间平均点击率
          item.hourOrderCounts.forEach(function(item,index,arr){
            person.clickValue.push(item.orderCount)  //时间总量统计
            person2.clickValue.push(item.clickCount) //时间点击量统计
            person3.clickValue.push(item.clickRate) //间平均点击率
          })
          orderCountourHour1.push(person)
          orderCountourHour2.push(person2)
          orderCountourHour3.push(person3)
        })
        //时间总量统计
        this.orderCountourHour.accountName = accountNameData
        this.orderCountourHour.hourOrderCounts = orderCountourHour1

        //时间点击量统计
        this.clickCountData.accountName = accountNameData1
        this.clickCountData.hourOrderCounts = orderCountourHour2

        //时间平均点击率
        this.clickRateData.accountName = accountNameData2
        this.clickRateData.hourOrderCounts = orderCountourHour3

        console.log(this.orderCountourHour)
      })
    },
    getgetAccountsFun() { //初始渠道账号数据
      getgetAccounts({
        pageNo:1,
        pageSize:1000
      }).then(response => {
        this.AccountData = response.data
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
