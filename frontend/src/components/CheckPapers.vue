<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">正在评审稿件 {{this.$route.params.title}} </h3>
      </div>
      <el-collapse class="article_introduction">
        <el-collapse-item>
          <span slot="title" class="collapse-title">稿件信息</span>
          <div>
            <p class="content"><label class="label">文章标题: </label>{{this.$route.params.title}}</p>
          </div>
          <div>
            <p class="content"><label class="label">作者：</label><el-tag v-for="author in $route.params.authors" :key="author" class="author_tag">{{author}}</el-tag></p>
          </div>
          <div>
            <p class="content"><label class="label">文章摘要: </label>{{this.$route.params.articleAbstract}}</p>
          </div>
          <div>
            <p class="content"><label class="label">文章预览: </label><el-button type="danger" size="small" @click="viewPDF($route.params.conference_id,$route.params.title)">预览</el-button></p>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="score" label="评分">
           <el-radio-group v-model="ruleForm.score">
              <el-radio :label="-2">-2——reject</el-radio>
              <el-radio :label="-1">-1——weak reject</el-radio>
              <el-radio :label="1">1——weak accept</el-radio>
              <el-radio :label="2">2——accept</el-radio>
           </el-radio-group>
        </el-form-item>
        <el-form-item prop="comment" label="评语">
          <el-input v-model="ruleForm.comment" placeholder="评语" type="textarea" :rows="8"></el-input>
        </el-form-item>
        <el-form-item prop="confidence" label="confidence">
           <el-radio-group v-model="ruleForm.confidence">
              <el-radio :label="-2">very low</el-radio>
              <el-radio :label="-1">low</el-radio>
              <el-radio :label="1">high</el-radio>
              <el-radio :label="2">very high</el-radio>
           </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        topics:[1,2,3,4],
        articles:[],
        pagesize: 10,
        curPage: 1,
        search: '',
        ruleForm: {
          score: '',
          comment: '',
          confidence: '',
        },
        rules: {
          score: [
            {required: true, message: '请选择评分', trigger: 'change'},
          ],
          comment: [
            {required: true, message: '请填写评语', trigger: 'blur'},
            {min: 1, max: 800, message: '评语不得超过800个字符', trigger: 'blur'}
          ],
          confidence: [
            {required: true, message: '请选择confidence值', trigger: 'change'},
          ],
        }
      }
    },
    methods:{
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        viewPDF(conference_id,title){
          window.open(
          "http://114.116.112.8:8080/js/pdf/web/viewer.html?file="
           + encodeURIComponent("/preview/"+conference_id+"/"+title));
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$axios.post('/submitReviewResult',{
                  conference_id:this.$route.params.conference_id,
                  userId:this.$store.state.id,
                  articleId:this.$route.params.articleId,
                  score:this.ruleForm.score,
                  comment:this.ruleForm.comment,
                  confidence:this.ruleForm.confidence,
                }).then(resp => {
                    if (resp.status === 200 && resp.data.hasOwnProperty("token")){
                      this.$message({
                        showClose:true,
                        message: resp.data.message,
                        type:"success",
                      });
                      this.$router.push('/AllConferences');
                    }else {
                      this.$message({
                        showClose: true,
                        message: resp.data.message,
                        type:'warning'
                      });
                    }
                }).catch(error => {
                    this.$message({
                      showClose: true,
                      message: "评审信息发送失败",
                      type:'error'
                    });
                  })
            } else {
              this.$message({
                showClose: true,
                message: "请按要求填写评审信息",
                type:'warning'
              });
            }
          });
        },
    },
    created() {
    	window.addEventListener("beforeunload",() => {
        localStorage.removeItem("messageStore");
        localStorage.setItem("messageStore", JSON.stringify(this.$route.params));
      });
      localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));
    },
  }
</script>

<style scoped>
  .demo-ruleForm{
    text-align: left;
  }
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }

  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }

  .article_introduction {

    text-align: left;
    margin-left: 35px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .article_introduction .content {
    font-size: 15px;
  }

  .article_introduction .label {
    color: #99a9bf;
    font-weight: bold;
  }
  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 70%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }

  .title {
    margin: 20px auto;
    padding-left: 20px;
    text-align: left;
    color: #494e8f;
    font-size: 24px;
    font-weight: normal;
  }

  p.description {
    text-align: left;
    padding-top: 10px;
    padding-left: 20px;
    color: #999;
    line-height: 1.4285;
    font-size: 14px;
  }

  .label {
    float: left;
  }

  .topic_tag,.author_tag{
    margin-left:10px;
  }

</style>
