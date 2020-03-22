<template>
  <div id="base_conference">

    <div class="conference_container">
      <!--标题-->
      <h3 class="conference_title">会议申请</h3>
      <!--申请提交表单-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm"
               label-position="left">
        <el-form-item prop="shortname">
          <el-input v-model="ruleForm.shortname" placeholder="会议简称"></el-input>
        </el-form-item>
        <el-form-item prop="fullname">
          <el-input v-model="ruleForm.fullname" placeholder="会议全称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item prop="start_date1">
              <el-date-picker type="date" placeholder="开始日期" v-model="ruleForm.start_date1"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="start_date2">
              <el-time-picker placeholder="开始时间" v-model="ruleForm.start_date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="place">
          <el-input v-model="ruleForm.place" placeholder="举办地点"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item prop="deadline_date1">
              <el-date-picker type="date" placeholder="截止日期" v-model="ruleForm.deadline_date1"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="deadline_date2">
              <el-time-picker placeholder="截止时间" v-model="ruleForm.deadline_date2"
                              style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item prop="release_date1">
              <el-date-picker type="date" placeholder="结果发布日期" v-model="ruleForm.release_date1"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="release_date2">
              <el-time-picker placeholder="结果发布时间" v-model="ruleForm.release_date2"
                              style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('ruleForm')" class="middle_button">立即创建</el-button>
          <el-button type='danger' @click="resetForm('ruleForm')" class="middle_button">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ConferenceApplication',
    data() {
      return {
        ruleForm: {
          shortname: '',
          fullname: '',
          start_date1: '',
          start_date2: '',
          place: '',
          deadline_date1: '',
          deadline_date2: '',
          release_date1: '',
          release_date2: '',
        },
        rules: {
          shortname: [{required: true, message: "会议简称不为空", trigger: 'blur'}],
          fullname: [{required: true, message: '会议全称不为空', trigger: 'blur'}],
          start_date1: [{type:'date',required: true, message: "开始日期不为空", trigger: 'blur'}],
          start_date2: [{type:'date',required: true, message: "开始日期不为空", trigger: 'blur'}],
          place: [{required: true, message: "会议地点不为空", trigger: 'blur'}],
          deadline_date1: [{type:'date',required: true, message: "截止日期不为空", trigger: 'blur'}],
          deadline_date2: [{type:'date',required: true, message: "截止日期不为空", trigger: 'blur'}],
          release_date1: [{type:'date',required: true, message: "公布日期不为空", trigger: 'blur'}],
          release_date2: [{type:'date',required: true, message: "公布日期不为空", trigger: 'blur'}]
        },
        loading: false
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(this.ruleForm.start_date1)
          console.log(this.ruleForm.start_date2)
          if (valid) {
            //this.$axios.post用来向后台请求数据
            this.$axios.post('/ApplyConference', {
                shortname: this.ruleForm.shortname,
                fullname: this.ruleForm.fullname,
                //注意这里举办时间的拼接
                startTime: this.ruleForm.start_date1 + "-" + this.ruleForm.start_date2,
                place: this.ruleForm.place,
                submit_deadline: this.ruleForm.deadline_date1 + "-" + this.ruleForm.deadline_date2,
                release_time: this.ruleForm.release_date1 + "-" + this.ruleForm.release_date2,
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                alert(resp.data);
                //console.log(resp.data);
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  // 跳转到login
                  alert('会议申请成功');
                  this.$router.replace('/ApplyConference')
                } else {
                  alert('会议名重复')
                }
              })
              .catch(error => {
                console.log(error);
                alert('申请失败')
                this.$router.replace('/ApplyConference')
              })
          } else {
            alert('提交有信息错误');
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  }
</script>

<style scoped>

  .userinfo ul {
    padding: 0;
  }

  .userinfo h3 {
    text-align: center;
  }

  #base_conference {
    background: url("../assets/background/checkerboard-cross.png") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 20px auto;
    width: 600px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }

  .conference_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
  }

  .conference_container .item {
    margin-bottom: 20px;
  }

  .conference_container .item .middle_button {
    width: 30%;
    border: none
  }

  .middle_button {
    width: 30%;
    border: none
  }
</style>
