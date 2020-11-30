<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.landingName" placeholder="落地页名称" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.channelId" placeholder="渠道" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in queryData.channelIdData" :key="item.channelId" :label="item.channelName" :value="item.channelId" />
      </el-select>
      <el-select v-model="listQuery.platformId" placeholder="投放平台" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in queryData.platformIdData" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
      </el-select>
      <el-select v-model="listQuery.productId" placeholder="商品" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in queryData.productIdData" :key="item.productId" :label="item.productName" :value="item.productId" />
      </el-select>
      <el-select v-model="listQuery.templateId" placeholder="模板" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in queryData.templateIdData" :key="item.templateId" :label="item.templateName" :value="item.templateId" />
      </el-select>
      <el-select v-model="listQuery.userId" placeholder="用户" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in queryData.userIdData" :key="item.userId" :label="item.username" :value="item.userId" />
      </el-select>
      <el-select v-model="listQuery.landingStatus" placeholder="落地页状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in landingStatusData" :key="item.key" :label="item.name" :value="item.key" />
      </el-select>
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
      <el-table-column label="landingId" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.landingId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="落地页名称" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.landingName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板名称" min-width="180px" align="center">
        <template slot-scope="{row}">
           <span class="link-type">{{ row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="触点名称" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.touchName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道账号名" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="落地页链接" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.landingUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="落地页状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.landingStatus == 1">正常</el-tag>
          <el-tag type="danger" v-if="row.landingStatus == 0">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"  fixed="right" align="center" width="130px" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;" >
        <el-form-item label="落地页名称" prop="landingName">
          <el-input v-model="temp.landingName" />
        </el-form-item>
        <el-form-item label="渠道账号" prop="accountId">
          <el-select v-model="temp.accountId" placeholder="平台名称" clearable class="filter-item" >
            <el-option v-for="item in queryData.accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="触点码" prop="touchId">
          <el-select v-model="temp.touchId" placeholder="平台名称" clearable class="filter-item" >
            <el-option v-for="item in queryData.touchIdData" :key="item.touchId" :label="item.touchName" :value="item.touchId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="商品模板" prop="templateId">
          <el-select v-model="temp.templateId" placeholder="平台名称" clearable class="filter-item" >
            <el-option v-for="item in queryData.templateIdData" :key="item.templateId" :label="item.templateName" :value="item.templateId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="landingStatus">
          <el-radio-group v-model="temp.landingStatus">
            <el-radio :label="0" :value="0">不可用</el-radio>
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
import { getLandingList, PostCreateLanding, PostModifyLanding } from '@/api/landing'
import { getgetAccounts } from '@/api/channel'
import { getPlatformList } from '@/api/platform'
import { getProductList, getproductTemplateList } from '@/api/product'
import { getGetTouches } from '@/api/operator'
import { getUserList } from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
        accountId: undefined,
        landingName: undefined,
        landingStatus: undefined,
        operatorId: undefined,
        platformId: undefined,
        productId: undefined,
        touchId: undefined,
        userId: undefined
      },
      importanceOptions: [1, 2, 3],
      landingStatusData: [
        { key: '0', name: '不可用' },
        { key: '1', name: '正常' }
      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        landingName: undefined,
        templateId: undefined,
        touchId: undefined,
        accountId: undefined,
        landingStatus: undefined
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
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        channelType: [{ required: true, message: '请选择状态', trigger: 'change' }],
        channelStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      downloadLoading: false,
      queryData: {
        accountIdData: undefined,
        channelIdData: undefined,
        operatorIdData: undefined,
        platformIdData: undefined,
        productIdData: undefined,
        templateIdData: undefined,
        touchIdData: undefined,
        userIdData: undefined
      }
    }
  },
  created() {
    this.getList()
    this.queryDataFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLandingList(this.listQuery).then(response => {
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
      this.temp = {}
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
          PostCreateLanding(this.temp).then(() => {
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
          PostModifyLanding(tempData).then(() => {
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
    queryDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.accountIdData = response.data // 渠道账号
      })
      getPlatformList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.platformIdData = response.data // 投放平台
      })
      getProductList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.productIdData = response.data // 商品
      })
      getproductTemplateList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.templateIdData = response.data // 模板
      })
      getGetTouches({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.touchIdData = response.data // 触点码
      })
      getUserList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.userIdData = response.data // 运营商
      })
    }
  }
}
</script>

