<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.templateName" placeholder="请输入模板名称" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.productId" placeholder="请选择商品" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in getProductData" :key="item.productId" :label="item.productName" :value="item.productId" />
      </el-select>
      <el-select v-model="listQuery.templateType" placeholder="请选择模板类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in templateTypeData" :key="item.key" :label="item.name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.templateStatus" placeholder="请选择状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in templateStatusData" :key="item.key" :label="item.name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>

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
      <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
<!--      <el-table-column label="模板id" prop="id" sortable="custom" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.templateId }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="模板名称" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板链接" width="150px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.templateUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板类型" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.templateType == 1">自动选号</el-tag>
          <el-tag type="info" v-if="row.templateType == 2">手动选号</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板状态" class-name="status-col" fixed="right" width="120px" align="center">
        <template slot-scope="{row}">
          <el-tag type="warning" v-if="row.templateStatus == 0">不可用</el-tag>
          <el-tag type="success" v-if="row.templateStatus == 1">正常</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index }">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="temp.templateName" />
        </el-form-item>
        <el-form-item label="商品" prop="productId">
          <el-select v-model="temp.productId" placeholder="请选择商品" clearable class="filter-item" >
            <el-option v-for="item in getProductData" :key="item.productId" :label="item.productName" :value="item.productId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="模板链接" prop="templateUrl">
          <el-input v-model="temp.templateUrl" />
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType">
          <el-radio-group v-model="temp.templateType">
            <el-radio :label="1" :value="1">自动选号</el-radio>
            <el-radio :label="2" :value="2">手动选号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板状态" prop="templateStatus" v-if="StatusShow">
          <el-radio-group v-model="temp.templateStatus">
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
import { getproductTemplateList, getProductList, PostModifyProductTemplate, PostCreateProductTemplate } from '@/api/product'
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
      StatusShow:false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        productId: undefined,
        templateName: undefined,
        templateStatus: undefined,
        templateType: undefined
      },
      importanceOptions: [1, 2, 3],
      getProductData: undefined,
      templateStatusData: [
        { key: '1', name: '正常' },
        { key: '0', name: '不可用' }
      ],
      templateTypeData: [
        { key: '1', name: '自动选号' },
        { key: '2', name: '手动选号' }
      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        productId: undefined,
        templateName: undefined,
        templateUrl: undefined,
        templateType: undefined,
        templateStatus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑模板',
        create: '添加模板'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }],
        templateUrl: [{ required: true, message: '请输入链接', trigger: 'blur' },
          { min: 3, max: 256, message: '长度在 3 到 256 个字符', trigger: 'blur' }],
        templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        templateStatus: [{ required: true, message: '请选择模板状态', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: []
    }
  },
  created() {
    this.getList()
    this.getProductListFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getproductTemplateList(this.listQuery).then(response => {
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
          PostCreateProductTemplate(this.temp).then(() => {
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
          PostModifyProductTemplate(tempData).then(() => {
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
    getProductListFun() { // 获取商品列表
      getProductList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.getProductData = response.data
      })
    }
  }
}
</script>
