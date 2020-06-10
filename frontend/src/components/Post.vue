<template>
  <div class="base_conference">
    <div class="posts">
      <el-container class="wrap_container">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :current-page.sync="curPage"
          :page-size="10"
          :pager-count="7"
          :total="post.replyList.length">
        </el-pagination>

        <el-header id="post-header">{{post.articleTitle}}</el-header>

        <!-- 主题帖 -->
        <el-container class="content_container">
          <el-aside>
            <span><i class="el-icon-user-solid"></i>{{post.ownerFullName}}</span>
          </el-aside>
          <el-main>
            <div class="words">{{post.words}}</div>
          </el-main>
        </el-container>
        <!-- 回复帖(回复主题帖) -->
        <el-container class="content_container" v-for="(reply,index) in post.replyList" v-bind:key="index"
                      v-if="reply.replyToFloorNumber === -1">
          <el-aside>
            <span><i class="el-icon-user-solid"></i>{{reply.ownerFullName}}</span>
          </el-aside>
          <el-main>
            <div class="words">{{reply.words}}</div>
            <div class="show_reply_container">
              <el-button type="text" @click="showReply=!showReply" class="show-reply-button">显示回复</el-button>
            </div>
            <!-- 对回复帖的回复 -->
            <div class="comment_container" v-show="showReply">
              <div class="comment" v-for="(comment,index) in post.replyList" v-bind:key="index"
                   v-if="comment.replyToFloorNumber === reply.floorNumber">
                <div class="words"><i class="el-icon-user-solid"></i><span>{{comment.ownerFullName}}:</span>
                  {{comment.words}}
                </div>
                <el-button type="text" class="reply-button" @click="replyTo(comment.ownerFullName)">回复</el-button>
                <el-divider></el-divider>
              </div>
              <el-button @click="replyTo(null)" class="show-reply-input-button">我来说一句</el-button>
              <el-input
                v-model="myComment"
                :rows="4"
                type="textarea"
                placeholder="写下你的评论"
                @blur="checkComment()"></el-input>
              <div style="position:relative"><span class="tip" v-show="showCommentTip">评论内容需包含文字</span></div>
              <el-button
                type="primary" @click="replyPost(reply.floorNumber)" class="submit-reply-button">发表
              </el-button>
            </div>
          </el-main>
        </el-container>

        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :current-page.sync="curPage"
          :page-size="10"
          :pager-count="7"
          :total="post.replyList.length">
        </el-pagination>

      </el-container>
    </div>
    <div class="submit">
      <el-container class="wrap_container">
        <el-header>发表回复</el-header>
        <el-container class="content_container">
          <el-main>
            <el-input
              v-model="myReply"
              :rows="8"
              type="textarea"
              placeholder="开通超级会员发帖0倍经验"
              @blur="checkReply()"></el-input>
            <div style="position:relative"><span class="tip" v-show="showReplyTip">评论内容需包含文字</span></div>
            <el-button type="primary" @click="replyPost(-1,)" class="submit-reply-button">发表</el-button>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        curPage: 1,
        headerTop: 0, //标题距离顶部的距离
        post: '', //主题帖
        showReply: false, //是否显示回复
        showReplyInput: false, //是否显示回复输入框
        showReplyTip: false, //是否显示回复输入框为空的提示
        showCommentTip: false,//是否显示评论输入框为空的提示
        myComment: '', //要发表的评论
        myReply: '', //要发表的回贴
      }
    },
    methods: {
      /* 滚动时固定标题 */
      fixHeader() {
        var scrollTop = document.querySelector(".base_conference").scrollTop;
        var postHeader = document.querySelector('#post-header');
        /* 如果不合适，请改变 scrollTop-[number] 中number的数值 */
        if (scrollTop - 100 >= this.headerTop) {
          postHeader.classList.add("fixed");
        }
        else {
          postHeader.classList.remove("fixed");
        }
      },
      /* 回复帖子 */
      replyPost(floorNumber) {
        let words = floorNumber === -1 ? this.myReply : this.myComment;
        /* 输入非空检验 */
        if (words.length > 0) {
          this.$axios.post('/replyPost', {
            postID: this.post.id,
            ownerID: this.$store.state.id,
            words: words,
            floorNumber: floorNumber,
          })
            .then(resp => {
              if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                _this.post = resp.data.post;
                console.log("请求到的帖子：" + _this.post);
              } else {
                this.$message({
                  showClose: true,
                  message: resp.data.message,
                  type: 'warning'
                });
              }
            });
          window.location.reload();
        }
        /* 回帖为空 */
        else if (floorNumber === -1) {
          this.showReplyTip = true;
        }
        else if (floorNumber !== -1) {
          this.showCommentTip = true;
        }
      },
      /* 显示回复输入框，添加回复xx到正文内容 */
      replyTo(name) {
        this.showReplyInput = !this.showReplyInput;
        if (this.showReplyInput) {
          if (name)
            this.myComment = "回复" + name + " ";
        }
        else {
          this.myComment = "";
        }
      },
      checkReply() {
        if (this.myReply.length > 0) {
          this.showReplyTip = false;
        } else {
          this.showReplyTip = true;
        }
      },
      checkComment() {
        if (this.myComment.length > 0) {
          this.showCommentTip = false;
        } else {
          this.showCommentTip = true;
        }
      },
    },
    created() {
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("messageStore");
        localStorage.setItem("messageStore", JSON.stringify(this.$route.params));
      });
      localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));

      /* 请求单个帖子 */
      console.log(this.$route.params.articleId);
      const _this = this;
      this.$axios.post('/browsePostOnArticle/'+this.$route.params.articleId)
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.post = resp.data.post;
            console.log("请求到的帖子：");
            console.log(_this.post)
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
            message: '错误发生于请求所有帖子',
            type: 'error'
          });
        });
    },
    mounted() {
      /* 添加标题滚动事件 */
      this.headerTop = document.querySelector('#post-header').offsetTop;
      window.addEventListener('scroll', this.fixHeader, true);

    },
    destroyed() {
      window.removeEventListener('scroll', this.fixHeader, true);
    }
  }
