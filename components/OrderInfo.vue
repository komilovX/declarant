<template>
  <ul class="order-detail">
    <li>
      <span class="name">Дата:</span>
      <span class="value">{{ order.date }}</span>
    </li>
    <li>
      <span class="name">Дата прибытие:</span>
      <span class="value">{{ order.date_income }}</span>
    </li>
    <li>
      <span class="name">Клиент фирма:</span>
      <span class="value">{{ order.client_company }}</span>
    </li>
    <li>
      <span class="name">Клиент:</span>
      <span class="value">{{ order.client }}</span>
    </li>
    <li>
      <span class="name">Исполнитель:</span>
      <span class="value">{{ order.declarant }}</span>
    </li>
    <li>
      <span class="name">Название товара:</span>
      <span class="value">{{ order.product }}</span>
    </li>
    <li>
      <span class="name">Пост номер:</span>
      <span class="value">{{ order.post_number }}</span>
    </li>
    <li>
      <span class="name">Статус:&nbsp;</span>
      <span class="value">
        <el-progress
          style="display: inline-block; min-width: 60%;"
          :percentage="+Number(+order.percent).toFixed(1)"
        />
      </span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style lang="scss" scoped>
.order-detail {
  padding: 1rem;
  max-width: 50%;
  overflow: hidden;
  list-style-type: none;
  & > li:not(:last-child) {
    border-bottom: 1px solid #eee;
    padding: 4px;
  }
}
</style>
