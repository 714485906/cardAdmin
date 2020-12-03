<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.accountId" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
    </div>
    <div style="margin-bottom: 15px"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
<!--      <el-table-column label="orderId" prop="id" sortable="custom" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.orderId }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="系统单号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.systemOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.productName }}</span>
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
      <el-table-column label="商品名称" width="120px" align="center">
      <template slot-scope="{row}">
        <span class="link-type">{{ row.productName }}</span>
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
import { getGroupList } from '@/api/admin' // secondary package based on el-pagination
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
        pageSize: 10
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
      value1: ''

    }
  },
  created() {
    this.getList()
    this.accountIdDataFun()
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
      this.listQuery.pageNo = 1
      this.getList()
    },
    accountIdDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.accountIdData = response.data // 获取账号
      })
    }
  }
}
</script>
