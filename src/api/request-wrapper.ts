// 导入axios
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// 使用element-ui ElMessage做消息提醒  ElLoading加载
import { ElMessage, ElLoading } from "element-plus";

//加载配置
let loadingInstance: any,
    requestNum: number = 0,
    loading: boolean = true;

//加载动画
const addLoading = () => {
    // 防止重复弹出
    requestNum++;
    if (requestNum == 1) {
        loadingInstance = ElLoading.service({ fullscreen: true });
    }
}

// 关闭 加载动画
const cancelLoading = () => {
    requestNum--;
    // 关闭 加载动画
    if (requestNum === 0) loadingInstance?.close();
}

//请求配置
export const createAxios = (config?:any) => {
    const instance = axios.create({
        baseURL : 'http://101.200.218.54:8000/',
        // timeout: 1000,
        ...config,
    });

    // 添加请求拦截器
    instance.interceptors.request.use(
        function (config) {
            //加载动画
            if (loading) addLoading();
            return config;
        },
        function (error) {
            // 请求错误
            return Promise.reject(error)
        }
    )

    // 添加响应拦截器
    instance.interceptors.response.use(
        function (response) {
            // 关闭加载 动画
            if (loading) cancelLoading();
            // 正常响应
            if(response.status==200){
                
            }
            //返回参数
            return response;
        },
        function (error) {
            // 关闭加载 动画
            if (loading) cancelLoading();
            //提示
            const ErrMsg = error.response.data.error_description?error.response.data.error_description:error.response.data.msg
            if (error.response.status==401) {
                location.reload()
                console.log(1);
                
            }else{
                ElMessage.error(ErrMsg)
            }
            /***** 处理结束 *****/
            return Promise.reject(error.response)
        }
    )

    return instance;
}