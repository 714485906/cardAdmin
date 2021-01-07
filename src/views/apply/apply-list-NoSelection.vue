<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.applyPhone" placeholder="申请号码" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contactName" placeholder="申请人姓名" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contactPhone" placeholder="申请人联系电话" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.applyStatus" placeholder="渠道状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in applyStatusData" :key="item.applyStatus" :label="item.applyStatusName" :value="item.applyStatus" />
      </el-select>
      <el-select v-model="listQuery.productId" placeholder="产品名称" clearable class="filter-item" style="width: 130px " @change="queryproduct">
        <el-option v-for="item in getProductData" :key="item.productId" :label="item.productName" :value="item.productId" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleResetApply(1)">-->
      <!--        二次分配 {{multipleSelection.length}}-->
      <!--      </el-button>-->
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleResetApply(2)">-->
      <!--        手动批量提交 {{multipleSelection.length}}-->
      <!--      </el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleResetApply(3)">
        打包{{ multipleSelection.length }}
      </el-button>

    </div>
    <div style="margin-bottom: 15px" />
    <el-table
      ref="deficiencyTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="45"
        align="center"
        :selectable="checkSelectable"
        fixed="left"
      />
      <el-table-column label="系统唯一标识" align="center" width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.applyNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人姓名" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新号码" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人身份证号" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人联系电话" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份名称" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市名称" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县名称" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.districtName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="申请号码省份名称" width="140px" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type">{{ row.applyProvinceName }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="申请号码城市名称" width="140px" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type">{{ row.applyCityName }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="收件详细地址" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台标识" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道标识" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号标识" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="触点码名称" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.touchName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销组" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销员" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.applyStatus == 0" type="info">待提交</el-tag>
          <el-tag v-else-if="row.applyStatus == 1" type="success">已提交</el-tag>
          <el-tag v-else-if="row.applyStatus == 2" type="danger">提交失败</el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作" fixed="right" align="center" width="120px" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="{row, $index}">-->
      <!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
      <!--            预占号-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="打包名称" prop="packageName">
          <el-input v-model="temp.packageName" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productId">
          <el-select v-model="temp.productId" placeholder="请输入平台名称" clearable class="filter-item" @change="queryproduct">
            <el-option v-for="item in getProductData" :key="item.productId" :label="item.productName" :value="item.productId" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="渠道账号" prop="accountId">-->
        <!--          <el-select v-model="temp.accountId" placeholder="请输入平台名称" clearable class="filter-item" >-->
        <!--            <el-option v-for="item in accountsData" :key="item.accountId" :label="item.accountName" :value="item.accountId"  />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <el-form-item label="触点码" prop="touchId">
          <el-select v-model="temp.touchId" placeholder="请输入触点码" clearable class="filter-item">
            <el-option v-for="item in touchData" :key="item.touchId" :label="item.touchName" :value="item.touchId" />
          </el-select>
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
import { getapplyList, PostResetApply, PostsubmitApply } from '@/api/apply'
import { getProductList } from '@/api/product'
import { getgetAccounts, PostcreateChannel } from '@/api/channel'
import { getGetTouches } from '@/api/operator'
import { PostCreatePackage } from '@/api/package'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'

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
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        templateType: 2, // 1.自动选号，2.手动选号(非选号)
        applyPhone: undefined,
        contactName: undefined,
        contactPhone: undefined,
        productId: undefined,
        applyStatus: undefined
      },
      multipleSelection: [],
      importanceOptions: [1, 2, 3],
      channelStatusData: [
        { channelStatus: '0', channelStatusName: '待审核' },
        { channelStatus: '1', channelStatusName: '审核成功' },
        { channelStatus: '2', channelStatusName: '审核失败' }
      ],
      channelTypeData: [
        { channelType: '1', channelTypeName: '自运营' },
        { channelType: '2', channelTypeName: '代运营' }

      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        productId: '',
        touchId: '',
        accountId: '',
        packageName: '',
        applyIds: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '选择号码',
        create: '打包'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        channelName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        channelType: [{ required: true, message: '请选择状态', trigger: 'change' }],
        channelStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      downloadLoading: false,
      applyStatusData: [
        { applyStatus: 0, applyStatusName: '待提交' },
        { applyStatus: 1, applyStatusName: '已提交' },
        { applyStatus: 2, applyStatusName: '提交失败' }
      ],
      ChangeNumberlistQuery: {
        pageNo: 1,
        pageSize: 10
      },
      ActiveNumber: {
        applyId: undefined,
        applyPhone: undefined
      },
      currentIndex: 0,
      accountsData: '',
      getProductData: '',
      touchData: '',
      queryList: {
        productId: undefined,
        operatorId: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getgetAccountsDataFun()
    this.getProductListDataFun()
    this.getGetTouchesDataFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getapplyList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
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
    checkSelectable(row) {
      // row.isPackaged  true已经打包  false没有打包
      if (row.isPackaged == true) {
        return false // 禁止选中
      } else {
        return true // 允许选中
      }
    },
    queryproduct(val) {
      console.log(val)
      this.temp.productId = val
      let obj = {}
      obj = this.getProductData.find((item) => { // 遍历list的数据
        return item.productId === val // 筛选出匹配数据
      })
      this.queryList.operatorId = obj.operatorId // 记录当前产品运营商id
      this.getGetTouchesDataFun()
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
        userId: undefined
      }
    },
    handleUpdate(row) { // 显示预选号码
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.ChangeNumberlistQuery.pageNo = 1
      this.ActiveNumber.applyId = row.applyId
      this.ChangeNumber() // 获取号码池 号码
    },
    liClick(index, tel) {
      this.currentIndex = index
      this.ActiveNumber.tel = tel
    },
    updateData() {
      // alert('你选中的号码是'+ this.ActiveNumber.tel + '你的applyId是='+this.ActiveNumber.applyId )
      this.dialogFormVisible = false
    },
    handleResetApply(type) { // 1.二次分配  2.手动批量提交
      if (!this.multipleSelection.length) {
        Message({
          message: '请选择订单',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        const excelList = this.copyArr(this.multipleSelection)
        const ids = [] // 获取选中的applyId
        for (const item of excelList) {
          ids.push(item.applyId)
        }
        this.temp.applyIds = ids
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          PostCreatePackage(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '成功创建',
              type: 'success',
              duration: 2000
            })
            this.$refs.deficiencyTable.clearSelection()
          })
        }
      })
    },
    toggleDeficiencySelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.deficiencyTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.deficiencyTable.clearSelection()
      }
    },
    getRowKeys(row) {
      return row.applyId
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val
    },
    handleaccount(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    PostResetApplyFun(ids) { // 二次分配
      this.$confirm('是否确认二次分配操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(ids)
        PostResetApply(ids).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    PostsubmitApplyFun(ids) { // 手动批量提交
      this.$confirm('是否确认手动批量提交操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(ids)
        PostsubmitApply(ids).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    copyArr(arr) {
      return arr.map(e => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    },
    getgetAccountsDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.accountsData = response.data // 获取账号
      })
    },

    getProductListDataFun() {
      getProductList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.getProductData = response.data // 获取产品
      })
    },
    getGetTouchesDataFun() {
      getGetTouches({
        pageNo: 1,
        pageSize: 10000,
        operatorId: this.queryList.operatorId
      }).then(response => {
        this.touchData = response.data // 获取触点码
      })
    }

  }
}
</script>
<style scoped>
.active{
  color: red;;
}
</style>
