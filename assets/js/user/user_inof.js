$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1——6 个字符之间！'
            }
        }
    })
    initUserInfo();
    // 初始化用户的信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户失败！')
                }
                console.log(res);
                // 现在要调用的表单种 添加 lay-filter 属性调用form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 监听表单的提交
    $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            // 发起Ajax数据请求
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(), // this代表当前的表单 serialize 快速拿到表单中的数据
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新用户信息失败！')
                    }
                    layer.msg('更新用户信息成功')
                        // 调用父页面中的方法，重新渲染用户的头像和用户信息
                        // 从
                    window.parent.getUserInfo();
                }
            })
        })
        // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        initUserInfo();
    })
})