<template>
  <div id="b-container" class="container b-container">
    <form id="b-form" class="form" method="" action="">
      <h2 class="form_title title">注册账号</h2>
      <div class="form__icons">
        <img class="form__icon" src="../../../assets/images/smile.png" />
        <img class="form__icon" src="../../../assets/images/shock.png" />
        <img class="form__icon" src="../../../assets/images/cry.png" />
        <img class="form__icon" src="../../../assets/images//wink.png" />
        <img class="form__icon" src="../../../assets/images/angery.png" />
      </div>
      <span class="form__span">or use your email account</span>
      <input
        v-model="loginFrom.username"
        class="form__input"
        type="text"
        placeholder="用户名"
      />
      <input
        v-model.lazy="loginFrom.password"
        class="form__input"
        type="password"
        placeholder="密码"
      />
      <a class="form__link">忘记密码？</a>
      <button class="form__button button submit">注册</button>
    </form>
  </div>
</template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';
  import { useMainStore } from '/@/store/modules/message'
  
  const mainStore = useMainStore()
  const { showSignup } = storeToRefs(mainStore)
  watch(showSignup, () => {
    const bContainer = document.querySelector('#b-container') as any
    bContainer.classList.toggle('is-txl')
    bContainer.classList.toggle('is-z200')
  })
  
  const loginFrom = ref({
    username: '',
    password: '',
  })
  </script>
  
  <style scoped lang="scss">
  @import '/src/styles/login.scss';
  </style>
  