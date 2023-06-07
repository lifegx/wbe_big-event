 $(function() {
     getUserInfo();
     var layer = layui.layer
         // 点击按钮实现退出功能
     $('#btnLogout').on('click', function() {
         //  console.log('ok');
         // 提示用户是否确认退出
         layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
             //do something
             // 清空本地存储中的token
             localStorage.removeItem('token');
             // 重新跳转到登录页面
             location.href = 'login.html';
             // 关闭confirm 询问框
             layer.close(index);

         });
     })
 })

 // 获取用户信息
 function getUserInfo() {
     $.ajax({
         method: 'GET',
         url: '/my/userinfo',
         // 就是请求头配置对象
         //  headers: {
         //      Authorization: localStorage.getItem('token') || '', // 通过浏览器 获取请求头
         //  },
         success: function(res) {
             //  console.log(res);
             if (res.status !== 0) {
                 return layui.layer.msg('获取用户信息失败');
             }
             // 调用 renderAvatar() 渲染头像
             renderAvatar();
         },
         // 不论成功还是失败，最终都会调用 complete回调函数
         //  complete: function(res) {

         //  }
     })
 }

 // 渲染用户的头像
 function renderAvatar(user) {
     // 获取用户的名称
     // 判断后台数据获取过来的属性进行判断是否有名字
     var name = user.nickname || user.username;
     $('#welcome').html('欢迎 &nbsp; &nbsp;' + name);
     // 按需渲染用户的头像
     if (user.user_pic !== null) {
         $('.layui-nav-img').attr('src', user.user_pic).show();
         $('.text-avatar').hide();
     } else {
         $('.layui-nav-img').hide();
         var first = name[0].toUpperCase();
         $('.text-avatar').html(first).show();
     }
 }