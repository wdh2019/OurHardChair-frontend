OurHardChair-FrontEnd

## 2020/3/17  21:17 王栋辉著

第一次前端改动包括：

删除HelloWorld.vue，添加了会议申请相关的MeetingApply.vue

template部分，基本修改完成

script部分仍有问题：表单的前端验证尚未填完，$axios.post方法尚未搞懂

css部分没有完成

提示：

需要修改的文件(.vue)在components中找到，建议按照官网教程，下载HBuilderX编辑器。

关于vue框架的文档结构，附上两篇文章参考：

https://www.cnblogs.com/yyh1993/p/5846586.html
https://www.cnblogs.com/yyh1993/p/5847230.html

请尽量不要动三个vue文件之外的文件，尚未搞清其具体用途。

## 2020/3/18 16:01 王栋辉著

1.这一次，修复了之前把helloworld删掉却import helloworld.vue的问题，这是npm run dev失败的主要原因。

2.增加了template界面

3.增加了email验证功能，改动验证消息

4.修正了n多bug

注意：

1、meetingapply页面中的holdingtime中的月下拉菜单有如下问题：$event被认为是undefined，css样式问题。

2、input框的label能否居左的问题无法解决

3、input框宽度问题无法解决，请注意input最里面的框是input.el-input__inline外面有三个div父元素，详见浏览器上。（怀疑是css优先级问题）

4、尚未弄懂prop属性与$axios中相同名字的变量内容的关系

## 2020/3/20 14:01 王栋辉著

修复了密码不能包含用户名

写了注册测试样例