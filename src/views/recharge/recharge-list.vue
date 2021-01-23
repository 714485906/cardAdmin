<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.accountId" placeholder="渠道账号" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in AccountData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增充值明细
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        导出-->
      <!--      </el-button>-->
    </div>
    <div style="margin-bottom: 15px" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      :header-cell-style="{background:'#eee',color:'#000'}"
    >
      <el-table-column type="index" width="70" label="序号" align="center" />
      <!--      <el-table-column label="rechargeId" prop="id" sortable="custom" align="center" width="100">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.rechargeId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="账号名称" width="220px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" width="220px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.accountType == 1" type="success">自运营</el-tag>
          <el-tag v-else-if="row.accountType == 2" type="info">代运营</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="充值金额(元)" width="220px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeFee /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值账户币/个" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargePoints }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值系数" width="220px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeRate /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值类型" width="120px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.rechargeType == 1">直充</el-tag>
          <el-tag v-if="row.rechargeType == 2" type="success">调剂</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="220px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.createUserId }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作" align="center" width="180px" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="{row,$index}">-->
      <!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
      <!--            编辑-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="渠道账号" prop="accountId">
          <el-select v-model="temp.accountId" placeholder="请选择渠道账号" clearable class="filter-item">
            <el-option v-for="item in AccountData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
          </el-select>
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeFee">
          <el-input v-model="temp.rechargeFee" />
        </el-form-item>
        <!--        <el-form-item label="充值账户币" prop="rechargePoints">-->
        <!--          <el-input v-model="temp.rechargePoints" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="充值系数" prop="rechargeRate">-->
        <!--          <el-input v-model="temp.rechargeRate" />-->
        <!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item label="充值类型" prop="rechargeType">
          <el-radio-group v-model="temp.rechargeType">
            <el-radio :label="1">直充</el-radio>
            <el-radio :label="2">调剂</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRechargeList, PostCreateRecharge } from '@/api/recharge'
import { getgetAccounts } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getGroupList } from '@/api/admin' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: '正常' },
  { key: '0', display_name: '禁用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
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
        accountId: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        accountId: '',
        rechargeFee: '',
        rechargeType: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        remark: [{ required: true, message: '请输入备注内容', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }],
        accountId: [{ required: true, message: '请选择渠道账号', trigger: 'blur' }],
        rechargeFee: [
          { required: true, message: '请选择输出充值金额(元)', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的格式', trigger: 'blur' }
        ],
        rechargeType: [{ required: true, message: '请选择充值状态', trigger: 'blur' }]
      },
      downloadLoading: false,
      data2: [],
      AccountData: undefined
    }
  },
  created() {
    if (this.$route.query.res) {
      this.listQuery.accountId = this.$route.query.res
      this.temp.accountId = this.$route.query.res
      //   console.log(this.temp.accountId)
    }
    this.getList()
    this.getgetAccountsFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRechargeList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },

    getGroup() {
      getGroupList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.groupList = response.data
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.accountId = this.$route.query.res
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.temp)
        if (valid) {
          this.temp.rechargeFee = this.temp.rechargeFee * 100 // 后台数据要求 金额为分  需要把元转分
          PostCreateRecharge(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '成功创建',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          PostModifyGroup(tempData).then(() => {
            this.getList() // 重新请求刷新数据
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['ID', '角色名称', '创建时间', '状态']
    //     const filterVal = ['roleId', 'roleName', 'createTime', 'roleStatus']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal) {
    //   return this.list.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getgetAccountsFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.AccountData = response.data // 获取渠道账号
      })
    }
  }
}
</script>
