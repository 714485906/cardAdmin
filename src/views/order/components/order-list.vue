<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateTime1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="下单开始日期"
        end-placeholder="下单结束日期"
        format="yyyy-MM-dd-HH-mm-ss"
        value-format=“yyyy-MM-dd-HH-mm-ss”
        style='min-width: 300px'
      >
      </el-date-picker>
      <el-date-picker
        v-model="dateTime2"
        type="datetimerange"
        range-separator="至"
        start-placeholder="激活开始日期"
        end-placeholder="激活结束日期"
        format="yyyy-MM-dd-HH-mm-ss"
        value-format=“yyyy-MM-dd-HH-mm-ss”
        style='min-width: 300px;margin: 5px 5px'
      >
      </el-date-picker>
      <el-date-picker
        v-model="dateTime3"
        type="datetimerange"
        range-separator="至"
        start-placeholder="充值开始日期"
        end-placeholder="充值结束日期"
        format="yyyy-MM-dd-HH-mm-ss"
        value-format=“yyyy-MM-dd-HH-mm-ss”
        style='min-width: 300px;margin: 5px 5px'
      >
      </el-date-picker>
      <el-select v-model="listQuery.accountId" placeholder="账号名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>
      <el-select v-model="listQuery.logisticsStatus" placeholder="物流状态" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in logisticsStatusData" :key="item.logisticsStatus" :label="item.name" :value="item.logisticsStatus" />
      </el-select>
      <el-select v-model="listQuery.operatorId" placeholder="运营商" clearable class="filter-item" style="width: 130px;margin:5px 5px">
        <el-option v-for="item in operatorIdData" :key="item.operatorId" :label="item.operatorName" :value="item.operatorId" />
      </el-select>
      <el-select v-model="listQuery.orderStatus" placeholder="订单状态" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in orderStatusData" :key="item.orderStatus" :label="item.name" :value="item.orderStatus" />
      </el-select>
      <el-select v-model="listQuery.channelId" placeholder="渠道名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in channelIdData" :key="item.channelId" :label="item.channelName" :value="item.channelId" />
      </el-select>
      <el-select v-model="listQuery.platformId" placeholder="平台" clearable class="filter-item" style="width: 130px;margin:5px 5px">
        <el-option v-for="item in platformIdData" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
      </el-select>
      <el-button v-waves class="filter-item" type=  "primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
    </div>
    <div style="margin-bottom: 15px"></div>
    <el-table
      :key="tableKey"
      ref="deficiencyTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" :reserve-selection="true"  width="45" align="center" fixed="left"></el-table-column>
      <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
<!--      <el-table-column label="orderId" prop="id" sortable="custom" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.orderId }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="系统单号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.systemOrderNo   }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人姓名" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请号码" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.districtName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请号码省份名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyProvinceName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请号码城市名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyCityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="触点名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.touchName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商名" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道账号名" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
        <el-table-column label="平台名称" width="120px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.platformName }}</span>
          </template>
        </el-table-column>
      <el-table-column label="用户名" width="120px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.username }}</span>
            </template>
       </el-table-column>
      <el-table-column label="渠道名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商侧单号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流单号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.logisticsNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流公司" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.logisticsCompany }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流状态" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="info" v-if="row.logisticsStatus == 0">待发货</el-tag>
          <el-tag type="warning" v-if="row.logisticsStatus == 1">已发货</el-tag>
          <el-tag type="success" v-if="row.logisticsStatus == 2">已签收</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发货时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deliveryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.activateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rechargeTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品佣金/(分)" fixed="right" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeFee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="info" v-if="row.orderStatus == 0">待提交</el-tag>
          <el-tag v-if="row.orderStatus == 1">已提交</el-tag>
          <el-tag type="danger" v-if="row.orderStatus == 2">提交失败</el-tag>
          <el-tag type="success" v-if="row.orderStatus == 3">已激活</el-tag>
          <el-tag type="warning" v-if="row.orderStatus == 4">已充值</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getorderList } from '@/api/order'
import { getgetAccounts } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getOperatorList } from '@/api/operator'
import { getChannelList } from '@/api/channel'
import { getPlatformList } from '@/api/platform'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        operatorType: 1,
        beginCreateTime: undefined,
        endCreateTime: undefined,
        beginActivateTime: undefined,
        endActivateTime: undefined,
        beginRechargeTime: undefined,
        endRechargeTime: undefined,
        logisticsStatus:undefined,
        operatorId: undefined,
        channelId: undefined

      },
      importanceOptions: [1, 2, 3],
      operatorData: undefined,
      accountIdData: undefined,
      productStatusData: [
        { key: '1', name: '正常' },
        { key: '0', name: '不可用' }
      ],
      getUserListData: '',
      platformData: '',
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      dateTime1: '',
      dateTime2: '',
      dateTime3: '',
      logisticsStatusData:[
        { logisticsStatus: 0, name: '待发货'},
        { logisticsStatus: 1, name: '已发货'},
        { logisticsStatus: 2, name: '已签收'},
      ],
      orderStatusData: [
        { orderStatus: 0, name: '待提交'},
        { orderStatus: 1, name: '已提交'},
        { orderStatus: 2, name: '提交失败'},
        { orderStatus: 3, name: '已激活'},
        { orderStatus: 4, name: '已充值'},
        { orderStatus: 5, name: '退单'},
        { orderStatus: 6, name: '销户'}
      ],
      operatorIdData: '',
      channelIdData: '',
      platformIdData: ''
    }
  },
  created() {
    if(this.$route.query.tab!= undefined){  //选择当前营业厅
      this.listQuery.operatorType = this.$route.query.tab
    }
    if(this.$route.name == 'orderListErr'){  //监听路由  如果为 orderListErr 进入异常订单
      this.listQuery.orderStatus = 2
    }
    this.getList() //初始数据
    this.accountIdDataFun() //账号名称
    this.getOperatorListDataFun() //获取运营商
    this.getChannelListDataFun() // 获取渠道
    this.getPlatformListDataFun() //获取平台
  },
  methods: {
    getList() {
      this.listLoading = true
      getorderList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleFilter() {
        this.listQuery.beginCreateTime = this.dateTime1[0]
        this.listQuery.endCreateTime = this.dateTime1[1]
      this.listQuery.beginActivateTime = this.dateTime2[0]
      this.listQuery.endActivateTime = this.dateTime2[1]
      this.listQuery.beginRechargeTime = this.dateTime3[0]
      this.listQuery.endRechargeTime = this.dateTime3[1]
      console.log(this.dateTime1[0])
        this.listQuery.pageNo = 1
        this.getList()
    },
    getRowKeys(row) {
      return row.orderId;
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
    },
    accountIdDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.accountIdData = response.data // 获取账号
      })
    },
    getOperatorListDataFun() {
      getOperatorList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.operatorIdData = response.data // 运营商
      })
    },
    getChannelListDataFun() {
      getChannelList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.channelIdData = response.data // 渠道
      })
    },
    getPlatformListDataFun() {
      getPlatformList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.platformIdData = response.data // 获取平台
      })
    }
  }
}
</script>
