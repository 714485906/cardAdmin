<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--        添加用户-->
<!--      </el-button>-->
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
    >
      <el-table-column label="userId" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称"min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户组" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营账号数量" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.userType == 1">普通用户</el-tag>
          <el-tag type="warning" v-else-if="row.userType == 2">管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.userStatus == 1">正常</el-tag>
          <el-tag type="danger" v-else-if="row.userStatus == 0">禁用</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" width="130px" fixed="right" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="{row,$index}">-->
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
<!--            编辑-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

<!--    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
<!--      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">-->
<!--        <el-form-item label="用户名称" prop="username">-->
<!--          <el-input v-model="temp.username" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="手机号" prop="phone">-->
<!--          <el-input v-model="temp.phone" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="密码" prop="password" v-if="passShow">-->
<!--          <el-input v-model="temp.password" type="password" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="角色" prop="roleId">-->
<!--          <el-select v-model="temp.roleId" placeholder="角色" clearable class="filter-item" >-->
<!--            <el-option v-for="item in roleData" :key="item.roleId" :label="item.roleName" :value="item.roleId"  />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="用户组" prop="groupId">-->
<!--          <el-select v-model="temp.groupId" placeholder="用户组" clearable class="filter-item" >-->
<!--            <el-option v-for="item in groupData" :key="item.groupId" :label="item.groupName" :value="item.groupId"  />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="权限状态" prop="roleStatus">-->
<!--          <el-radio-group v-model="temp.userStatus">-->
<!--            <el-radio :label="1" :value="1">正常</el-radio>-->
<!--            <el-radio :label="0" :value="0">禁用</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="dialogFormVisible = false">-->
<!--          取消-->
<!--        </el-button>-->
<!--        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
<!--          提交-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

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
import { getUserList, PostCreateUser, PostModifyUser, getRoleList, getGroupList } from '@/api/admin'
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
        groupId: undefined,
        phone: undefined,
        roleId: undefined,
        userStatus: undefined,
        username: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        groupId: undefined,
        roleId: undefined,
        username: undefined,
        phone: undefined,
        password: undefined,
        userStatus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号码' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择用户组', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      passShow: true,
      downloadLoading: false,
      roleData: undefined,
      groupData: undefined
    }
  },
  created() {
    this.listQuery.groupId = this.$route.params.groupId
    this.getList()
    this.roleDataFun()
    this.GroupDataFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.passShow = true // 显示密码框
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
          PostCreateUser(this.temp).then(() => {
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
      this.passShow = false // 取消密码框
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
          PostModifyUser(tempData).then(() => {
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
    roleDataFun() {
      getRoleList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.roleData = response.data // 获取用户
      })
    },
    GroupDataFun() {
      getGroupList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.groupData = response.data // 获取用户组
      })
    }
  }
}
</script>
