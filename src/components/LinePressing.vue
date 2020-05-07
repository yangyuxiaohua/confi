<template>
    <div class="linePressWrapper">
        <!-- 盒子压线 -->
        <div class="linePressTit">
            <slot name="line"></slot>
        </div>
        <slot name='container'></slot>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.linePressWrapper {
    margin-top: 20px;
  padding: 25px;
  border: 1px solid #e7e7e7;
  position: relative;
  .linePressTit {
      font-size: 20px;
      padding: 5px 10px;
      position: absolute;
      top: -16px;
      left: 20px;
      background-color: #f4f4f4;
  }
}
</style>