export const questionnaires = [
    {id: 1,
        title: '抑郁症筛查（PHQ-9）',
        description: '测评抑郁症状严重程度的量表，广泛用于临床筛查',
        timeEstimate: '2',
        icon: 'fas fa-brain',
        bgColor: 'bg-gradient-to-r from-blue-400 to-indigo-500',
        questions: [
            {
                text: '在过去的两周内，有多少天您感到做事时提不起劲或没有兴趣？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您感到情绪低落、沮丧或无望？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您入睡困难、易醒或睡眠过多？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您感到疲劳或缺乏精力？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您食欲不振或吃得过多？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您感到自己很糟糕，或者觉得自己是个失败者，或者让自己或家人失望？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您对事物难以集中注意力，例如阅读报纸或看电视？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您行动或说话缓慢到别人已经注意到？或者相反，您比平常更烦躁或坐立不安？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '在过去的两周内，有多少天您有过自残或轻生的念头，或者觉得自己活着没有意义？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            }
        ]
    },
    {
        id: 2,
        title: '睡眠质量指数（PSQI）',
        description: '评估睡眠质量和睡眠障碍的标准化问卷',
        timeEstimate: '2',
        icon: 'fas fa-moon',
        bgColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
        questions: [
            {
                text: '过去一个月，您通常需要多长时间才能入睡？',
                options: [
                    { text: '5分钟以内', value: 0 },
                    { text: '6-15分钟', value: 1 },
                    { text: '16-30分钟', value: 2 },
                    { text: '30分钟以上', value: 3 }
                ]
            },
            {
                text: '过去一个月，您每晚平均睡眠时长是多少小时？',
                options: [
                    { text: '少于4小时', value: 3 },
                    { text: '4-5小时', value: 2 },
                    { text: '6-7小时', value: 1 },
                    { text: '8小时及以上', value: 0 }
                ]
            },
            {
                text: '过去一个月，您是否因以下情况而夜间醒来或早醒？',
                options: [
                    { text: '从未', value: 0 },
                    { text: '偶尔', value: 1 },
                    { text: '经常', value: 2 },
                    { text: '几乎每晚', value: 3 }
                ]
            },
            {
                text: '过去一个月，您感觉睡眠质量如何？',
                options: [
                    { text: '很好', value: 0 },
                    { text: '较好', value: 1 },
                    { text: '较差', value: 2 },
                    { text: '很差', value: 3 }
                ]
            },
            {
                text: '过去一个月，您是否有打鼾的情况？',
                options: [
                    { text: '没有', value: 0 },
                    { text: '偶尔', value: 1 },
                    { text: '经常', value: 2 },
                    { text: '几乎每晚', value: 3 }
                ]
            },
            {
                text: '过去一个月，您白天是否感到困倦或精力不足？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有几天', value: 1 },
                    { text: '一半以上时间', value: 2 },
                    { text: '几乎每天', value: 3 }
                ]
            },
            {
                text: '过去一个月，您是否因睡眠问题影响到日常工作或社交？',
                options: [
                    { text: '完全没有', value: 0 },
                    { text: '有一点影响', value: 1 },
                    { text: '有较大影响', value: 2 },
                    { text: '影响严重', value: 3 }
                ]
            }
        ]
    },
    {
        id: 3,
        title: '压力感知量表（PSS）',
        description: '测量个体对生活中压力事件的感知程度',
        timeEstimate: '3',
        icon: 'fas fa-heartbeat',
        bgColor: 'bg-gradient-to-r from-red-400 to-orange-500',
        questions: [
            {
                text: '在过去的一个月里，您感觉无法控制生活中的重要事情的频率？',
                options: [
                    { text: '从不', value: 0 },
                    { text: '很少', value: 1 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 3 },
                    { text: '总是', value: 4 }
                ]
            },
            {
                text: '在过去的一个月里，您感到紧张或压力的频率？',
                options: [
                    { text: '从不', value: 0 },
                    { text: '很少', value: 1 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 3 },
                    { text: '总是', value: 4 }
                ]
            },
            {
                text: '在过去的一个月里，您觉得事情正按着您的期望进行的频率？',
                options: [
                    { text: '从不', value: 4 },
                    { text: '很少', value: 3 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 1 },
                    { text: '总是', value: 0 }
                ]
            },
            {
                text: '在过去的一个月里，您感到无法应对所有需要做的事情的频率？',
                options: [
                    { text: '从不', value: 0 },
                    { text: '很少', value: 1 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 3 },
                    { text: '总是', value: 4 }
                ]
            },
            {
                text: '在过去的一个月里，您感到无法控制生活中发生的事情的频率？',
                options: [
                    { text: '从不', value: 0 },
                    { text: '很少', value: 1 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 3 },
                    { text: '总是', value: 4 }
                ]
            },
            {
                text: '在过去的一个月里，您感到愤怒，因为事情超出了您的控制范围的频率？',
                options: [
                    { text: '从不', value: 0 },
                    { text: '很少', value: 1 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 3 },
                    { text: '总是', value: 4 }
                ]
            },
            {
                text: '在过去的一个月里，您觉得困难堆积如山，无法克服的频率？',
                options: [
                    { text: '从不', value: 0 },
                    { text: '很少', value: 1 },
                    { text: '有时', value: 2 },
                    { text: '经常', value: 3 },
                    { text: '总是', value: 4 }
                ]
            }
        ]
    },
    {
        id: 4,
        title: '幸福感指数（OHI）',
        description: '衡量个体主观幸福感和生活满意度的量表',
        timeEstimate: '8',
        icon: 'fas fa-smile',
        bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        questions: [
            // 问题列表...
        ]
    }
];