</script>

<style scoped>
  .wrap_container {
    position: relative;
    width: 920px;
    margin: 100px auto;
  }

  .wrap_container .el-header {
    width: 920px;
    color: #333;
    text-align: center;
    line-height: 60px;
    background-color: white;
    text-align: left;
  }

  .wrap_container .el-header.fixed {
    position: fixed;
    top: 60px;
    border-top: 2px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
    border-right: 1px solid #E5E5E5;
  }

  .content_container {
    border-left: 1px solid #E5E5E5;
    border-right: 1px solid #E5E5E5;
    border-top: 1px solid #E1E4E6;
    border-bottom: 1px solid #E1E4E6;
    min-height: 100px;
  }

  .content_container .el-aside {
    width: 130px !important;
    background-color: rgba(250, 250, 253, 0.8);
    color: #333;
    text-align: center;
    padding-top: 30px;
  }

  .content_container .el-main {
    color: #333;
    text-align: center;
    padding: 20px;
    min-height: 200px;
  }

  .el-pagination {
    width: 910px;
    background-color: rgba(240, 240, 243, 1);
    padding: 20px 0 20px 10px;
    text-align: left;
  }

  .el-divider {
    float: right;
    clear: both;
  }

  .el-divider--horizontal {
    margin: 8px 0;
    background: 0 0;
    border-top: 1px dashed rgba(200, 200, 200, 1);
  }

  .show-reply-button {
    float: right;
    padding: 0;
    margin: 110px 20px 0px 10px;
  }

  .show-reply-input-button {
    float: right;
    margin: 1px 0 5px 0;
  }

  .reply-button {
    float: right;
    margin: 0;
    padding: 0;
  }

  .submit-reply-button {
    float: right;
    margin: 15px 0 5px 0;
  }

  .words {
    text-align: left;
    word-break: break-all;
    line-height: 150%;
    width: 100%;
  }

  .comment_container {
    margin-top: 100px;
    padding: 40px 20px 90px 20px;
    background-color: rgba(244, 245, 245, 1);
  }

  .comment {
    padding-top: 1em;
  }

  .el-form {
    margin-top: 80px;
  }

  span.tip {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;

  }
</style>
