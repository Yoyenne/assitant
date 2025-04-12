<template>
	<div class="mb-8">
		<h3 class="text-lg font-semibold mb-4 text-blue-800">更多{{ emotion }}歌单</h3>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<div
				v-for="(playlist, index) in playlists"
				:key="playlist.id"
				:class="[
					'song-card-variant-' + ((index % 5) + 1),
					'rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-opacity-20'
				]"
			>
				<div
					class="aspect-square rounded-lg mb-3 flex items-center justify-center"
				>
					<i class="fas fa-headphones card-accent text-3xl"></i>
				</div>
				<h4 class="font-medium text-sm card-accent">{{ playlist.name }}</h4>
				<p class="text-xs mt-1">
					{{ playlist.songCount }}首歌曲
				</p>
			</div>
		</div>
	</div>
	<div>
		<h3 class="text-lg font-semibold mb-4 text-blue-800">我喜欢的歌曲</h3>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<div
				v-for="(song, index) in likedSongs"
				:key="song.id"
				:class="[
					'song-card-variant-' + ((index % 5) + 1),
					'rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-opacity-20'
				]"
			>
				<div
					class="aspect-square rounded-lg mb-3 flex items-center justify-center"
				>
					<i class="fas fa-music card-accent text-3xl"></i>
				</div>
				<h4 class="font-medium text-sm card-accent">{{ song.songName }}</h4>
				<p class="text-xs mt-1">
					{{ song.singer }}
				</p>
				<p class="text-xs mt-1">
					时长：{{ song.duration }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PlaylistSection',
	props: {
		emotion: {
			type: String,
			required: true
		},
		playlists: {
			type: Array,
			required: true
		},
		likedSongs: {
			type: Array,
			required: true
		}
	}
};
</script>

<style lang="scss" scoped>
// 歌曲卡片样式变量
$card-border-radius: 1rem;
$card-padding: 1.5rem;
$card-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
$card-hover-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);

// 基础颜色变量
$primary-light: #eff6ff; // blue-50
$primary-medium: #93c5fd; // blue-300
$primary-dark: #1e40af; // blue-800
$text-primary: #1e40af; // blue-800
$text-secondary: #3b82f6; // blue-500
$text-muted: #60a5fa; // blue-400
$heart-active: #f87171; // red-400

// 卡片颜色变体 - 更明显的蓝色系变化
$card-variants: (
    // 蓝色系
    1: (
        bg: #edf5ff,
        accent: #3b82f6,
        shadow: rgba(59, 130, 246, 0.18),
        gradient: linear-gradient(135deg, #dbeafe, #bfdbfe)
    ),
    // 天蓝色系
    2: (
        bg: #e0f7ff,
        accent: #0ea5e9,
        shadow: rgba(14, 165, 233, 0.18),
        gradient: linear-gradient(135deg, #e0f7ff, #bae6fd)
    ),
    // 靛蓝色系
    3: (
        bg: #eef2ff,
        accent: #6366f1,
        shadow: rgba(99, 102, 241, 0.18),
        gradient: linear-gradient(135deg, #e0e7ff, #c7d2fe)
    ),
    // 紫蓝色系
    4: (
        bg: #f3f0ff,
        accent: #8b5cf6,
        shadow: rgba(139, 92, 246, 0.18),
        gradient: linear-gradient(135deg, #ede9fe, #ddd6fe)
    ),
    // 深蓝色系
    5: (
        bg: #e6f2ff,
        accent: #1d4ed8,
        shadow: rgba(29, 78, 216, 0.18),
        gradient: linear-gradient(135deg, #dbeafe, #93c5fd)
    )
);

// 生成卡片变体样式
@for $i from 1 through 5 {
    $variant: map-get($card-variants, $i);
    $bg: map-get($variant, bg);
    $accent: map-get($variant, accent);
    $shadow: map-get($variant, shadow);
    $gradient: map-get($variant, gradient);

    .song-card-variant-#{$i} {
        background-color: $bg;
        box-shadow: 0 4px 6px -1px $shadow, 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        border-color: rgba(mix(white, $accent, 50%), 0.3) !important;

        // 顶部音乐图标区域的背景
        & > div:first-child {
            background: $gradient !important;
        }

        // 顶部区域的渐变覆盖
        & > div:first-child > div:first-child {
            background: linear-gradient(to bottom right, transparent, rgba(mix(white, $accent, 50%), 0.3)) !important;
        }

        // 音乐图标颜色
        .card-accent {
            color: $accent !important;
        }

        // 卡片标题和按钮颜色
        h4.card-accent {
            color: darken($accent, 10%) !important;
        }

        // 卡片标签样式
        .card-tag {
            background-color: rgba(mix(white, $accent, 70%), 0.6);
            color: darken($accent, 10%);
        }

        // 播放/暂停按钮
        button.card-accent i {
            color: $accent !important;
        }

        // 卡片悬浮效果
        &:hover {
            box-shadow: 0 10px 15px -3px $shadow, 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-color: rgba($accent, 0.3) !important;
        }

        // 进度条样式
        .card-progressbar {
            background: linear-gradient(90deg, $accent, lighten($accent, 20%));
        }

        // "我喜欢"按钮样式
        .like-button {
            background-color: rgba(mix(white, $accent, 80%), 0.8) !important;
            color: darken($accent, 15%) !important;
            
            &:hover {
                background-color: rgba(mix(white, $accent, 70%), 0.9) !important;
                transform: translateY(-2px);
            }
        }
        
        // 歌手名称样式
        p {
            color: mix($accent, #4b5563, 70%) !important;
        }
    }
}
</style>
