<template>
  <div id="a-container" class="container a-container">
    <div id="a-form" class="form">
      <h2 class="form_title title">创建账号</h2>
      <div class="form__icons">
        <img class="form__icon" src="../../../assets/images/smile1.png" />
        <img class="form__icon" src="../../../assets/images/shock.png" />
        <img class="form__icon" src="../../../assets/images/cry1.png" />
        <img class="form__icon" src="../../../assets/images//wink1.png" />
        <img class="form__icon" src="../../../assets/images/angery.png" />
      </div>
      <span class="form__span">此刻你的心空是什么天气呢？</span>
      <input class="form__input" type="text" placeholder="用户名" v-model="registerForm.username" />
      <input class="form__input" type="email" placeholder="邮箱" v-model="registerForm.email" />
      <input class="form__input" type="password" placeholder="密码" v-model="registerForm.password" />
      <button class="form__button button" @click="toRegister">注册</button>
    </div>
  </div>
</template>

  <script setup lang="ts">
  import { useMainStore } from '/@/store/modules/message'
  import { storeToRefs } from 'pinia'
  import { watch, ref } from 'vue'
  import { loginApi } from '/@/api/login-api';
  import { message } from 'ant-design-vue';

  const mainStore = useMainStore()
  const { showSignup } = storeToRefs(mainStore)
  watch(showSignup, () => {
    const aContainer = document.querySelector('#a-container') as any
    aContainer.classList.toggle('is-txl')
  })

  const registerForm:any = ref({
    username: '',
    password: '',
    email: '',
  })

  const toRegister = async () => {
    if(!registerForm.value.username){
      message.error('用户名不能为空');
      return
    }
    if(!registerForm.value.email){
      message.error('邮箱不能为空');
      return
    }
    if(!registerForm.value.password){
      message.error('密码不能为空');
      return
    }
    
    const res:any = await loginApi.register(registerForm.value);
    message.success(res.message)
  }
  </script>
  
  <style scoped lang="scss">
  @import '/src/styles/login.scss';
  </style>
  