<template>
  <div>
    <h4 class="mb1">{{ name }}</h4>
    <el-table border :data="documents" size="mini" class="mb2">
      <el-table-column width="100" label="№" align="center" prop="number" />
      <el-table-column
        width="250"
        label="Наименование"
        align="center"
        prop="name"
      />
      <el-table-column label="Файл" align="center">
        <template slot-scope="{ row: { file } }">
          <a
            v-if="file"
            :href="`/uploads/${file}`"
            class="download-url"
            target="_blank"
            >Посмотреть</a
          >
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: '',
    },
  },
}
</script>
