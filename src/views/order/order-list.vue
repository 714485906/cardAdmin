<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.productCode" placeholder="商品编码" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-input v-model="listQuery.productName" placeholder="商品名称" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-input v-model="listQuery.operatorProductId" placeholder="运营商侧商品" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-select v-model="listQuery.operatorId" placeholder="运营商" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in operatorData" :key="item.operatorId" :label="item.operatorName" :value="item.operatorId" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.productStatus" placeholder="商品状态" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in productStatusData" :key="item.key" :label="item.name" :value="item.key" />-->
<!--      </el-select>-->
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
      <el-table-column label="orderId" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统单号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.systemOrderNo }}</span>
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
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
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
    }
  },
  created() {
    this.getList()
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
    }
  }
}
</script>
