<template>
  <div class="base_conference">
    <div class="conference_container">
      <div>
        <h3 class="title">{{this.$store.state.fullName}},欢迎您的投稿</h3>
        <p class="description">请您填写以下信息</p>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="title" class="item" label="文章标题">
          <el-input v-model="ruleForm.title" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item prop="checkedTopics" class="item" label="文章主题">
          <el-checkbox-group v-model="ruleForm.checkedTopics" style="float: left;">
            <el-checkbox v-for="topic in topics" :label="topic" :key="topic">{{topic}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="articleAbstract" class="item" label="文章摘要">
          <el-input v-model="ruleForm.articleAbstract" placeholder="文章摘要" type="textarea" :rows="8"></el-input>
        </el-form-item>
        <el-table
          :data="ruleForm.authors"
          class="author_info"
        >
          <el-table-column
            label="作者姓名"
            prop="writerName"
            width="150"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="所在单位"
            prop="institution"
            width="150"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="所在地区"
            prop="country"
            width="150"
            :show-overflow-tooltip="true">
          </el-table-column>

          <el-table-column
            label="作者邮箱"
            prop="email"
            width="150"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item prop="authors" class="item">
          <el-button icon="el-icon-circle-plus-outline" circle class="button_add"
                     @click="addAuthorDisplay"></el-button>
          <p class="label_add">作者信息添加&nbsp;&nbsp;&nbsp;&nbsp;(&nbsp;&nbsp;<el-button type="primary" size="small"
                                                                                     icon="el-icon-star-off"
                                                                                     @click="addUserAsAuthor"
                                                                                     circle></el-button>&nbsp;添加自己为作者&nbsp;&nbsp;)
          </p>
          <el-form :model="authorRulesForm" :rules="authorRules" ref="authorRulesForm"
                   v-show="authorAddDisplay" class="author_input">
            <el-form-item prop="writerName">
              <el-input v-model="authorRulesForm.writerName" placeholder="作者姓名" class="input"></el-input>
            </el-form-item>
            <el-form-item prop="institution">
              <el-input v-model="authorRulesForm.institution" placeholder="所属单位" class="input"></el-input>
            </el-form-item>
            <el-form-item prop="country">
              <el-input v-model="authorRulesForm.country" placeholder="所在地区" class="input"></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="authorRulesForm.email" placeholder="作者邮箱" class="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetAuthorSubmitForm" class="button">重置信息</el-button>
              <el-button type="primary" @click="authorSubmitForm('authorRulesForm')" class="button"
                         v-show="authorAddPattern===0">添加作者
              </el-button>
              <el-button type="primary" @click="changeAuthorSubmitForm('authorRulesForm',row)"
                         class="button"
                         v-show="authorAddPattern===1"> &nbsp;修改&nbsp;
              </el-button>
            </el-form-item>
          </el-form>

        </el-form-item>
        <el-form-item label="文件上传" style="text-align: left;">
          <el-upload
            ref="upload"
            style="float:left"
            class="upload-demo"
            action="api/upload"
            :http-request="myUpload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            accept=".pdf"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传pdf文件，只能上传一个文件,文件大小不能超过1M</div>
          </el-upload>
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
  export default {
    name: "SubmitPapers",
    data() {
      let checkTopic = (rule, value, callback) => {
        if (value.length === 0)
          return callback("至少选择一个主题");
        return callback();
      };
      let checkAuthors = (rule, value, callback) => {
        if (value.length === 0)
          return callback("填写至少一位作者");
        return callback();
      };
      let checkEmail = (rule, value, callback) => {
        var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!regEmail.test(value)) {
          return callback(new Error('邮箱格式不正确'))
        }
        return callback()
      };
      return {
        row: 0,
        authorAddPattern: 0,// 0 添加模式，1 修改模式
        authorAddDisplay: false,
        fileValid: true,
        originalTitle: this.$route.params.title === undefined ? JSON.parse(localStorage.getItem("messageStore")).title : this.$route.params.title,
        topics: this.$route.params.topics === undefined ? JSON.parse(localStorage.getItem("messageStore")).topics : this.$route.params.topics,
        ruleForm: {
          title: this.$route.params.title === undefined ? JSON.parse(localStorage.getItem("messageStore")).title : this.$route.params.title,
          articleAbstract: this.$route.params.articleAbstract === undefined ? JSON.parse(localStorage.getItem("messageStore")).articleAbstract : this.$route.params.articleAbstract,
          authors: this.$route.params.writers === undefined ? JSON.parse(localStorage.getItem("messageStore")).writers : this.$route.params.writers,
          checkedTopics: this.$route.params.checkedTopics === undefined ? JSON.parse(localStorage.getItem("messageStore")).checkedTopics : this.$route.params.checkedTopics,
        },
        rules: {
          title: [
            {required: true, message: '请填写文章标题', trigger: 'blur'},
            {min: 1, max: 50, message: '标题不得超过50个字符', trigger: 'blur'}
          ],
          filename: [
            {required: true, message: '请填写文件名', trigger: 'change'},

          ],
          articleAbstract: [
            {required: true, message: '请填写文章摘要', trigger: 'blur'},
            {min: 1, max: 800, message: '文章摘要不得超过800个字符', trigger: 'blur'}
          ],
          checkedTopics: [
            {validator: checkTopic, trigger: "blur"}
          ],
          authors: [
            {validator: checkAuthors, trigger: 'blur'}
          ]
        },
        authorRulesForm: {
          writerName: '',
          institution: '',
          country: '',
          email: '',
        },
        authorRules: {
          writerName: [
            {required: true, message: '作者姓名不能为空', trigger: 'blur'}
          ],
          institution: [
            {required: true, message: "所在单位不能为空", trigger: 'blur'}
          ],
          country: [
            {required: true, message: "所在地区不能为空", trigger: 'blur'}
          ],
          email: [
            {required: true, message: '作者邮箱不能为空', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      //处理作者信息添加功能的函数
      handleDelete(index) {
        if (this.row === index) {
          this.authorAddDisplay = false;
          this.resetAuthorSubmitForm();
        }
        if (index < this.row) {
          this.row--;
        }

        this.ruleForm.authors.splice(index, 1);
      },
      addAuthorDisplay() {
        this.authorAddPattern = 0;
        this.authorAddDisplay = !(this.authorAddDisplay);
      },
      handleEdit(index) {
        this.authorAddPattern = 1;
        this.row = index;
        this.authorRulesForm.writerName = this.ruleForm.authors[index].writerName;
        this.authorRulesForm.institution = this.ruleForm.authors[index].institution;
        this.authorRulesForm.country = this.ruleForm.authors[index].country;
        this.authorRulesForm.email = this.ruleForm.authors[index].email;
        this.authorAddDisplay = true;
      },
      addUserAsAuthor() {
        this.authorAddPattern = 0;
        this.authorAddDisplay = true;
        this.authorRulesForm.writerName = this.$store.state.fullName;
        this.authorRulesForm.institution = this.$store.state.institution;
        this.authorRulesForm.country = this.$store.state.country;
        this.authorRulesForm.email = this.$store.state.email;
      },
      authorSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let author = {};
            author.writerName = this.authorRulesForm.writerName;
            author.institution = this.authorRulesForm.institution;
            author.country = this.authorRulesForm.country;
            author.email = this.authorRulesForm.email;
            if (!this.checkAuthorInAuthors(author)) {
              this.ruleForm.authors.push(author);
            } else {
              this.$message({
                showClose: true,
                message: "该作者已经添加",
                type: "warning",
              });
            }

            this.resetAuthorSubmitForm();
            this.addAuthorDisplay();
          }
        });
      },
      checkAuthorInAuthors(author) {
        if (this.ruleForm.authors.length === 0) {
          return false;
        }
        for (let i = 0; i < this.ruleForm.authors.length; i++) {
          let count = 0;
          for (let [key, value] of Object.entries(this.ruleForm.authors[i])) {
            if (author[key] === value) {
              count++;
            }
          }
          if (count === 4) {
            return true;
          }
        }
        return false;
      },
      changeAuthorSubmitForm(formName, index) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let author = {};
            author.writerName = this.authorRulesForm.writerName;
            author.institution = this.authorRulesForm.institution;
            author.country = this.authorRulesForm.country;
            author.email = this.authorRulesForm.email;
            if (!this.checkAuthorInAuthors(author)) {
              this.$set(this.ruleForm.authors[index], 'writerName', this.authorRulesForm.writerName);
              // this.ruleForm.authors[index].name = this.authorRulesForm.name;
              this.$set(this.ruleForm.authors[index], 'institution', this.authorRulesForm.institution);
              this.$set(this.ruleForm.authors[index], 'country', this.authorRulesForm.country);
              this.$set(this.ruleForm.authors[index], 'email', this.authorRulesForm.email);
            } else {
              this.$message({
                showClose: true,
                message: "该作者已存在，修改失败",
                type: "warning",
              });
            }
            this.resetAuthorSubmitForm();
            this.authorAddDisplay = false;
          }
        });

      },
      //重置author表单的所有信息
      resetAuthorSubmitForm() {
        for (let [key, value] of Object.entries(this.authorRulesForm)) {
          this.authorRulesForm[key] = '';
        }

      },
      handleTopics(topics) {
        let result = "";
        for (let [key, value] of Object.entries(topics)) {
          result += value + " ";
        }
        return result;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //上传前，先把文件COPY一份到ruleForm.file里
      beforeUpload(file) {
        this.ruleForm.file = file;
        const file_size = file.size / 1024 / 1024;
        if (file_size >= 1) {
          this.$message.warning('文件大小不能超过1M');
          this.fileValid = false;
          return false;
        }
        else {
          this.fileValid = true;
        }
      },
      myUpload(content) {
        var formData = new FormData();
        formData.append('file', this.ruleForm.file);
        formData.append('conference_id', this.$route.params.conference_id);
        formData.append("articleId", this.$route.params.articleID);

        this.instance.post('/update', formData).then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
          } else {
            this.$message({
              showClose: true,
              message: resp.data.message,
              type: "warning",
            });
          }
        }).catch(error => {
          this.$message({
            showClose: true,
            message: "上传文件失败",
            type: 'error'
          });
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //虚晃upload一下，submit以后触发beforeUpload
            this.$refs.upload.submit();
            //正常的post
            if (this.fileValid) {
              this.$axios.post('/modifyContribution', {
                originalTitle: this.originalTitle,
                conference_id: this.$route.params.conference_id,
                title: this.ruleForm.title,
                articleAbstract: this.ruleForm.articleAbstract,
                writers: this.ruleForm.authors,
                topics: this.ruleForm.checkedTopics,
              }).then(resp => {
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  this.$message({
                    showClose: true,
                    message: "更新投稿成功",
                    type: "success",
                  });
                  this.goBack();
                } else {
                  this.$message({
                    showClose: true,
                    message: resp.data.message,
                    type: 'warning'
                  });
                }
              }).catch(error => {
                this.$message({
                  showClose: true,
                  message: "上传投稿信息失败",
                  type: 'error'
                });
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: "请按要求填写投稿信息",
              type: 'warning'
            });

          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs.upload.clearFiles();
      },
	  setMessageStore(){
	    localStorage.removeItem("messageStore");
	    localStorage.setItem("messageStore", JSON.stringify(this.$route.params));
	  },
	  goBack(){
	    this.$router.push({
	      name:'/ViewSubmissionRecord',
	      params: JSON.parse(localStorage.getItem('viewSubmissionRecord')),
	    });
	  }
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
      window.removeEventListener('beforeunload',this.setMessageStore);
      window.removeEventListener('popstate', this.goBack);
    }
  }
</script>

<style scoped>
  .meeting_introduction {
    text-align: left;
    margin-left: 35px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .meeting_introduction .content {
    font-size: 15px;
  }

  .meeting_introduction .label {
    color: #99a9bf;
    font-weight: bold;
  }

  .conference_container {
    margin: 10px auto;
    margin-top: -10px;
    width: 70%;
  }

  .button_add {
    float: left;
  }

  .label_add {
    float: left;
    font-weight: bold;
    margin-top: -3px;
    margin-left: 10px
  }

  .author_input {
    margin-top: 40px;
    border: 1px groove rgba(96, 189, 255, 0.71);
    padding: 30px;
    border-radius: 20px;
  }

  .author_input .input {
    margin-top: 20px;
    margin-left: 5%;
    width: 50%;
    float: left;
  }

  .author_input .button {
    margin-top: 30px;
    margin-right: 10px;
    float: right;
  }

  .author_info {
    width: 80%;
    margin-left: 10%;
  }
</style>
