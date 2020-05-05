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
            placeholder="举办日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="deadline_date" class="item">
          <el-date-picker
            v-model="ruleForm.deadline_date"
            type="datetime"
            placeholder="截稿日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="release_date" class="item">
          <el-date-picker
            v-model="ruleForm.release_date"
            type="datetime"
            placeholder="成绩发布日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="topics" class="item">
          <el-tag closable v-for="topic in ruleForm.topics" :key="topic" :type="topic_type[parseTopic(topic)]"
                  effect="light" class="topic_tag" @close="handleClose(topic)">{{topic}}
          </el-tag>

          <el-input v-model="topic_input_value" class="topic_input" placeholder="添加主题"
                    ref="topic_input" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" prefix-icon="el-icon-circle-plus-outline"></el-input>
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
        if (value < this.current_date) {
          return callback(new Error("截稿时间不能早于此刻"))
        }
        return callback();
      };
      let checkSubmitTime = (rule, value, callback) => {
        if (value < this.ruleForm.deadline_date) {
          return callback(new Error("成绩公布时间不能早于截稿时间"))
        }
        return callback();
      };
      let checkStartTime = (rule,value,callback) => {
        if (value < this.ruleForm.start_date) {
          return callback(new Error("会议举办时间不能早于成绩公布时间"))
        }
        return callback();
      }
      return {
        topic_input_value:'',
        topic_type:["success","primary","info","warning","danger"],
        current_date:new Date(),
        ruleForm: {
          short_name: '',
          full_name: '',
          start_date: '',
          place: '',
          deadline_date: '',
          release_date: '',
          topics: [],
        },
        rules: {
          short_name: [{required: true, message: "会议简称不为空", trigger: 'blur'}],
          full_name: [{required: true, message: '会议全称不为空', trigger: 'blur'}],
          place: [{required: true, message: "会议地点不为空", trigger: 'blur'}],
          start_date: [
            {type: 'date', required: true, message: "开始日期不为空", trigger: 'blur'},
            {validator: checkStartTime}
            ],
          deadline_date: [
            {type: 'date', required: true, message: "截止日期不为空", trigger: 'blur'},
            {validator: checkDeadLine}
          ],
          release_date: [
            {type: 'date', required: true, message: "公布日期不为空", trigger: 'blur'},
            {validator: checkSubmitTime}
          ],
          topics: [{required: true, message: "主题不为空", trigger: 'blur'}],
        },
        loading: false
      }
    },

    methods: {
      //分析topic，决定tag颜色
      parseTopic(topic) {
        let sum = 0;
        for (let i = 0; i < topic.length; i++) {
          sum += topic.charCodeAt(i);
        }
        return sum % 5;
      },
      //删除topic
      handleClose(topic) {
        this.ruleForm.topics.splice(this.ruleForm.topics.indexOf(topic), 1);
      },

      //从输入框填入topic
      handleInputConfirm() {
        let inputValue = this.topic_input_value;
        if (inputValue && this.ruleForm.topics.indexOf(inputValue) == -1) {
          this.ruleForm.topics.push(inputValue);
        }
        this.topic_input_value = '';
      },

      fix(num, length) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          var startTime = this.formatTime(new Date(this.ruleForm.start_date));
          var endTime = this.formatTime(new Date(this.ruleForm.deadline_date));
          var release_time = this.formatTime(new Date(this.ruleForm.release_date));
          if (valid) {
            //this.$axios.post用来向后台发送数据
            this.$axios.post('/ApplyConference', {
                abbreviation: this.ruleForm.short_name,
                fullName: this.ruleForm.full_name,
                holdingPlace: this.ruleForm.place,
                holdingTime: startTime,
                submissionDeadline: endTime,
                reviewReleaseDate: release_time,
                topics: this.ruleForm.topics,
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
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
                this.$message({
                  showClose: true,
                  message: '申请失败',
                  type: 'error'
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

  .topic_tag {
    margin-right: 10px;
    float: left;
  }

  .topic_input {
    margin-top: 10px;
  }
</style>
