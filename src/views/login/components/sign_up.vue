<template>
  <div id="a-container" class="container a-container">
    <form id="a-form" class="form" method="" action="">
      <h2 class="form_title title">Create Account</h2>
      <div class="form__icons">
        <img class="form__icon" src="../../../assets/images/smile.png" />
        <img class="form__icon" src="../../../assets/images/shock.png" />
        <img class="form__icon" src="../../../assets/images/cry.png" />
        <img class="form__icon" src="../../../assets/images//wink.png" />
        <img class="form__icon" src="../../../assets/images/angery.png" />
      </div>
      <span class="form__span">or use email for registration</span>
      <input class="form__input" type="text" placeholder="Name" />
      <input class="form__input" type="password" placeholder="Password" />
      <button class="form__button button submit">SIGN UP</button>
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
  