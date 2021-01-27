<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-select v-model="listQuery.accountId" placeholder="账号名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">-->
      <!--        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.productId" placeholder="商品" clearable class="filter-item" style="width: 130px;margin: 5px 5px">-->
      <!--        <el-option v-for="item in productIdData" :key="item.productId" :label="item.productName" :value="item.productId" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.costStatus" placeholder="平台状态" clearable class="filter-item" style="width: 130px;margin:0px 10px">-->
      <!--        <el-option v-for="item in platformStatusData" :key="item.costStatus" :label="item.costStatusName" :value="item.costStatus" />-->
      <!--      </el-select>-->
      <!--      <el-date-picker-->
      <!--        v-model="dateTime1"-->
      <!--        type="datetimerange"-->
      <!--        range-separator="至"-->
      <!--        start-placeholder="下单开始日期"-->
      <!--        end-placeholder="下单结束日期"-->
      <!--        format="yyyy-MM-dd"-->
      <!--        value-format="yyyy-MM-dd"-->
      <!--        style="min-width: 160px"-->
      <!--        @change="dateChange"-->
      <!--      />-->
      <!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">-->
      <!--        搜索-->
      <!--      </el-button>-->
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
      <!--        添加-->
      <!--      </el-button>-->
    </div>
    <!--总数据-->
<!--    <div style="margin-bottom: 15px" />-->
<!--    <el-row :gutter="20" class="row-bg">-->
<!--      <el-col :span="3" class="bg-purple">-->
<!--        <div class="grid-title" align="center">表单数</div>-->
<!--        <div class="grid-content" align="center">{{ getCostCountData.orderNum }}</div>-->
<!--      </el-col>-->
<!--      <el-col :span="3" class="bg-purple-light">-->
<!--        <div class="grid-title" align="center">投放金额(返前)</div>-->
<!--        <div class="grid-content" align="center">{{ getCostCountData.costFee /100 }}</div>-->
<!--      </el-col>-->
<!--      <el-col :span="3" class="bg-purple">-->
<!--        <div class="grid-title" align="center">表单价(返前)</div>-->
<!--        <div class="grid-content" align="center">{{ getCostCountData.costPrice /100 }}</div>-->
<!--      </el-col>-->
<!--      <el-col :span="3" class="bg-purple-light">-->
<!--        <div class="grid-title" align="center">返点</div>-->
<!--        <div class="grid-content" align="center">{{ getCostCountData.accountRechargeRate /100 }}</div>-->
<!--      </el-col>-->
<!--      <el-col :span="3" class="bg-purple">-->
<!--        <div class="grid-title" align="center">投放金额(返后)</div>-->
<!--        <div class="grid-content" align="center">{{ getCostCountData.actualCostFee / 100 }}</div>-->
<!--      </el-col>-->
<!--      <el-col :span="3" class="bg-purple-light">-->
<!--        <div class="grid-title" align="center">表单价(返后)</div>-->
<!--        <div class="grid-content" align="center">{{ getCostCountData.actualCostPrice / 100 }}</div>-->
<!--      </el-col>-->

<!--    </el-row>-->

    <!--明细-->
    <div style="margin-bottom: 15px" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :header-cell-style="{background:'#eee',color:'#000'}"
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
          <span>{{ row.assessMonth }}</span>
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
      <el-table-column label="营销员" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单数" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放金额(返前)" min-width="160px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.costFee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单价(返前)" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.costPrice /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返点" min-width="90px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountRechargeRate /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放金额(返后)" min-width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.actualCostFee /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单价（返后）" min-width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.actualCostPrice /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活数" min-width="90px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.activateNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活率" min-width="90px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.activateRate /100 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="首充数" min-width="90px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首充率" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeRate /100 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="首充大于50(含50)" min-width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.recharge50Num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首充大于50率" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.recharge50Rate /100 }}%</span>
        </template>
      </el-table-column>

      <el-table-column label="首充转化成本" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.recharge50Price /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="160px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <el-button v-if="row.costStatus==1" size="mini" type="danger" @click="rollbackCostFun(row)">
            撤回
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getAssessDetailList } from '@/api/statistics'
import { getProductList } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getgetAccounts } from '@/api/channel' // secondary package based on el-pagination

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
      tableKey0: 0,
      list: null,
      getCostCountData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        beginCostDate: undefined,
        endCostDate: undefined,
        accountId: undefined,
        productId: undefined,
        assessMonth: undefined,
        costStatus: 1,
        userId:undefined
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
      productIdData: [],
      queryResData: []
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
    if (this.$route.query.res) {
      this.queryResData = JSON.parse(this.$route.query.res)
      console.log(this.queryResData)
     // this.listQuery.accountId = this.queryResData.accountId
      this.listQuery.productId = this.queryResData.productId
      this.listQuery.userId = this.queryResData.userId
      this.listQuery.assessMonth = this.queryResData.assessMonth
    }
    this.getList()
   // this.accountIdDataFun() // 初始账号id
   // this.getProductListFun() // 初始商品
  },
  methods: {
    getList() {
      this.listLoading = true
      getAssessDetailList(this.listQuery).then(response => { // 明细
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
      getCostCount(this.listQuery).then(response => { // 总数据
        this.getCostCountData = response.data
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
      this.$router.push({ name: 'applyLiStselection', query: { accountId: row.accountId }})
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
    }
  }
}
</script>
<style scoped>

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-title{
  padding-top: 10px;
}
.grid-content {
  border-radius: 4px;
  min-height: 30px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.grid-title,.grid-content{
  font-size: 14px;
}
</style>
