<template>
    <div id="switch-cnt" class="switch">
      <div class="switch__circle"></div>
      <div class="switch__circle switch__circle--t"></div>
      <!-- 状态1 -->
      <div id="switch-c1" class="switch__container">
        <h2 class="switch__title title">Welcome Back !</h2>
        <p class="switch__description description">
          To keep connected with us please login with your personal info
        </p>
        <button class="switch__button button switch-btn" @click="change">
          SIGN IN
        </button>
      </div>
      <!-- 状态2 -->
      <div id="switch-c2" class="switch__container is-hidden">
        <h2 class="switch__title title">Hello Friend !</h2>
        <p class="switch__description description">
          Enter your personal details and start journey with us
        </p>
        <button class="switch__button button switch-btn" @click="change">
          SIGN UP
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useMainStore } from '/@/store/modules/message'
  const mainStore = useMainStore()
  
  const change = () => {
    // 加上as any防止ts类型检查报错
    const switchC1 = document.querySelector('#switch-c1') as any
    const switchC2 = document.querySelector('#switch-c2') as any
    const switchCircle = document.querySelectorAll('.switch__circle') as any
    const switchCtn = document.querySelector('#switch-cnt') as any
  
    switchCtn.classList.add('is-gx')
    setTimeout(function () {
      switchCtn.classList.remove('is-gx')
    }, 1500)
    switchCtn.classList.toggle('is-txr')
    switchCircle[0].classList.toggle('is-txr')
    switchCircle[1].classList.toggle('is-txr')
  
    switchC1.classList.toggle('is-hidden')
    switchC2.classList.toggle('is-hidden')
  
    mainStore.showSignup = !mainStore.showSignup
  }
  </script>
  
  <style scoped lang="scss">
  @import '/src/styles/login.scss';

  </style>
  