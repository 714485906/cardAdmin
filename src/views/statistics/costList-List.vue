<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.accountId" placeholder="渠道账号名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>
      <el-select v-model="listQuery.productId" placeholder="商品名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in productIdData" :key="item.productId" :label="item.productName" :value="item.productId" />
      </el-select>
      <el-select v-model="listQuery.userId" placeholder="营销员" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userIdData" :key="item.userId" :label="item.username" :value="item.userId" />
      </el-select>
      <!--      <el-select v-model="listQuery.costStatus" placeholder="平台状态" clearable class="filter-item" style="width: 130px;margin:0px 10px">-->
      <!--        <el-option v-for="item in platformStatusData" :key="item.costStatus" :label="item.costStatusName" :value="item.costStatus" />-->
      <!--      </el-select>-->
      <el-date-picker
        v-model="dateTime1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="下单开始日期"
        end-placeholder="下单结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="min-width: 160px;margin-left: 10px"
        @change="dateChange"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">
        搜索
      </el-button>
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
      <!--        添加-->
      <!--      </el-button>-->
    </div>
    <div style="margin-bottom: 15px" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :header-cell-style="{background:'#eee',color:'#000'}"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="index" width="70" label="序号" align="center" />
      <!--      <el-table-column label="platformId" prop="platformId" sortable="custom" align="center" width="140">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.platformId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column label="日期" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.costDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名称" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="媒体ID(第三方)" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.accountRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销员" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放金额(元)" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-input v-model="row.costFee" size="small" type="text" placeholder="请输入投放金额" />
        </template>
      </el-table-column>
      <el-table-column label="充值系数" width="90px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountRechargeRate /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            提交
          </el-button>
          <el-button v-if="row.costStatus==1" size="mini" type="danger" @click="rollbackCostFun(row)">
            撤回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getcostList, PostSubmitCost, getRollbackCost } from '@/api/statistics'
import { getProductList } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getgetAccounts } from '@/api/channel'
import { getUserList } from '@/api/admin' // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }
const platformStatusData = [
  { costStatus: '0', costStatusName: '待提交' },
  { costStatus: '1', costStatusName: '已提交' },
  { costStatus: '2', costStatusName: '已撤回' }

]

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
      userIdData: undefined,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        beginCostDate: undefined,
        endCostDate: undefined,
        accountId: undefined,
        productId: undefined,
        userId:undefined,
        costStatus: [0, 2].toString()
      },
      importanceOptions: [1, 2, 3],
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        platformName: undefined,
        platformType: undefined,
        platformStatus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      platformStatusData,
      textMap: {
        update: '编辑投放平台',
        create: '添加投放平台'
      },
      dialogPvVisible: false,
      pvData: [],
      dateTime1: [],
      rules: {
        platformName: [{ required: true, message: '请输入平台名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }],
        platformStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        platformType: [{ required: true, message: '请选择平台类型', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: [],
      accountIdData: [],
      productIdData: []
    }
  },
  computed: {
    mydata: {
      get(val, aaa) {
        console.log(val)
      },
      set(val) {
        console.log(val)
      }
    }
  },
  created() {
    this.getList()
    this.accountIdDataFun() // 初始账号id
    this.getProductListFun() // 初始商品
    this.getUserListFun() //用户
  },
  methods: {
    getList() {
      this.listLoading = true
      getcostList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
        if (this.total != 0) { // 有数据执行 没有数据不执行
          this.list.forEach(function(val) { // 初始数据时 把投放金额单位 从分转成 元
            val.costFee = val.costFee / 100
          })
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    dateChange() {

    },
    handleFilter() {
      console.log(this.dateTime1.toString())
      this.listQuery.beginCostDate = this.dateTime1[0]
      this.listQuery.endCostDate = this.dateTime1[1]
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleUpdate(row) {
      this.$confirm('请确定提交当前价格吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        PostSubmitCost({
          costId: row.costId,
          costFee: row.costFee * 100 // 后台单位为分  需要把元转成分
        }).then(response => {
          this.getList()
          this.$message({
            message: '操作Success',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    rollbackCostFun(row) {
      this.$confirm('请确定撤回当前数据吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        getRollbackCost({
          costId: row.costId
        }).then(response => {
          this.getList()
          this.$message({
            message: '操作Success',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    accountIdDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.accountIdData = response.data // 获取账号
      })
    },
    getProductListFun() {
      getProductList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.productIdData = response.data // 获取账号
      })
    },
    getUserListFun(){
      getUserList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.userIdData = response.data // 用户
      })
    }
  }
}
</script>
