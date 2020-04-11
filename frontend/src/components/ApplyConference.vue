<template>
  <div id="base_conference">

    <div class="conference_container">
      <!--标题-->
      <h3 class="conference_title">会议申请</h3>
      <!--申请提交表单-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm"
               label-position="left">
        <el-form-item prop="short_name" class="item">
          <el-input v-model="ruleForm.short_name" placeholder="会议简称"></el-input>
        </el-form-item>
        <el-form-item prop="full_name" class="item">
          <el-input v-model="ruleForm.full_name" placeholder="会议全称"></el-input>
        </el-form-item>
        <el-form-item prop="place" class="item">
          <el-input v-model="ruleForm.place" placeholder="举办地点"></el-input>
        </el-form-item>
        <el-form-item prop="start_date" class="item">
          <el-date-picker
            v-model="ruleForm.start_date"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="deadline_date" class="item">
          <el-date-picker
            v-model="ruleForm.deadline_date"
            type="datetime"
            placeholder="截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="release_date" class="item">
          <el-date-picker
            v-model="ruleForm.release_date"
            type="datetime"
            placeholder="发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="item">
          <el-button type="primary" @click="submitForm('ruleForm')" class="middle_button">立即创建</el-button>
          <el-button type='info' @click="resetForm('ruleForm')" class="middle_button">重置</el-button>
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
        if (value < this.ruleForm.start_date) {
          return callback(new Error("截止时间不能早于开始时间"))
        }
        return callback();
      };
      let checkSubmitTime = (rule, value, callback) => {
        if (value < this.ruleForm.deadline_date) {
          return callback(new Error("公布时间不能早于截止时间"))
        }
        return callback();
      };
      return {
        ruleForm: {
          short_name: '',
          full_name: '',
          start_date: '',
          place: '',
          deadline_date: '',
          release_date: '',
        },
        rules: {
          short_name: [{required: true, message: "会议简称不为空", trigger: 'blur'}],
          full_name: [{required: true, message: '会议全称不为空', trigger: 'blur'}],
          place: [{required: true, message: "会议地点不为空", trigger: 'blur'}],
          start_date: [{type: 'date', required: true, message: "开始日期不为空", trigger: 'blur'}],
          deadline_date: [
            {type: 'date', required: true, message: "截止日期不为空", trigger: 'blur'},
            {validator: checkDeadLine}
          ],
          release_date: [
            {type: 'date', required: true, message: "公布日期不为空", trigger: 'blur'},
            {validator: checkSubmitTime}
          ],
        },
        loading: false
      }
    },

    methods: {
      fix(num, length) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          var startTime = this.formatTime(new Date(this.ruleForm.start_date));
          var endTime = this.formatTime(new Date(this.ruleForm.deadline_date));
          var release_time = this.formatTime(new Date(this.ruleForm.release_date));
          if (valid) {
            //this.$axios.post用来向后台请求数据
            this.$axios.post('/ApplyConference', {
                abbreviation: this.ruleForm.short_name,
                fullName: this.ruleForm.full_name,
                //注意这里举办时间的拼接
                holdingPlace: this.ruleForm.place,
                holdingTime: startTime,
                submissionDeadline: endTime,
                reviewReleaseDate: release_time
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                //console.log(resp.data)
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  this.$message({
                    showClose: true,
                    message: '会议申请成功',
                    type: "success"
                  });
                  this.$router.push('/ConferenceForChair').catch(err => err)
                } else {
                  this.$message({
                    showClose: true,
                    message: resp.data.message,
                    type: 'warning'
                  });
                }
              })
              .catch(error => {
                console.log(error);
                this.$message({
                  showClose: true,
                  message: '申请失败',
                  type: 'warning'
                });
              })
          } else {
            this.$message({
              showClose: true,
              message: '请按要求填写会议内容',
              type: 'warning'
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      formatTime(date) {
        let final = (date.getFullYear() + "-" + this.fix(date.getMonth() + 1, 2) + "-" + this.fix(date.getDate(), 2) + " " + this.fix(date.getHours(), 2) + ":" + this.fix(date.getMinutes(), 2) + ":" + this.fix(date.getSeconds(), 2));
        console.log(final);
        return final;
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
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 20px auto;
    width: 480px;
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

  .conference_container . {
    margin-bottom: 20px;
  }

  .conference_container .item .middle_button {
    width: 30%;
    border: none;
    margin-top: 40px;
  }

  .middle_button {
    width: 30%;
    border: none
  }
</style>
