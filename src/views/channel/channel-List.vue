<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.channelName" placeholder="渠道名称" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.channelStatus" placeholder="渠道状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in channelStatusData" :key="item.channelStatus" :label="item.channelStatusName" :value="item.channelStatus" />
      </el-select>
      <!--      <el-select v-model="listQuery.channelType" placeholder="渠道类型" clearable class="filter-item" style="width: 130px">-->
      <!--        <el-option v-for="item in channelTypeData" :key="item.channelType" :label="item.channelTypeName" :value="item.channelType" />-->
      <!--      </el-select>-->
      <el-select v-model="listQuery.platformId" placeholder="平台" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in platformData" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
      </el-select>
      <!--      <el-select v-model="listQuery.userId" placeholder="用户" clearable class="filter-item" style="width: 130px">-->
      <!--        <el-option v-for="item in getUserListData" :key="item.userId" :label="item.username" :value="item.userId" />-->
      <!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
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
      @sort-change="sortChange"
    >
      <el-table-column type="index" width="70" label="序号" align="center" />
      <!--      <el-table-column label="channelId" prop="id" sortable="custom" align="center" width="120">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.channelId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="渠道名称"min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="用户名称"min-width="120px" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type">{{ row.username }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="平台名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号数量" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.channelStatus == 0" type="warning">待审核</el-tag>
          <el-tag v-if="row.channelStatus == 1" type="success">正常</el-tag>
          <el-tag v-if="row.channelStatus == 2" type="danger">审核失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="180px" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini">
            <router-link :to="'/channelAccount/'+row.channelId">
              查看账号
            </router-link>
          </el-button>
          <!--          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">-->
          <!--            删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="渠道名称" prop="channelName">
          <el-input v-model="temp.channelName" />
        </el-form-item>
        <!--        <el-form-item label="用户名称" prop="userId">-->
        <!--          <el-select v-model="temp.userId" placeholder="用户名称" clearable class="filter-item" >-->
        <!--            <el-option v-for="item in getUserListData" :key="item.userId" :label="item.username" :value="item.userId"  />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="平台名称" prop="platformId">
          <el-select v-model="temp.platformId" placeholder="平台名称" clearable class="filter-item">
            <el-option v-for="item in platformData" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道类型" prop="channelStatus">
          <el-radio-group v-model="temp.channelStatus">
            <el-radio :label="0" :value="0">待审核</el-radio>
            <el-radio :label="1" :value="1">审核成功</el-radio>
            <el-radio :label="2" :value="2">审核失败</el-radio>
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
import { getChannelList, PostcreateChannel, PostModifyChannel } from '@/api/channel'
import { getUserList } from '@/api/admin'
import { getPlatformList } from '@/api/platform'
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
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        channelName: undefined,
        channelStatus: undefined,
        platformId: undefined,
        userId: undefined
      },
      importanceOptions: [1, 2, 3],
      channelStatusData: [
        { channelStatus: '0', channelStatusName: '待审核' },
        { channelStatus: '1', channelStatusName: '审核成功' },
        { channelStatus: '2', channelStatusName: '审核失败' }
      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        platformId: undefined,
        channelName: undefined,
        channelStatus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑渠道',
        create: '添加渠道'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        channelName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        channelStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: []
    }
  },
  created() {
    this.listQuery.platformId = this.$route.query.platformId
    this.getList()

    // this.getUserListFun()
    this.getPlatformListFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getChannelList(this.listQuery).then(response => {
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
        platformId: this.$route.query.platformId,
        channelName: undefined,
        channelStatus: undefined

      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          PostcreateChannel(this.temp).then(() => {
            // this.list.unshift(this.temp)
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
          PostModifyChannel(tempData).then(() => {
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
    handleaccount(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // getUserListFun() { // 获取用户列表
    //   getUserList({
    //     pageNo: 1,
    //     pageSize: 10000
    //   }).then(response => {
    //     this.getUserListData = response.data
    //   })
    // },
    getPlatformListFun() { // 获取平台及列表
      getPlatformList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.platformData = response.data
      })
    }
  }
}
</script>
