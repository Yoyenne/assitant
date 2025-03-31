<template>
  <div id="a-container" class="container a-container">
    <form id="a-form" class="form" method="" action="">
      <h2 class="form_title title">创建账号</h2>
      <div class="form__icons">
        <img class="form__icon" src="../../../assets/images/smile1.png" />
        <img class="form__icon" src="../../../assets/images/shock.png" />
        <img class="form__icon" src="../../../assets/images/cry1.png" />
        <img class="form__icon" src="../../../assets/images//wink1.png" />
        <img class="form__icon" src="../../../assets/images/angery.png" />
      </div>
      <span class="form__span">此刻你的心空是什么天气呢？</span>
      <input class="form__input" type="text" placeholder="用户名" />
      <input class="form__input" type="password" placeholder="密码" />
      <button class="form__button button submit">注册</button>
    </form>
  </div>
</template>

  <script setup lang="ts">
  import { useMainStore } from '/@/store/modules/message'
  import { storeToRefs } from 'pinia'
  import { watch } from 'vue'

  const mainStore = useMainStore()
  const { showSignup } = storeToRefs(mainStore)
  watch(showSignup, () => {
    const aContainer = document.querySelector('#a-container') as any
    aContainer.classList.toggle('is-txl')
  })
  </script>
  
  <style scoped lang="scss">
  @import '/src/styles/login.scss';
  </style>
  