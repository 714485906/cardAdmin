<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.accountId" placeholder="账号名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>

      <el-select v-model="listQuery.costStatus" placeholder="平台状态" clearable class="filter-item" style="width: 130px;margin-left: 10px">
        <el-option v-for="item in platformStatusData" :key="item.costStatus" :label="item.costStatusName" :value="item.costStatus" />
      </el-select>
      <el-date-picker
        v-model="dateTime1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="下单开始日期"
        end-placeholder="下单结束日期"
        format="yyyy-MM-dd"
        value-format=“yyyy-MM-dd”
        style='min-width: 200px'
        @change="dateChange"
      >
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px">
        搜索
      </el-button>
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--        添加-->
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
      <el-table-column label="账号名称"  width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放金额(分)" min-width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-input size="small" type="text" v-model="row.costFee"  placeholder="请输入投放金额" ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="充值系数"  min-width="90px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountRechargeRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  min-width="160px" align="center">
        <template slot-scope="{row}">
          <el-tag type="info" v-if="row.costStatus == 0">待提交</el-tag>
          <el-tag type="success" v-else-if="row.costStatus == 1">已提交</el-tag>
          <el-tag type="danger" v-else-if="row.costStatus == 2">已撤回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="180px" class-name="small-padding fixed-width">
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
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getgetAccounts } from '@/api/channel' // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }
const platformStatusData = [
  { costStatus: '0', costStatusName: '待提交' },
  { costStatus: '1', costStatusName: '已提交' },
  { costStatus: '2', costStatusName: '已撤回' },

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
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        beginCostDate: undefined,
        endCostDate:undefined,
        accountId: undefined,
        costStatus: undefined
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
      dateTime1:[],
      rules: {
        platformName: [{ required: true, message: '请输入平台名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }],
        platformStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        platformType: [{ required: true, message: '请选择平台类型', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: [],
      accountIdData:[]
    }
  },
  created() {
    this.getList();
    this. accountIdDataFun() //初始账号id
  },
methods: {
    getList() {
      this.listLoading = true
      getcostList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
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
    costFeeFun(costFee) {
      return costFee/100
    },
    handleUpdate(row) {
      this.$confirm('请确定提交当前价格吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {

        PostSubmitCost({
          costId:row.costId,
          costFee:row.costFee
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
        });
      });

    },
    rollbackCostFun(row){
      this.$confirm('请确定撤回当前数据吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        getRollbackCost({
          costId:row.costId
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
        });
      });
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
