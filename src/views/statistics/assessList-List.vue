<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.accountId" placeholder="账号名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>
      <el-select v-model="listQuery.productId" placeholder="商品" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in productIdData" :key="item.productId" :label="item.productName" :value="item.productId" />
      </el-select>
      <el-select v-model="listQuery.userId" placeholder="营销员" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userIdData" :key="item.userId" :label="item.username" :value="item.userId" />
      </el-select>
      <!--      <el-select v-model="listQuery.costStatus" placeholder="平台状态" clearable class="filter-item" style="width: 130px;margin:0px 10px">-->
      <!--        <el-option v-for="item in platformStatusData" :key="item.costStatus" :label="item.costStatusName" :value="item.costStatus" />-->
      <!--      </el-select>-->
      <el-date-picker
        v-model="listQuery.assessMonth"
        type="month"
        format="yyyy-MM"
        value-format="yyyy-MM"
        style="min-width: 120px;margin-left: 10px"
        placeholder="请选择月份"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">
        搜索
      </el-button>

    </div>
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
      <el-table-column label="日期" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.assessMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销员" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放渠道数" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.accountNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单数" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放金额(返前)" min-width="160px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.costFee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放金额(返后)" min-width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.actualCostFee /100 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表单价(返前)" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.costPrice /100 }}</span>
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
          <span class="link-type">{{ row.activateRate  }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="首充大于50(含50)" min-width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.recharge50Num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首充大于50率" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.recharge50Rate  }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="首充转化成本" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.recharge50Price /100 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
import { getAssessList, PostSubmitCost, getRollbackCost } from '@/api/statistics'
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
        assessMonth: undefined,
        accountId: undefined,
        productId: undefined,
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
      getAssessList(this.listQuery).then(response => {
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

    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleUpdate(row) {
      this.$router.push({ name: 'assessInfo', query: { res: JSON.stringify(row) }})
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
