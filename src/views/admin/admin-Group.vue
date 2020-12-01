<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.groupName" placeholder="用户组名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.groupStatus" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加营销组
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        导出-->
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
      @sort-change="sortChange"
    >
      <el-table-column label="groupId" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销员" min-width="220px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员数量" width="120px" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/Grouplist/'+row.groupId">
            <span class="link-type">{{ row.userNum }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="用户组类型" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="danger" v-if="row.groupType == 0">未知</el-tag>
          <el-tag type="info" v-if="row.groupType == 1">个人级</el-tag>
          <el-tag type="warning" v-if="row.groupType == 2">公司级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.groupStatus == 1">正常</el-tag>
          <el-tag type="danger" v-if="row.groupStatus == 0">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="营销组名称" prop="groupName">
          <el-input v-model="temp.groupName" />
        </el-form-item>
        <el-form-item label="营销组类型" prop="groupType">
          <el-radio-group v-model="temp.groupType">
            <el-radio :label="1"  @change="tempShow=false">个人级</el-radio>
            <el-radio :label="2" @change="tempShow=true">公司级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName" v-if="tempShow">
          <el-input v-model="temp.contactName" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone" v-if="tempShow">
          <el-input v-model="temp.contactPhone" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName" v-if="tempShow">
          <el-input v-model="temp.companyName" />
        </el-form-item>
        <el-form-item label="公司地址" prop="companyAddress" v-if="tempShow">
          <el-input v-model="temp.companyAddress" />
        </el-form-item>
        <el-form-item label="权限状态" prop="groupStatus">
          <el-radio-group v-model="temp.groupStatus">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
import { getGroupList, PostCreateGroup, getDeleteGroup, PostModifyGroup } from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
        groupName: undefined,
        groupStatus: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        groupName: '',
        groupId: '',
        groupStatus: '',
        groupType: '',
        contactName: '',
        contactPhone: '',
        companyName: '',
        companyAddress: ''

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户组',
        create: '添加营销组'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        groupName: [{ required: true, message: '请输入营销组名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }],
        groupStatus: [{ required: true, message: '请选择用户组状态', trigger: 'blur' }],
        groupType: [{ required: true, message: '请选择用户组类型', trigger: 'blur' }]
      },
      downloadLoading: false,
      data2: [],
      tempShow: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGroupList(this.listQuery).then(response => {
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
        groupName: '',
        groupId: '',
        groupStatus: '',
        groupType: '',
        contactName: '',
        contactPhone: '',
        companyName: '',
        companyAddress: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.tempShow = false // 隐藏公司信息
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.temp)
        if (valid) {
          PostCreateGroup(this.temp).then(() => {
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
      if(row.groupType == 2){
          this.tempShow = true
      }else{
        this.tempShow = false
      }
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
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getDeleteGroup(row.groupId).then(() => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
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
    }
  }
}
</script>
