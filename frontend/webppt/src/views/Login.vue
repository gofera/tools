<template>
    <el-container class="login" v-loading="isLoading">
        <div class="login-view">
            <div class="login-view-left">
                <swiper class="login-view-swiper" :options="swiperOption" ref="mySwiper">
                    <!-- slides -->
                    <swiper-slide><img src="../assets/3.jpg"></swiper-slide>
                    <swiper-slide><img src="../assets/image1.jpg"></swiper-slide>
                    <swiper-slide><img src="../assets/image2.jpg"></swiper-slide>
                    <swiper-slide><img src="../assets/image3.jpg"></swiper-slide>
                    <!-- Optional controls -->
                    <div class="swiper-pagination"  slot="pagination"></div>
                </swiper>
            </div>
            <div class="login-view-right">
                <h1>Welcome to Web PPT</h1>
                <div class="login-view-input">
                    <el-input @keyup.enter.native="logIn" v-model="usr" placeholder="Please input ASML user name"></el-input>
                    <el-input @keyup.enter.native="logIn" v-model="pwd" placeholder="Please input password" show-password></el-input>
                    <el-button @click="logIn" type="primary">Login</el-button>
                </div>
            </div>
        </div>
    </el-container>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import * as authStore from '@/store/auth';
import * as api from '@/api';
import * as auth from '@/api/auth';
import Base from '@/components/base';

@Component
export default class Login extends Base {
    protected usr: string = '';
    protected pwd: string = '';
    protected isLoading: boolean = false;
    protected swiperOption: any = {
        loop: true,
        effect: 'fade',
        speed: 300,
        autoplay: {
            delay: 3000,
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
    };

    public mounted() {
        const name = (this.$route.query as any).user;
        if (typeof name === 'string') {
            this.usr = name;
        }
    }

    protected async logIn() {
        if (!(this.usr && this.pwd)) {
            this.$message({
                message: `Please input user name and password.`,
                type: 'warning',
            });
        } else {
            this.isLoading = true;
            try {
                const resp = await auth.login(this.usr, this.pwd);
                this.showRespMessage(resp, 'Login');
                if (resp.Code === api.RespCode.OK) {
                    this.setLoginResp(resp);
                    authStore.setPasswd(this.pwd);
                    this.$router.push('/');
                }
                this.pwd = '';
            } catch (e) {
                this.showErrMsg(e, 'Login');
            }
            this.isLoading = false;
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../styles/index.scss';
    .login {
        display: flex;
        flex: 1;
        align-items: center;
        padding: 20px 0;
        width: 100%;
        min-height: 100vh;  // show center vertically (need to set: display: flex)
        overflow: auto;
        .login-welcome {
            text-align: center;
            color: $asml_blue;
        }
        .login-view {
            display: flex;
            margin: 0 auto;
            width: 1000px;
            height: 500px;
            border-radius: 20px;
            box-shadow: 0 4px 12px 5px rgba(0,0,0,.1);
            overflow: hidden;
            .login-view-left {
                position: relative;
                float: left;
                height: 100%;
                width: 600px;
                overflow: hidden;
                .login-view-swiper {
                    height: 100%;
                    width: 100%;
                    img {
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 100%;
                    }
                }
            }
            .login-view-right {
                display: flex;
                align-items: center;
                flex-direction: column;
                float: left;
                flex: 1;
                height: 100%;
                padding: 20px;
                h3 {
                    text-align: center;
                    span {
                        color: $asml_blue;
                    }
                }
                .login-view-input {
                    margin-top: 100px;
                    margin-bottom: 10px;
                    width: 80%;
                    * {
                        margin-bottom: 10px;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
