<template>
  <div id="b-container" class="container b-container">
    <!-- 登录表单 -->
    <form v-if="!showForgotPassword && !showResetPassword" id="b-form" class="form" method="" action="">
      <h2 class="form_title title">登录</h2>
      <div class="form__icons">
        <img class="form__icon" src="../../../assets/images/smile1.png" />
        <img class="form__icon" src="../../../assets/images/shock.png" />
        <img class="form__icon" src="../../../assets/images/cry1.png" />
        <img class="form__icon" src="../../../assets/images//wink1.png" />
        <img class="form__icon" src="../../../assets/images/angery.png" />
      </div>
      <span class="form__span">此刻你的心空是什么天气呢？</span>
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
      <a class="form__link" @click.prevent="toggleForgotPassword">忘记密码？</a>
      <button class="form__button button submit">登录</button>
    </form>

    <!-- 找回密码表单 -->
    <form v-else-if="showForgotPassword" id="forgot-password-form" class="form" method="" action="">
      <h2 class="form_title title">找回密码</h2>
      <span class="form__span">请输入您的用户名和邮箱地址</span>
      <input
        v-model="forgotPasswordForm.username"
        class="form__input"
        type="text"
        placeholder="用户名"
      />
      <input
        v-model="forgotPasswordForm.email"
        class="form__input"
        type="email"
        placeholder="邮箱地址"
      />
      <button class="form__button button submit" @click.prevent="submitForgotPassword">
        提交
      </button>
      <a class="form__link" @click.prevent="toggleForgotPassword">返回登录</a>
    </form>

    <!-- 修改密码表单 -->
    <form v-else id="reset-password-form" class="form" method="" action="">
      <h2 class="form_title title">修改密码</h2>
      <span class="form__span">请输入以下信息以重置密码</span>
      <input
        v-model="resetPasswordForm.username"
        class="form__input"
        type="text"
        placeholder="用户名"
      />
      <input
        v-model="resetPasswordForm.email"
        class="form__input"
        type="email"
        placeholder="邮箱地址"
      />
      <input
        v-model="resetPasswordForm.verificationCode"
        class="form__input"
        type="text"
        placeholder="验证码"
      />
      <input
        v-model="resetPasswordForm.newPassword"
        class="form__input"
        type="password"
        placeholder="新密码"
      />
      <button class="form__button button submit" @click.prevent="submitResetPassword">
        确认修改
      </button>
      <a class="form__link" @click.prevent="toggleForgotPassword">返回登录</a>
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

// 登录表单数据
const loginFrom = ref({
  username: '',
  password: '',
})

// 找回密码表单数据
const forgotPasswordForm = ref({
  username: '',
  email: '',
})

// 修改密码表单数据
const resetPasswordForm = ref({
  username: '',
  email: '',
  verificationCode: '',
  newPassword: '',
})

// 控制是否显示找回密码界面
const showForgotPassword = ref(false)

// 控制是否显示修改密码界面
const showResetPassword = ref(false)

// 切换找回密码界面
const toggleForgotPassword = () => {
  showForgotPassword.value = !showForgotPassword.value
  showResetPassword.value = false
}

// 提交找回密码表单
const submitForgotPassword = () => {
  const { username, email } = forgotPasswordForm.value
  if (!username || !email) {
    alert('请输入用户名和邮箱地址！')
    return
  }
  // 模拟发送验证码逻辑
  alert(`验证码已发送到邮箱 ${email}，请查收！`)
  // 切换到修改密码界面
  showForgotPassword.value = false
  showResetPassword.value = true
}

// 提交修改密码表单
const submitResetPassword = () => {
  const { username, email, verificationCode, newPassword } = resetPasswordForm.value
  if (!username || !email || !verificationCode || !newPassword) {
    alert('请完整填写所有信息！')
    return
  }
  // 模拟修改密码逻辑
  alert(`密码已成功修改！用户名：${username}`)
  // 重置表单并返回登录界面
  resetPasswordForm.value.username = ''
  resetPasswordForm.value.email = ''
  resetPasswordForm.value.verificationCode = ''
  resetPasswordForm.value.newPassword = ''
  showResetPassword.value = false
}
</script>

<style scoped lang="scss">
@import '/src/styles/login.scss';
</style>
