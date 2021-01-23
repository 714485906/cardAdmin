<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.platformName" placeholder="请输入平台名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.platformStatus" placeholder="平台状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in platformStatusData" :key="item.key" :label="item.platformStatusName" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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
      style="width: 100%;"
      :header-cell-style="{background:'#eee',color:'#000'}"
      @sort-change="sortChange"
    >
      <el-table-column type="index" width="70" label="序号" align="center" />
      <!--      <el-table-column label="platformId" prop="platformId" sortable="custom" align="center" width="140">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.platformId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="平台名称"min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台类型" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.platformType == 1">信息流</el-tag>
          <el-tag v-else-if="row.platformType == 2" type="warning">搜索</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="渠道数量" width="90px" align="center">
        <template slot-scope="{row}">
          <router-link :to="{path:'channelList/',query:{platformId: row.platformId}}">
            <span class="link-type">{{ row.channelNum }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.platformStatus == 1" type="success">正常</el-tag>
          <el-tag v-else-if="row.platformStatus == 0" type="warning">不可用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
        <el-form-item label="平台名称" prop="platformName">
          <el-input v-model="temp.platformName" />
        </el-form-item>
        <el-form-item label="平台类型" prop="platformType">
          <el-radio-group v-model="temp.platformType">
            <el-radio :label="1" :value="1">信息流</el-radio>
            <el-radio :label="2" :value="2">搜索</el-radio>
            <el-radio :label="3" :value="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="StatusShow" label="平台状态" prop="platformStatus">
          <el-radio-group v-model="temp.platformStatus">
            <el-radio :label="1" :value="1">正常</el-radio>
            <el-radio :label="0" :value="0">禁用</el-radio>
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
import { getPlatformList, PostCreatePlatform, PostModifyPlatform } from '@/api/platform'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }
const platformStatusData = [
  { key: '1', platformStatusName: '可用' },
  { key: '0', platformStatusName: '不可用' }

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
      StatusShow: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        platformName: undefined,
        platformStatus: undefined
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
      rules: {
        platformName: [{ required: true, message: '请输入平台名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }],
        platformStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        platformType: [{ required: true, message: '请选择平台类型', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPlatformList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // getrole() {
    //   getRoleList({
    //     pageNo: 1,
    //     pageSize: 10000
    //   }).then(response => {
    //     this.Rolelist = response.data
    //   })
    // },
    // getGroup() {
    //   getGroupList({
    //     pageNo: 1,
    //     pageSize: 10000
    //   }).then(response => {
    //     this.groupList = response.data
    //   })
    // },
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
        platformName: undefined,
        platformStatus: undefined,
        platformType: undefined
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          PostCreatePlatform(this.temp).then(() => {
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
      this.StatusShow = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          PostModifyPlatform(tempData).then(() => {
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
    }
  }
}
</script>
