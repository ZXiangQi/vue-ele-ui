<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini" @click="removeCatById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
      @close="addCatDialogClosed"
    >
      <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCatFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCatList"
            :props="cascaderProps"
            @change="parentCatChanged"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="addCatFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      catelist: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],
      addCatDialogVisible: false,
      addCatForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCatFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCatList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedKeys: [],
      editDialogVisible: false,
      editForm: {}
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      // console.log(res)
      this.total = res.data.total
    },
    // 修改每页的条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatelist()
    },
    // 显示当前页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatelist()
    },
    showAddCatDialog() {
      this.getParentCatList()
      this.addCatDialogVisible = true
    },
    async getParentCatList() {
      // if (this.parentCatList.length !== 0) return
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCatList = res.data
    },
    // 级联选择器选中时
    parentCatChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCatForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCatForm.cat_level = this.selectedKeys.length
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 关闭添加分类对话框时，重置清空表单
    addCatDialogClosed() {
      this.$refs.addCatFormRef.resetFields()
      this.selectedKeys = []
      this.addCatForm.cat_level = 0
      this.addCatForm.cat_pid = 0
    },
    // 添加分类
    addCate() {
      this.$refs.addCatFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCatForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCatelist()
        this.addCatDialogVisible = false
      })
    },
    // 关闭编辑对话框时，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 显示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类名称失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 确定修改分类名称
    editCateInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}`, { cat_name: this.editForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类名称失败')
        }
        this.$message.success('更新分类名称成功')
        this.editDialogVisible = false
        this.getCatelist()
      })
    },
    // 通过分类id删除分类
    async removeCatById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getCatelist()
    }
  }
}
</script>

<style lang='less' scoped>
.el-icon-success {
  color: lightgreen;
}
.el-icon-error {
  color: red;
}
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
