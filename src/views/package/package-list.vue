<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.applyPhone" placeholder="申请号码" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contactName" placeholder="申请人姓名" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contactPhone" placeholder="申请人联系电话" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.packageStatus" placeholder="渠道状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in packageStatusData" :key="item.packageStatus" :label="item.packageStatusName" :value="item.packageStatus" />
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
      :row-key="getRowKeys"
      :header-cell-style="{background:'#eee',color:'#000'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="45" align="center" fixed="left" />
      <!--      <el-table-column label="applyId" prop="id" sortable="custom" align="center" width="120">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.applyId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="集合同步名称" width="160px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正常订单" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.successNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常订单" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.failNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投放渠道" min-width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步接口" min-width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.touchName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集合状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.packageStatus == 0" type="info">待提交</el-tag>
          <el-tag v-else-if="row.packageStatus == 1" type="warning">部分提交</el-tag>
          <el-tag v-else-if="row.packageStatus == 2" type="success">全部提交</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="packageInfo(row)">
            打包详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!--    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
    <!--      <el-row>-->
    <!--        <el-col :span="6"-->
    <!--                v-for="(item,index) in preemptPhoneData"-->
    <!--                style="padding: 10px 0;text-align: center"-->
    <!--                :class="{active:currentIndex === index}"-->
    <!--                @click.native="liClick(index,item)"-->
    <!--        >{{item}}</el-col>-->
    <!--      </el-row>-->
    <!--      <el-row>-->
    <!--        <p style="text-align: center" @click="ChangeNumber">换一批</p>-->
    <!--      </el-row>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogFormVisible = false">-->
    <!--          取消-->
    <!--        </el-button>-->
    <!--        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
    <!--          提交-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import { getpackageList } from '@/api/package'
import { getUserList } from '@/api/admin'
import { getPlatformList } from '@/api/platform'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui' // secondary package based on el-pagination

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
        applyPhone: undefined,
        contactName: undefined,
        contactPhone: undefined,
        packageStatus: undefined
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
        userId: undefined,
        platformId: undefined,
        channelName: undefined,
        channelType: undefined,
        channelStatus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '选择号码',
        create: '添加渠道'
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
      packageStatusData: [
        { packageStatus: 0, packageStatusName: '待提交' },
        { packageStatus: 1, packageStatusName: '部分提交' },
        { packageStatus: 2, packageStatusName: '全部提交' }
      ],
      ChangeNumberlistQuery: {
        pageNo: 1,
        pageSize: 10
      },
      ActiveNumber: {
        applyId: undefined,
        applyPhone: undefined
      },
      currentIndex: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getpackageList(this.listQuery).then(response => {
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
      alert('你选中的号码是' + this.ActiveNumber.tel + '你的applyId是=' + this.ActiveNumber.applyId)
      this.dialogFormVisible = false
    },
    // handleResetApply(type) { // 1.二次分配  2.手动批量提交
    //   if (!this.multipleSelection.length) {
    //     Message({
    //       message: '请选择订单',
    //       type: 'error',
    //       duration: 3 * 1000
    //     })
    //   }else{
    //     let excelList = this.copyArr(this.multipleSelection);
    //     let ids = []; // 获取选中的applyId
    //     for (let item of excelList) {
    //       ids.push(item.applyId);
    //     }
    //     if( type == 1 ){
    //       this.PostResetApplyFun(ids) // type为1  执行二次分配
    //     }else if(type == 2){
    //       this.PostsubmitApplyFun(ids) //type为2  执行手动批量提交
    //     }
    //
    //   }
    // },
    packageInfo(row) {
      console.log(row)
      this.$router.push({ name: 'packageSelection', params: { packageId: row.packageId }})
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
    ChangeNumber() { // 请求预选号码池
      alert('模拟请求-' + '请求页数' + this.ChangeNumberlistQuery.pageNo)
      this.ChangeNumberlistQuery.pageNo++
    }

  }
}
</script>
<style scoped>
.active{
  color: red;;
}
</style>
