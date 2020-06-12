<template>
  <div class="base_conference">
    <div class="conference_container">
      <h2 v-if="articles.length===0">暂未有文章被录用</h2>
      <el-table
        :data="articles.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item>
                <el-table
                  :data="props.row.writers"
                  class="author_info">
                  <el-table-column
                    label="作者姓名"
                    prop="writerName"
                    width="200"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column
                    label="所在单位"
                    prop="institution"
                    width="200"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column
                    label="所在地区"
                    prop="country"
                    width="200"
                    :show-overflow-tooltip="true">
                  </el-table-column>

                  <el-table-column
                    label="作者邮箱"
                    prop="email"
                    width="250"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                <label>文章摘要</label><br>
                <p style="margin:0;">&emsp;&emsp;{{ props.row.articleAbstract }}</p>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="文章标题"
          prop="title" :show-overflow-tooltip="true" width="400px">
          <template slot="header" slot-scope="scope">
            <div style="display: inline-flex;">
              <label class="label" style="width: 100px">文章标题</label>
              <el-input class="search_input"
                        v-model="search"
                        size="mini"
                        placeholder="输入关键字搜索"
                        style="width: 150px">
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="文件名"
          prop="filename" :show-overflow-tooltip="true" width="400px">
          <template slot="header" slot-scope="scope">
            <div style="display: inline-flex;">
              <label class="label" style="width: 100px">文件名</label>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="审稿状态"
          prop="status" :show-overflow-tooltip="true"
          width="150px">
          <template slot-scope="slot">
            <el-tag :type="getArticleStatus(slot.row.status).type">{{getArticleStatus(slot.row.status).status}}</el-tag>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        :current-page.sync="curPage"
        :page-size="pagesize"
        :pager-count="7"
        :total="articles.length"
        background
        layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        articles: [],
        pagesize: 10,
        curPage: 1,
        search: '',
        words: '',
        row: '', //临时存放发起讨论的文章信息
        showDialog: false, //展示发起讨论输入框
      }
    },
    methods: {
      getArticleStatus(status) {
        let _status = "";
        let type = "";
        switch (status) {
          case 0:
            _status = "未完成审稿";
            type = "warning";
            break;
          case 1:
            _status = "审稿已完成";
            type = "success";
            break;
          case 2:
            _status = "已初次发布";
            type = "success";
            break;
          case 3:
            _status = "已最终发布";
            type = "success";
            break;
          default:
            _status = "未完成审稿";
            type = "warning";
            break;
        }
        return {status: _status, type: type};
      },
      viewPDF(conference_id, title) {
        window.open(
          "http://114.116.112.8:8080/js/pdf/web/viewer.html?file="
          + encodeURIComponent("/preview/" + conference_id + "/" + title));
      },
      enterArticle(row) {
        this.$router.push({
          name: '/CheckPapers',
          params: {
            conference_id: this.$route.params.conference_id,
            articleId: row.articleId,
            title: row.title,
            articleAbstract: row.articleAbstract,
            authors: row.writers,
          }
        }).catch(err => err);
      },
      /* 点击发起讨论按钮后，弹出填写讨论内容的输入框 */
      showDialogInput(row) {
        this.row = row;
        this.showDialog = !this.showDialog;
      },
      /* 发起对某篇文章讨论 */
      startDiscussion(row) {
        console.log(this.$route.params);
        console.log(row);
        console.log('/postOnArticle/' + row.articleId + "/" + this.$store.state.id + "/" + this.words)
        if (this.words.length > 0) {
          this.$axios.post('/postOnArticle/' + row.articleId + "/" + this.$store.state.id + "/" + this.words)
            .then(resp => {
              if (resp.status = 200 && resp.data.hasOwnProperty("token")) {
                this.enterPost(row);
              } else {
                this.$message({
                  showClose: true,
                  message: resp.data.message,
                  type: 'warning'
                });
              }
            });
        } else {
          this.$message({
            showClose: true,
            message: "请填写要发起的讨论内容",
            type: 'warning'
          });
        }
      },
      /* 进入对谋篇文章的的讨论帖 */
      enterPost(row) {
        //console.log("enterPost")
        localStorage.removeItem("messageStore");
        console.log(row);
        this.$router.push({
          name: '/Post',
          params: {
            articleId: row.id,
          }
        }).catch(err => err)
      },
    },
    created() {
      const _this = this;
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("messageStore");
        localStorage.setItem("messageStore", JSON.stringify(this.$route.params))
      });
      localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));

      this.$axios.post('/showAcceptedArticlesForChair', {
        conference_id: this.$route.params.conference_id,
      })
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.articles = resp.data.acceptedArticles;
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
            message: '请求相关记录失败',
            type: 'error'
          });
        });

    },
  }
</script>

<style scoped>
  .conference_container {
    width: 70%;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .topic_section {
    text-align: left;
    font-size: 16px;
    padding-left: 40px;
    margin-bottom: 20px;
  }

  .topic_tag, .author_tag {
    margin-left: 10px;
  }
</style>
