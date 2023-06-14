$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {

            },
            success: function(res) {
                var htmlStr = template('tpl-table', res); // 模板引擎内置对象
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html(), // 拿到内容
            });
        })
        // 通过代理的形式 为form表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            // 验证
            // console.log('ok');
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).setInterval(), // 快速获取表单数据
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败');
                    }
                    initArtCateList(); // 再次获取新的文章类别
                    return layer.msg('添加成功！');
                    // 内置方法根据索引关闭对应的弹出层
                    layer.close(indexAdd);

                }
            })
        })
        // 通过代理的形式为btn-edit 按钮绑定事件
    var indexEdit = unll;
    $('tbody').on('click', '.btn-edit', function() {
            // 弹出一个修改文章信息的层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-edit').html(), // 拿到内容
            });
            var id = $(this).attr('data-id');
            // 发起请求获取对应的分类数据
            $.ajax({
                type: 'GET', // type 和method都可以发起请求
                url: '/my/article/cates' + id,
                success: function(res) {
                    form.val('form-edit', res.data); //  使用编辑模式 可以修改表单中的数据
                    // if (res.status !== 0) {

                    // }
                }
            })
        })
        // 通过代理的形式 为修改分类表单绑定submit事件
    $('body').on('submit', '.form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(), // 快速获取表单内容
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('编辑修改失败');
                    }
                    layer.msg('编辑修改成功');
                    layer.close(indexEdit);
                    initArtCateList(); // 更新列表数据
                }
            })
        })
        // 通过代理的形式 为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            //do something 
            // 如果点击确定 则在数据库中进行删除
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList() // 更新列表
                }
            })

        });
    })
})