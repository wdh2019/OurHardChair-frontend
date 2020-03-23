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
        <el-form-item prop="place">
          <el-input v-model="ruleForm.place" placeholder="举办地点"></el-input>
        </el-form-item>
        <el-form-item prop="start_date">
          <el-date-picker
            v-model="ruleForm.start_date"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="deadline_date">
          <el-date-picker
            v-model="ruleForm.deadline_date"
            type="datetime"
            placeholder="截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="release_date">
          <el-date-picker
            v-model="ruleForm.release_date"
            type="datetime"
            placeholder="发布时间">
          </el-date-picker>
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
      let checkDeadLine = (rule, value, callback) => {
        if(value<this.ruleForm.start_date){
         return callback(new Error("截止时间不能早于开始时间"))
        }
        return callback();
      };
      let checkSubmitTime=(rule,value,callback)=>{
        if(value<this.ruleForm.deadline_date){
          return callback(new Error("公布时间不能早于截止时间"))
        }
        return callback();
      };
      return {
        ruleForm: {
          shortname: '',
          fullname: '',
          start_date: '',
          place: '',
          deadline_date: '',
          release_date: '',
        },
        rules: {
          shortname: [{required: true, message: "会议简称不为空", trigger: 'blur'}],
          fullname: [{required: true, message: '会议全称不为空', trigger: 'blur'}],
          place: [{required: true, message: "会议地点不为空", trigger: 'blur'}],
          start_date: [{type: 'date', required: true, message: "开始日期不为空", trigger: 'blur'}],
          deadline_date: [
            {type: 'date', required: true, message: "截止日期不为空", trigger: 'blur'},
            {validator:checkDeadLine}
          ],
          release_date: [
            {type: 'date', required: true, message: "公布日期不为空", trigger: 'blur'},
            {validator:checkSubmitTime}
          ],
        },
        loading: false
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(this.ruleForm.start_date > this.ruleForm.deadline_date);
          var startTime = this.formatTime(new Date(this.ruleForm.start_date));
          var endTime = this.formatTime(new Date(this.ruleForm.deadline_date));
          var release_time = this.formatTime(new Date(this.ruleForm.release_date));
          if (valid) {
            //this.$axios.post用来向后台请求数据
            this.$axios.post('/ApplyConference', {
                shortname: this.ruleForm.shortname,
                fullname: this.ruleForm.fullname,
                //注意这里举办时间的拼接
                place: this.ruleForm.place,
                startTime: startTime,
                submit_deadline: endTime,
                release_time: release_time
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
                  alert('申请失败')
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
      },
      formatTime(date) {
        return (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()) + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds()));
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
