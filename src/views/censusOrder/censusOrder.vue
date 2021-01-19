<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-upload
            style="margin:20px"
            ref="uploadExcel"
            action="/order/importOrders"
            :auto-upload="true"
            accept=".xlsx, .xls"
            :before-upload="beforeUploadFile"
            :on-change="fileChange"
            :on-exceed="exceedFile"
            :on-success="handleSuccess"
            :on-error="handleError"
            :data="{
            operatorId:1
          }"
            :headers="token"
          >
            <el-button size="small" plain>导入数据</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传xlsx,xls文件，且不超过10M
            </div>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" style="margin: 15px 20px">
        <div class="grid-content bg-purple-dark">
          <el-radio-group v-model="listQuery.periodType" size="medium" @change="handleChange">
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
            @change="ChangeTime"
          />
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" :gutter="20">
      <el-col :span="6" style="margin-left: 20px">
        <div class="grid-content bg-purple">
          <div class="card-panel-icon-wrapper icon-people" align="center" style="padding-top: 8px">
            <svg-icon icon-class="successOrder" class-name="card-panel-icon" style="font-size: 60px" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text" align="center">
              今日正常订单
            </div>
            <count-to :start-val="0" :end-val="census.totalSuccessCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="card-panel-icon-wrapper icon-people" align="center" style="padding-top: 8px">
            <svg-icon icon-class="failOrder" class-name="card-panel-icon" style="font-size: 60px" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text" align="center" style="color: #F16869">
              今日异常订单
            </div>
            <count-to :start-val="0" :end-val="census.totalFailCount" :duration="2600" class="card-panel-num" style="color:#F16869" />
          </div>
        </div>
      </el-col>
    </el-row>
    <!--产品销量-->
    <el-row :gutter="10">
      <el-col :span="24" style="padding-left: 20px">
        <p style="font-size: 18px">产品销量</p>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="census.productOrderCounts"
          border
          fit
          height="300"
          style="width: 50%;"
        >
          <el-table-column type="index" width="70" label="序号" align="center" />
          <el-table-column label="商品"min-width="120px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.productName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="正常订单" min-width="100px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.productSuccessCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="异常订单" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.productFailCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已发货" width="90px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.productDeliveryCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已激活" min-width="90px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.productActivateCount }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--         <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />-->
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="padding-left: 20px">
        <p style="font-size: 18px">渠道销量</p>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="census.accountOrderCounts"
          border
          fit
          height="300"
          style="width: 70%;"
        >
          <el-table-column type="index" width="70" label="序号" align="center" />
          <el-table-column label="渠道名称"min-width="120px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.accountName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="正常订单" min-width="100px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.accountSuccessCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="异常订单" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.accountFailCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已激活" min-width="90px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.accountActivateCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="首冲量" width="90px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.accountRechargeCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="首冲比率" width="90px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.productDeliveryCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="激活比率" width="90px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.accountRechargeRate }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div style="height: 100px" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <h4>时间/平均点击率</h4>
      <el-radio-group v-model="listQuery2.operatorType" size="medium" @change="handleChange2">
        <el-radio-button :label="1">移动</el-radio-button>
        <el-radio-button :label="2">联通</el-radio-button>
        <el-radio-button :label="3">电信</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="listQuery2.createMonth"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="width: 150px;margin-left: 20px"
        @change="ChangeTime2"
      />
      <line-chart-day :chart-data="getOrderCountByDayData" />
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { transactionList, getOrderCountByDay } from '@/api/remote-search'
import LineChartDay from '@/views/dashboard/admin/components/LineChartDay'
import { getToken } from '@/utils/auth'
export default {
  name: 'CensusOrder',
  components: {
    CountTo,
    LineChartDay
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      census: [],
      total: 0,
      dateTime1: '',
      fileList:[],
      limitNum:'1',
      operatorId:'1',
      dateTimeShow: false,
      token:{
        'Authorization':getToken()
      },
      listQuery: {
        periodType: 6,
        beginCreateDate: undefined,
        endCreateDate: undefined
      },
      listQuery2: {
        createMonth:undefined,
        operatorType: 2
      },
      getOrderCountByDayData: {
        day:[],
        successCount:[],
        failCount:[],
        activateCount:[]
      },
    }
  },
  created() {
    this.fetchData()
    this.getOrderCountByDayFun()
  },
  methods: {
    handleChange(val) {
      console.log(val)
      this.dateType = val

      if (val == 7) {
        this.dateTimeShow = true
      } else {
        this.dateTime1 = ''
        this.listQuery.beginCreateDate = undefined
        this.listQuery.endCreateDate = undefined
        this.dateTimeShow = false
        this.fetchData()
      }
    },
    handleChange2(){
      this.getOrderCountByDayFun()
    },
    ChangeTime(val) {
      console.log(val)
      this.listQuery.beginCreateDate = val[0]
      this.listQuery.endCreateDate = val[1]
      this.fetchData()
    },
    ChangeTime2() {
      this.getOrderCountByDayFun()
    },
    fetchData() {
      this.listLoading = true
      transactionList(this.listQuery).then(response => {
        this.listLoading = false
        this.census = response.data
      })
    },
    getOrderCountByDayFun() {
      getOrderCountByDay(this.listQuery2).then(response => {
        this.getOrderCountByDayData.day = []
        this.getOrderCountByDayData.successCount = []
        this.getOrderCountByDayData.failCount = []
        this.getOrderCountByDayData.activateCount = []
        let that = this
        response.data.forEach(function(item){
          that.getOrderCountByDayData.day.push(item.day+'号')
          that.getOrderCountByDayData.successCount.push(item.successCount)
          that.getOrderCountByDayData.failCount.push(item.failCount)
          that.getOrderCountByDayData.activateCount.push(item.activateCount)
        })
        console.log(this.getOrderCountByDayData)
      })
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      // console.log(file)
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension == 'xlsx' || extension == 'xls') {

      }else{
        this.$notify.warning({
          title: '警告',
          message: `只能上传Excel（即后缀是.xlsx）的文件`
        })
      }
      if (size > 10) {
        this.$notify.warning({
          title: '警告',
          message: `文件大小不得超过10M`
        })
      }
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      // console.log(file)
      // console.log(fileList)
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$notify.warning({
        title: '警告',
        message: `只能选择 ${
          this.limitNum
        } 个文件，当前共选择了 ${files.length + fileList.length} 个`
      })
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log(res)
    //  this.formData.url = res.data  //服务器返回的文件地址
      if(res.code == 200){
        this.$message({
          message: '文件上传成功',
          type: 'success'
        })
        this.$refs.uploadExcel.clearFiles()// 清楚上次上传记录
      }else {
        this.$message({
          message: res.message,
          type: 'warning'
        })
      }

    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error(err.msg)
    }
  }
}
</script>

<style scoped>

.bg-purple {
  background: #fff;
}
bg-purple-dark{
  padding: 10px 10px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.card-panel-text{
  font-size: 14px;
  margin-top: 8px;
}
.card-panel-num {
  margin: 8px 0;
  display: inline-block;
  width: 100%;
  font-size: 20px;
  text-align: center;
}
</style>
