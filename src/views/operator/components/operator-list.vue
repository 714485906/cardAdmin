<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.operatorName" placeholder="运营商名称" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.operatorStatus" placeholder="渠道状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in operatorStatusData" :key="item.operatorStatus" :label="item.operatorStatusName" :value="item.operatorStatus" />
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
      <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
<!--      <el-table-column label="operatorId" prop="id" sortable="custom" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.operatorId }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="运营商接口名称" min-width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属运营商" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" v-if="row.operatorType == 1">移动</span>
          <span class="link-type" v-if="row.operatorType == 2">联通</span>
          <span class="link-type" v-if="row.operatorType == 3">电信</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商编码" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口类型" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type" v-if="row.apiType == 1">联通集团zop</span>
          <span class="link-type" v-if="row.apiType == 2">长沙联通zop</span>
        </template>
      </el-table-column>
      <el-table-column label="接口模式" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type" v-if="row.apiMode == 1">接口下单</span>
          <span class="link-type" v-if="row.apiMode == 2">线下导单</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="120px" align="center" >
        <template slot-scope="{row}">
          <span class="link-type">{{ row.touchNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag type="warning" v-if="row.operatorStatus == 0">不可用</el-tag>
          <el-tag type="success" v-if="row.operatorStatus == 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" >
            <router-link :to="'/getTouches/'+row.operatorId">
              查看触点码
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="运营商名称" prop="operatorName">
          <el-input v-model="temp.operatorName" />
        </el-form-item>
        <el-form-item label="运营商编码" prop="operatorCode">
          <el-input v-model="temp.operatorCode" />
        </el-form-item>
        <el-form-item label="接口模式" prop="apiMode">
          <el-radio-group v-model="temp.apiMode">
            <el-radio :label="1" :value="1" @change="tempShow = true">接口下单</el-radio>
            <el-radio :label="2" :value="2" @change="tempShow = false;temp.apiType =''">线下导单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接口类型" prop="apiType" v-if="tempShow">
          <el-select v-model="temp.apiType" placeholder="接口类型" clearable class="filter-item" >
            <el-option v-for="item in apiTypeData" :key="item.apiType" :label="item.apiTypeName" :value="item.apiType"  />
          </el-select>
        </el-form-item>
        <el-form-item label="运营商状态" prop="operatorStatus" v-if="StatusShow">
          <el-radio-group v-model="temp.operatorStatus">
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
import { getOperatorList, PostCreateOperator, PostModifyOperator } from '@/api/operator'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination/index' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  props: {
    operatorType: {
      default: '1'
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      StatusShow:false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        operatorType: this.operatorType,
        operatorStatus: undefined,
        operatorName: undefined
      },
      importanceOptions: [1, 2, 3],
      operatorStatusData: [
        { operatorStatus: '0', operatorStatusName: '不可用' },
        { operatorStatus: '1', operatorStatusName: '可用' }

      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        accountId: undefined,
        accountName: undefined,
        accountStatus: undefined,
        apiMode: undefined,
        apiType: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑运营商',
        create: '添加运营商'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        operatorName: [{ required: true, message: '请输入运营商名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }],
        operatorCode: [{ required: true, message: '请输入运营商编码', trigger: 'blur' },
          { min: 3, max: 128, message: '长度在 3 到 128 个字符', trigger: 'blur' }],
        apiMode: [{ required: true, message: '请选择接口模式', trigger: 'change' }],
        apiType: [{ required: true, message: '请选择接口类型', trigger: 'blur' }],
        accountStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      downloadLoading: false,
      apiTypeData: [
        { apiType: 1, apiTypeName: '联通集团zop'},
        { apiType: 2, apiTypeName: '长沙联通zop'}
      ],
      tempShow: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getOperatorList(this.listQuery).then(response => {
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    resetTemp() {
      this.temp = {
        operatorType: this.operatorType
      }
    },
    handleCreate() {
      this.tempShow = false //隐藏接口模式
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
          PostCreateOperator(this.temp).then(() => {
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
      console.log(row)
      if(row.apiMode == 2){
        this.tempShow = false

      }else{
        this.tempShow = true
        this.temp.apiType = row.apiType
      }
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
          PostModifyOperator(tempData).then(() => {
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
