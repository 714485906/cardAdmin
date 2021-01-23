<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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
      :header-cell-style="{background:'#eee',color:'#000'}"
      style="width: 100%;"
    >
      <el-table-column type="index" width="70" label="序号" align="center" />
      <!--      <el-table-column label="accountId" prop="id" sortable="custom" align="center" width="120">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.accountId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="渠道账号" min-width="190px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="媒体ID(第三方ID)" min-width="190px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值系数" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeRate /100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值次数" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计充值金额/元" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargeFee / 100 }}</span> <!--row.rechargeFee 后台单位是分 计算一下 统一为元-->
        </template>
      </el-table-column>
      <el-table-column label="累计充值账户币/个" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rechargePoints }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.accountType == 1" type="success">自运营</el-tag>
          <el-tag v-else-if="row.accountType == 2" type="info">代运营</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.accountStatus == 0" type="warning">不可用</el-tag>
          <el-tag v-if="row.accountStatus == 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="170px" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini"@click="rechargeAccount(row)">
            充值信息
          </el-button>
          <!--          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">-->
          <!--            删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog
      v-loading="Loading"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="媒体ID" prop="remark">
          <el-input v-model="temp.remark" placeholder="请输入第三方媒体ID" />
        </el-form-item>
        <el-form-item label="充值系数" prop="rechargeRate" placeholder="请输入小数">
          <el-input v-model="temp.rechargeRate" />
        </el-form-item>
        <el-form-item label="营销员名称" prop="userId">
          <el-select v-model="temp.userId" placeholder="营销员名称" clearable class="filter-item">
            <el-option v-for="item in getUserListData" :key="item.userId" :label="item.username" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型" prop="accountType">
          <el-radio-group v-model="temp.accountType">
            <el-radio :label="1" :value="1">自运营</el-radio>
            <el-radio :label="2" :value="2">代运营</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="StatusShow" label="账号状态" prop="accountStatus">
          <el-radio-group v-model="temp.accountStatus">
            <el-radio :label="0" :value="0">禁用</el-radio>
            <el-radio :label="1" :value="1">正常</el-radio>
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getgetAccounts, PostCreateAccount, PostModifyAccount } from '@/api/channel'
import { getUserList } from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

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
      Loading: false,
      StatusShow: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        channelId: undefined
      },
      importanceOptions: [1, 2, 3],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      showReviewer: false,
      temp: {
        userId: undefined,
        rechargeRate: undefined,
        accountType: undefined,
        accountStatus: undefined,
        remark: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑渠道账号',
        create: '添加渠道账号'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        rechargeRate: [{ required: true, message: '请选择输出充值系数，小数', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的格式', trigger: 'blur' }],
        accountStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        accountType: [{ required: true, message: '请选择账号类型', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: []
    }
  },
  created() {
    this.listQuery.channelId = this.$route.params.channelId
    this.getList()
    this.getUserListFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getgetAccounts(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        channelId: this.listQuery.channelId,
        rechargeRate: undefined,
        accountStatus: undefined,
        remark: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.StatusShow = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.Loading = true
      this.$refs['dataForm'].validate((valid) => {
        this.temp.rechargeRate = this.temp.rechargeRate * 100 // 由于后台要求  系数要转百分之 如 1.3 转成 130
        console.log(this.temp)
        if (valid) {
          PostCreateAccount(this.temp).then(() => {
            this.Loading = false
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
      // row.rechargeRate = row.rechargeRate /100
      // this.temp = Object.assign({}, row) // copy obj
      this.temp = {
        userId: row.userId,
        accountId: row.accountId,
        rechargeRate: row.rechargeRate / 100, // 由于显示需求  要把百分之转成小数 如:130 转成 1.3
        accountType: row.accountType,
        accountStatus: row.accountStatus,
        remark: row.remark
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.StatusShow = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.Loading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.rechargeRate = this.temp.rechargeRate * 100 // 由于后台要求  系数要转百分之 如 1.3 转成 130
          console.log(this.temp)
          PostModifyAccount(this.temp).then(() => {
            this.Loading = false
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
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
    rechargeAccount(row) {
      this.$router.push({ name: 'recharge', query: { res: row.accountId }})
    },
    getUserListFun() { // 获取用户列表
      getUserList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.getUserListData = response.data
      })
    }
  }
}
</script>
