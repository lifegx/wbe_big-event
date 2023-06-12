 $(function() {
     var form = layui.form;
     form.verify({ // layui内置对象 自定义校验规则
         pwd: [
             /^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'
         ],
         samePwd: function(value) {
             if (value === $('[name=oldPwd]').val()) {
                 return '新旧密码不能相同';
             }
         },
         rePwd: function(value) {
             if (value !== $('[name=newPwd]').val()) {
                 return '新密码和确认密码输入必须相同'
             }
         }
     });
     $('.layui-form').on('submit', function(e) {
         e.preventDefault();
         $.ajax({
             method: 'POST',
             url: '/my/updatepwd',
             data: $(this).serialize(), // this 指的是表单 serialize()快速获取表单内容
             success: function(res) {
                 if (res.status !== 0) {
                     return layui.layer.smg('修改失败');
                 }
                 layui.layer.smg('修改修改成功');
                 // 重置表单
                 //  $('.layui-form')[0].reset(); // 把jQuery元素转换为原生DOM元素 在重置表单
                 $('#cz').click();
             }
         })
     })

 })