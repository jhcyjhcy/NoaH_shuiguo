<template>
    <div class="c-charts">
        <IEcharts :option="bar"></IEcharts>
    </div>
</template>

<script>
import vPageTitle from '../common/pageTitle.vue';
import IEcharts from 'vue-echarts-v3';
export default {
    components: {
        vPageTitle, IEcharts
    },
    data: () => ({
        bar: {
            // title: {
            //     text: '深圳月最低生活费组成（单位:元）',
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: []
            },
            grid: {
                x: '10%',
                y: '10%',
                width: '85%',
                show: true,
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            series: [
                // {
                //     itemStyle: {
                //         normal: {
                //             color: '#63bbb2',
                //             opacity: 0.9
                //         }
                //     },
                //     name: '芒果',
                //     type: 'bar',
                //     stack: '总量',
                //     label: {
                //         normal: {
                //             show: true,
                //             position: 'insideRight'
                //         }
                //     },
                //     data: [320, 302, 301, 334, 390, 330, 320]
                // },

                // {
                //     itemStyle: {
                //         normal: {
                //             color: '#ef8989',
                //             opacity: 0.9
                //         }
                //     },
                //     name: '苹果',
                //     type: 'bar',
                //     stack: '总量',
                //     label: {
                //         normal: {
                //             show: true,
                //             position: 'insideRight'
                //         }
                //     },
                //     data: [220, 182, 191, 234, 290, 330, 310]
                // },
                // {
                //     itemStyle: {
                //         normal: {
                //             color: '#6cc5df',
                //             opacity: 0.9
                //         }
                //     },
                //     name: '梨子',
                //     type: 'bar',
                //     stack: '总量',
                //     label: {
                //         normal: {
                //             show: true,
                //             position: 'insideRight'
                //         }
                //     },
                //     data: [530, 600, 301, 554, 490, 330, 710]
                // },
                // {
                //     itemStyle: {
                //         normal: {
                //             color: '#b1ce4d',
                //             opacity: 0.9
                //         }
                //     },
                //     name: '猕猴桃',
                //     type: 'bar',
                //     stack: '总量',
                //     label: {
                //         normal: {
                //             show: true,
                //             position: 'insideRight'
                //         }
                //     },
                //     data: [820, 832, 901, 934, 1290, 1330, 1320]
                // },
                // {
                //     itemStyle: {
                //         normal: {
                //             color: '',
                //             opacity: 0.9
                //         }
                //     },
                //     name: '',
                //     type: 'bar',
                //     stack: '总量',
                //     label: {
                //         normal: {
                //             show: true,
                //             position: 'insideRight'
                //         }
                //     },
                //     data: []
                // }
            ]
        }
    }),
    methods: {
    },
    props:['dataOrder'],    // 传参
    // 由于挂在前，ajax请求还没有结束，所以要用watch来进行实时观察，已变更echart图表
    watch: {
        // 如果 dataOrder 发生改变，这个函数就会运行
        dataOrder: function (newDataOrder) {
            // 循环构建echart
            this.dataOrder.value.forEach(function(value, index, array) {
                let series = {
                    itemStyle: {
                        normal: {
                            color: value.color,
                            opacity: 0.9
                        }
                    },
                    name: value.name,
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: value.data
                };
                // console.log(typeof(this.bar.series));
                //动态改变chart值
                this.bar.legend.data.push(value.name);
                this.bar.series.push(series);
            }, this);
        }
    },
    mounted: function() {
        // 异步去取数据
        // let dataOrder = {
        //     data: ['芒果', '苹果', '梨子', '猕猴桃', '西瓜'],
        //     value: [
        //         { name: '芒果', data: [320, 302, 301, 334, 390, 330, 320], color: '#63bbb2' },
        //         { name: '苹果', data: [220, 182, 191, 234, 290, 330, 310], color: '#ef8989' },
        //         { name: '梨子', data: [530, 600, 301, 554, 490, 330, 710], color: '#6cc5df' },
        //         { name: '猕猴桃', data: [820, 832, 901, 934, 1290, 1330, 1320], color: '#b1ce4d' },
        //         { name: '西瓜', data: [520, 432, 601, 734, 990, 1130, 1020], color: '#b1ae4e' }
        //     ]
        // };
        // this.dataOrder.value.forEach(function(value, index, array) {
        //     let series = {
        //         itemStyle: {
        //             normal: {
        //                 color: value.color,
        //                 opacity: 0.9
        //             }
        //         },
        //         name: value.name,
        //         type: 'bar',
        //         stack: '总量',
        //         label: {
        //             normal: {
        //                 show: true,
        //                 position: 'insideRight'
        //             }
        //         },
        //         data: value.data
        //     };
        //     // console.log(typeof(this.bar.series));
        //     this.bar.series.push(series);
        // }, this);
    }
}
</script>

<style scoped>
.el-col {
    margin-bottom: 16px;
}

.material-icons {
    font-size: 80px;
    color: #ddd;
}

.cart-string {
    height: 100px;
    padding-top: 10px;
    font-size: 1.1rem;
}

.c-charts {
    height: 400px;
    width: 100%;
}
</style>