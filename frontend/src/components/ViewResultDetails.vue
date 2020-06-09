<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">评分详情</h3>
        <p class="description">评分具体情况见下面内容</p>
      </div>
      <div class="PCMember" v-for="(temp,index) in $route.params.evaluations" :key="index">
        <h2>PCMember{{index+1}}</h2>
        <p>score:<span>{{temp.score}}</span></p>
        <br>
        <p>confidence:<span v-if="temp.confidence===-2">very low</span><span v-if="temp.confidence===-1">low</span><span
          v-if="temp.confidence===1">high</span><span v-if="temp.confidence===2">very high</span></p>
        <br>
        <p>comment:</p>
        <el-input
          type="textarea"
          readonly
          v-model="$route.params.evaluations[index].comment"
          rows="5"
          show-word-limit
        ></el-input>
      </div>
      {{this.setRebuttal($route.params.evaluations)}}
      {{$route.params}}
      <div v-show="setRebuttal($route.params.evaluations)">
        <el-form :model="ruleForm" :rules="rules" label-position="left" ref="ruleForm">
          <el-form-item label="rebuttal" prop="rebuttal">
            <el-input v-model="ruleForm.rebuttal"
                      type="textarea"
                      :rows="8"
                      placeholder="填写你的rebuttal信息"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ViewResultDetails",
    data() {
      return {
        ruleForm: {
          rebuttal: '',
        },
        rules: {
          rebuttal: [{required: true, message: "rebuttal信息不能为空", trigger: 'blur'}],
        }
      }
    },
    methods: {
      setMessageStore() {
        localStorage.removeItem("messageStore");
        localStorage.setItem("messageStore", JSON.stringify(this.$route.params));
      },
      goBack() {
        this.$router.push({
          name: '/ViewSubmissionRecord',
          params: JSON.parse(localStorage.getItem('viewSubmissionRecord')),
        });
      },
      setRebuttal(evaluations) {
        for (let i = 0; i < evaluations.length; i++) {
          if (evaluations[i].score < 0)
            return true;
        }
        return false;
      },
      ToRebuttal() {
        console.log("rebuttal");
        console.log(this.$route.params);
        let params = {
          authorID: this.$route.params.authorID,
          articleID: this.$route.params.articleID,
          title: this.$route.params.title,
          evaluations: this.$route.params.evaluations
        };
        this.$router.push({
          name: "/Rebuttal",
          params: params,
        })
      },
      submitForm(formName) {
        console.log(this.$route.params.authorID);
        console.log(this.$route.params.articleID);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/submitRebuttal', {
              authorID: this.$route.params.authorID,
              articleID: this.$route.params.articleID,
              words: this.ruleForm.rebuttal,
            })
              .then(resp => {
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  this.$message({
                    showClose: true,
                    message: '欢迎回来' + resp.data.username,
                    type: 'success'
                  });
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
                  message: "错误发生于提交rebuttal信息",
                  type: 'error'
                });
              })
          }
        });
      },
    },
    created() {
      window.addEventListener("beforeunload", this.setMessageStore);
      localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack);
      }
    },
    destroyed() {
      window.removeEventListener('beforeunload', this.setMessageStore);
      window.removeEventListener('popstate', this.goBack);
    }
  }
</script>

<style scoped>
  .conference_container {
    width: 90%;
  }

  .PCMember {
    border: 1px solid black;
    padding: 20px;
    border-radius: 15px;
    margin-top: 10px;

  }

  .PCMember p {
    float: left;
    clear: both;
    font-size: 18px;
  }

  .PCMember p span {
    color: red;
    margin-left: 5px;
  }

</style>
