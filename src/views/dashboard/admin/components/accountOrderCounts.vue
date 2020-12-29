<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6"  class="card-panel-col" v-for="(item,index) in accountOrderCounts" :key="index">
      <div class="card-panel" style="height: 200px">
        <p style="font-size: 16px;padding: 5px 10px;font-weight: 700;text-align: center">{{item.accountName}}</p>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <div class="grid-content bg-purple"  align="center">
              <svg-icon icon-class="yidong" style="display:block;font-size:30px;margin-bottom: 10px" />
              <count-to :start-val="0" :end-val="item.accountYdSuccessCount" :duration="3600" class="card-panel-num" style="font-size: 16px;font-weight: 700" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"  align="center">
              <svg-icon icon-class="liantong" style="display:block;font-size:30px;margin-bottom: 10px" />
              <count-to :start-val="0" :end-val="item.accountLtSuccessCount" :duration="3600" class="card-panel-num" style="font-size: 16px;font-weight: 700" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"  align="center">
              <svg-icon icon-class="dianxin" style="display:block;font-size:30px;margin-bottom: 10px" />
              <count-to :start-val="0" :end-val="item.accountDxSuccessCount" :duration="3600" class="card-panel-num" style="font-size: 16px;font-weight: 700" />
            </div>
          </el-col>
        </el-row>
        <el-row  style="margin-top: 10px">
          <el-col :span="12">
            <div class="grid-content bg-purple" align="center" style="font-size: 16px">
              <p>成功单量: <span>{{item.accountSuccessCount}}</span> </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light" align="center" style="font-size: 16px">
              <p>废单量: <span style="color: red">{{item.accountFailCount}}</span> </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props:['accountOrderCounts'],
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
