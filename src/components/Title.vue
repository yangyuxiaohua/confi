<template>
    <div class="wrapper">
        <!-- 标题 -->
         <slot name="TitleBox"></slot>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less" scoped>
 .wrapper{
     width: 100%;
     height: 56px;
     background-color: #039be5;
     line-height: 56px;
     padding-left: 20PX;
     box-sizing: border-box;
     color:#fff;
     font-size: 20px;
 }
</style>