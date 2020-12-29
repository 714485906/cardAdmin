<template>
  <el-container>
    <el-aside width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 440px; margin:20px auto" >
        <el-form-item label="落地页名称" prop="landingName">
          <el-input v-model="temp.landingName" />
        </el-form-item>
        <el-form-item label="渠道账号" prop="accountId">
          <el-select v-model="temp.accountId" placeholder="平台名称" clearable class="filter-item" >
            <el-option v-for="item in queryData.accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="productId">
          <el-select v-model="temp.productId" placeholder="请选择商品" clearable class="filter-item" @change="ChangeProduct">
            <el-option v-for="item in queryData.productIdData" :key="item.productId" :label="item.productName" :value="item.productId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="商品模板"  prop="templateId">
          <el-select v-model="temp.templateId" placeholder="请选择商品模板" clearable class="filter-item" @change="ChangeTemplate">
            <el-option v-for="item in queryData.templateIdData" :key="item.templateId" :label="item.templateName" :value="item.templateId" />
          </el-select>
        </el-form-item>
        <el-form-item label="触点码" prop="touchId">
          <el-select v-model="temp.touchId" placeholder="触点码" clearable class="filter-item" >
            <el-option v-for="item in queryData.touchIdData" :key="item.touchId" :label="item.touchName" :value="item.touchId"  />
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item,index) in temp.params" :label="item.paramName" :key="index" >
          <el-input type="textarea" v-model="item.paramValue" />
        </el-form-item>
        <el-form-item label="状态" prop="landingStatus">
          <el-radio-group v-model="temp.landingStatus">
            <el-radio :label="0" :value="0">不可用</el-radio>
            <el-radio :label="1" :value="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="display: block;margin: 0 auto" @click="updateData">
        保存
      </el-button>
    </el-aside>
    <el-main>
      <iframe :src="iframeData.link" name="iframe_a" width="375px" height="600px" frameborder="no"></iframe>
    </el-main>
  </el-container>
</template>
<script>
import { getProductList, getproductTemplateList, PostCreateProduct, PostmodifyProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getGetTouches, getOperatorList } from '@/api/operator'
import { getgetAccounts } from '@/api/channel'
import { getPlatformList } from '@/api/platform'
import { getUserList } from '@/api/admin'
import { PostCreateLanding, PostModifyLanding } from '@/api/landing' // secondary package based on el-pagination

export default {
  name: 'landingEdit',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      temp: {
        landingName: undefined,
        templateId: undefined,
        touchId: undefined,
        accountId: undefined,
        landingStatus: undefined,
        params:[
          {
          paramCode:"JavaScriptH",
          paramName:'第三方代码(长)',
          paramType:1,
          paramValue: ''
        },
          {
            paramCode:"JavaScriptF",
            paramName:'第三方代码(短)',
            paramType:1,
            paramValue: ''
          },
          {
            paramCode: "CompanyInfo",
            paramName: '公司信息',
            paramType:1,
            paramValue: ''
          }
        ]
      },
      dialogVisible: false,
      operatorData: undefined,
      disabledType:true,
      iframeData:{
        link: undefined
      },
      rules: {
        landingName: [{ required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }],
        accountId: [{ required: true, message: '请选择渠道账号', trigger: 'change' }],
        productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
        templateId: [{ required: true, message: '请选择商品模板', trigger: 'change' }],
        touchId: [{ required: true, message: '请选择触点', trigger: 'change' }],
        landingStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      queryData: {
        accountIdData: undefined,
        channelIdData: undefined,
        operatorIdData: undefined,
        platformIdData: undefined,
        productIdData: undefined,
        templateIdData: undefined,
        touchIdData: undefined,
        userIdData: undefined
      },
      queryList:{
        productId: undefined,
        operatorId: undefined
      }
    }
  },
  created() {

    if(this.$route.query.res == 'create'){
      this.queryDataFun()
    }else{
      this.temp = JSON.parse(this.$route.query.res);
      this.queryList.productId = this.temp.productId
      this.queryList.operatorId = this.temp.operatorId
      this.iframeData.link = this.temp.landingUrl
      this.queryDataFun()
      this.getproductTemplateListFun();
      this.getGetTouchesFun();
    }
  },
  methods:{

    ChangeProduct(val){   //通过商品id 查询当前商品对应的模板
      this.queryData.templateIdData = undefined;
      this.queryData.touchIdData = undefined;
      this.temp.templateId = undefined;
      this.temp.templateName = undefined;
      this.temp.touchId = undefined;
      this.queryList.productId = val // 记录当前产品id
      this. getproductTemplateListFun()
    },
    ChangeTemplate(val) {  //通过商品id 查询当前商品对应的触点码
      let obj = {};
      obj = this.queryData.templateIdData.find((item)=>{//遍历list的数据
        return item.templateId === val;//筛选出匹配数据
      });
      this.queryList.operatorId = obj.operatorId // 记录当前产品运营商id
      this.iframeData.link = obj.templateUrl
      this.getGetTouchesFun()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          if(this.$route.query.res == 'create'){ //添加
            PostCreateLanding(this.temp).then(() => {
              // this.list.unshift(this.temp)
              this.$notify({
                title: '成功',
                message: '成功创建',
                type: 'success',
                duration: 2000
              })
             this.$router.push({name:'landinglist'})
            })

          }else{ //编辑修改
            PostModifyLanding(this.temp).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                uration: 2000
              })
           })
            this.$router.push({name:'landinglist'})
          }
        }
      })

    },
    getproductTemplateListFun() {
      getproductTemplateList({
        pageNo: 1,
        pageSize: 10000,
        productId: this.queryList.productId
      }).then(response => {
        this.queryData.templateIdData = response.data // 模板
      })
    },

    getGetTouchesFun(){
      getGetTouches({
        pageNo: 1,
        pageSize: 10000,
        operatorId:this.queryList.operatorId
      }).then(response => {
        this.queryData.touchIdData = response.data // 触点码
      })
    },

    queryDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.accountIdData = response.data // 渠道账号
      })

      getProductList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.queryData.productIdData = response.data // 商品
      })
    }
  }
}
</script>
<style>
    .info_box {
        padding: 30px
    }

    .imgDetail {
        padding: 30px 80px
    }

    .imgStyle {
        display: block;
    }
</style>
