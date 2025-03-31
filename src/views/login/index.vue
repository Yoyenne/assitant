<template>
	<div class="body">
		<!-- 添加背景线条容器 -->
		<div class="background-lines">
			<div class="line line-1"></div>
			<div class="line line-2"></div>
			<div class="line line-3"></div>
			<div class="line line-4"></div>
		</div>

		<div class="main">
			<LoginSigin_in />
			<LoginSign_up />
			<LoginSwitch />
		</div>
	</div>
</template>

<script setup lang="ts">
import LoginSigin_in from './components/sign_in.vue';
import LoginSign_up from './components/sign_up.vue';
import LoginSwitch from './components/switch.vue';
</script>



<style scoped>
/* 全局样式重置 */
*,
*::after,
*::before {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	user-select: none;
}

/* 页面主体样式 */
.body {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'Montserrat', sans-serif;
	font-size: 12px;
	background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	color: #a0a5a8;
	position: relative;
}

/* 主内容区域样式 */
.main {
	position: relative;
	width: 1000px;
	min-width: 1000px;
	min-height: 600px;
	height: 600px;
	padding: 25px;
	background-color: #ecf0f3;
	box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
	border-radius: 20px;
	overflow: hidden;
	z-index: 2; /* 确保主内容在线条上方 */
}

@media (max-width: 1200px) {
	.main {
		transform: scale(0.7);
	}
}

@media (max-width: 1000px) {
	.main {
		transform: scale(0.6);
	}
}

@media (max-width: 800px) {
	.main {
		transform: scale(0.5);
	}
}

@media (max-width: 600px) {
	.main {
		transform: scale(0.4);
	}
}

.background-lines {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
	overflow: hidden;
}

.line {
	position: absolute;
	border-radius: 50%;
	box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3),
		inset -2px -2px 5px rgba(249, 249, 249, 0.5);
}

/* 左下角线条 */
.line-1 {
	bottom: -150px;
	left: -150px;
	width: 300px;
	height: 300px;
	border-top: 2px solid rgba(48, 116, 225, 0.3);
	transform: rotate(-30deg);
	animation: floatLine 10s infinite ease-in-out;
}

.line-2 {
	bottom: -250px;
	left: -100px;
	width: 500px;
	height: 500px;
	border-top: 2px solid rgba(209, 217, 230, 0.2);
	transform: rotate(-20deg);
	animation: floatLine 12s infinite ease-in-out reverse;
}

/* 右上角线条 */
.line-3 {
	top: -150px;
	right: -150px;
	width: 300px;
	height: 300px;
	border-bottom: 2px solid rgba(209, 217, 230, 0.3);
	transform: rotate(-30deg);
	animation: floatLine 8s infinite ease-in-out;
}

.line-4 {
	top: -250px;
	right: -100px;
	width: 500px;
	height: 500px;
	border-bottom: 2px solid rgba(209, 217, 230, 0.2);
	transform: rotate(-20deg);
	animation: floatLine 15s infinite ease-in-out reverse;
}

@keyframes floatLine {
	0%,
	100% {
		transform: rotate(-30deg) translateY(0);
	}
	50% {
		transform: rotate(-15deg) translateY(-50px);
	}
}
</style>
