import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//先在外層設置modal空物件，mounted時會將其覆蓋
let productModal = null;
let delProductModal = null;

createApp({
    data() {
        return {
            // 站點(申請api的網站)
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            // 個人 API Path
            apiPath: 'kaohenry9287_hexschool',
            //產品列表
            products: [],
            //用來判斷是要新增資料還是修改資料
            isNew: false,
            //展示被點擊商品的細部內容
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    //設定生命週期
    mounted() {
        //為了達成手動切換modal，用以下方法初始化modal（bootstrap官網給定之語法）
        //建立bootstrap實體並賦予到productModal這個變數上
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            //設定能否用鍵盤操作
            keyboard: false
        });

        //使用完初始化modal語法後，即可用.show來將其顯現或添加setTimeout等設定
        //productModal.show();
        //setTimeout(()=>{productModal.hide();},3000);

        //取抓取html中delProductModal之dom元素

        //刪除商品值跳出的警告彈窗modal
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });

        // 取出 Token
        //用headers來夾帶驗證內容
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        //每次掛載都觸發一次確認登入狀態的method
        this.checkAdmin();
    },
    methods: {
        // 確認登入狀態
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message)
                    window.location = 'login.html';
                })
        },
        // 取得產品資訊
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url).then((response) => {
                this.products = response.data.products;
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        //建立或修改產品
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }
            //因為api有規定所有的資料都要放在data中，所以要使用下方的寫法
            //直接寫this.tempProduct會錯誤
            axios[http](url, { data: this.tempProduct }).then((response) => {
                alert(response.data.message);
                productModal.hide();
                this.getData();
            }).catch((err) => {
                alert(err.data.message);
            })
        },

        //開啟modal之方法
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                //使用淺拷貝的方式來將tempProduct中的資料顯示至外層（深拷貝也可以）
                //因為目前資料並沒有包超過一層，所以用淺拷貝就可以了
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            
                //把刪除的modal打開(.show)
            } else if (isNew === 'delete') {
                //使用淺拷貝的方式來將tempProduct中的資料顯示至外層（深拷貝也可以）
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },
        // 刪除產品 
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url).then((response) => {
                alert(response.data.message);
                delProductModal.hide();
                this.getData();
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        //把被點擊的商品資訊呈現在右側tempProduct區塊
        //把新附圖push到陣列中
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },
}).mount('#app');

