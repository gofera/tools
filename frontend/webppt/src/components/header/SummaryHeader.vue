<template>
    <div class="summary-header">
        <el-header>{{summaryData.title}}</el-header>
        <el-container>
                <el-card
                        class="box-card"
                        style="margin-bottom:20px;"
                        v-loading="isLoading && isLoading > 0"
                        element-loading-text="loading">
                    <div 
                            class="text item"
                            v-for="(item,index) in summaryData.tabs"
                            :key="'info'+index"
                            ><span>{{item.label}}: {{ item.value }}</span></div>
                </el-card>
        </el-container>
    </div>
</template>

<script lang='ts'>

    import {Component, Vue, Prop} from 'vue-property-decorator';


    @Component
    export default class SummaryHeader extends Vue {
        @Prop() protected isLoading!: boolean | number;
        @Prop() protected summaryData!: {
            title: string[];
            tabs: Array<{
                label: string;
                value: string | number;
            }>
        };
    }
</script>

<style lang='scss' scoped>
    
    .summary-header {
        width: 100%;
        .el-container {
            display: flex;
            width: 100%;
            height: auto;
            justify-content: space-between;
            .left {
                width: 40%;
            }
            .right {
                width: 58%;
            }
        }

        .text {
            font-size: 14px;
        }

        .item {
            padding: 5px 0;
        }

        .box-card {
            width: 100%;
        }
    }

</style>