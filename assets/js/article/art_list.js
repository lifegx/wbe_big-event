$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    // 通过template来调用
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date);

            var y = dt.getFullYear();
            var m = padZero(dt.getMonth() + 1);
            var d = padZero(dt.getDate());

            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getMinutes());
            var ss = padZero(dt.getSeconds());
            return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义一个查询的参数对象， 将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认请求第一页数据
        pagesize: 2, // 每页显示几条数据 默认每页显示2条
        cate_id: '', //  文章分类的Id
        state: '' // 文章的发布状态
    };
    initTable(); // 别忘了调用
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.jaxa({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render(); // layui 的内置方法  因为是实时的渲染页面所以通过这个方法再次渲染一下layui
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault();
            // 获取表单中选中项的值
            var cate_id = $('[name="cate_id"]').val();
            var state = $('[name="state"]').val();
            // 为查询参数对象q 对应属性赋值
            q.cate_id = cate_id;
            q.state = state;
            // 根据最新的筛选条件重新渲染表格数据
            initTable();
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        // this is a dome
        // console.log(total);
        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的ID
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 默认起始分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 顺序不要变
            limits: ['1', '2', '5', '10'], // 改变每页条数的选择项。
            // 触发 jump 回调的方式有两种
            // 1. 点击页码的时候 会触发 jump 回调
            // 2. 只要调用了laypage.render()方法就会触发jump回调
            jump: function(obj, first) { // 分页发生切换的时候 触发jump回调
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数 赋值到 q 这个查询参数对象的pagesize属性中、
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表 ，并渲染表格
                console.log(obj.limit); //得到每页显示的条数
                // initTable(); // 不能使用否则会进行无限循环
                // 解决方案 
                // 可以通过first的值 来判断是通过那种方式，触发的jump回调
                //  如果这个first 的值为true 证明是方式2触发 否则就是方式1
                if (!first) {
                    initTable();
                }
            }
        })
    }
    // 点击删除
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数, 
        var len = $('.btn-delete').length;
        // 获取到文章的ID
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除成功');
                    // 当数据删除完成后 需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了 则让页码值 -1 之后 
                    // 再重新调用 initTable() 方法
                    if (len === 1) {
                        // 如果len的值等于1。证明删除完毕之后 ，页面上就没有任何数据
                        // 页码值最小必须是等于1 等于1就相当于第一页所以就不用减1了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    initTable();
                }
            })

            layer.close(index);
        });
    })
})