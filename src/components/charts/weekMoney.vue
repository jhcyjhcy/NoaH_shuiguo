<template>
    <div class="c-charts" >
        <IEcharts :option="bar"  ></IEcharts>
    </div>
</template>

<script>
    import vPageTitle from '../common/pageTitle.vue';
    import IEcharts from 'vue-echarts-v3';
    export default {
        components:{
            vPageTitle,IEcharts
        },
        props:['dataOrder'],    //父组件传来的变量
        data: () => ({
            bar: {
                title: {
                    text: '一周利润比'
                },
                tooltip: {},
                legend: {
                    data:['金额·元']
                },
                xAxis: {
                    data: ["周一","周二","周三","周四","周五","周六","周日"]
                },
                yAxis: {},
                series: [{
                    name: '金额·元',
                    type: 'bar',
                    data: []
                }]
            },
        }),
        watch: {
            // 如果 dataOrder 发生改变，这个函数就会运行
            dataOrder: function (newDataOrder) {
                this.bar.series[0].data = this.dataOrder.weekMoney
            }
        },
        mounted: function(){
            // 异步去取数据
            // let weekMoney= [115, 220, 316, 160, 190, 220,112];
            // console.log(this.dataOrder);
            // this.bar.series[0].data = this.dataOrder.weekMoney;
        }
    }
</script>

<style scoped>
    .c-charts{
        height:400px;
        width:100%;
    }
 
    
</style>