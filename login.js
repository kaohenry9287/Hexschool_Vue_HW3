//用「具名匯入」的方式，並使用「解構語法」將createApp這個模組拿出來用
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
        return {
            // (申請api的網站)
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            user: {
                username: '',
                password: '',
            },
        };
    },
    methods: {
        login() {
            //使用signin api
            const api = `${this.apiUrl}/admin/signin`;
            //signin api屬於post，用this指向login函式外的user內資料
            axios.post(api, this.user)

                //成功結果，並把結果中的token、時效取出，最後加入cookie中
                .then((response) => {
                    //展開res.data並存取token、expired
                    const { token, expired } = response.data;
                    //把登入資料存入cookie
                    document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                    //導向產品頁面
                    window.location = 'index.html';
                })

                //失敗結果
                .catch((error) => {
                    alert(error.data.message);
                });
        },
    },
}).mount('#app');

