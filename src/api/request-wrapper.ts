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
                ElMessage.success('请求成功')
            }
            //返回参数
            return response;
        },
        function (error) {
            // 关闭加载 动画
            if (loading) cancelLoading();
            
            /***** 接收到异常响应的处理开始 *****/
            if (error && error.response) {
                // 1.公共错误处理
                // 2.根据响应码具体处理
                switch (error.response.status) {
                    case 400:
                        error.message = '错误请求'
                        break;
                    case 401:
                        error.message = '登录失败'
                        break;
                    case 403:
                        error.message = '拒绝访问'
                        break;
                    case 404:
                        error.message = '请求错误,未找到该资源'
                        // window.location.href = "/NotFound"
                        break;
                    case 405:
                        error.message = '请求方法未允许'
                        break;
                    case 408:
                        error.message = '请求超时'
                        break;
                    case 500:
                        error.message = '服务器端出错'
                        break;
                    case 501:
                        error.message = '网络未实现'
                        break;
                    case 502:
                        error.message = '网络错误'
                        break;
                    case 503:
                        error.message = '服务不可用'
                        break;
                    case 504:
                        error.message = '网络超时'
                        break;
                    case 505:
                        error.message = 'http版本不支持该请求'
                        break;
                    default:
                        error.message = `连接错误${error.response.status}`
                }
            } else {
                // 超时处理
                if (JSON.stringify(error).includes('timeout')) {
                    error.message = '服务器响应超时，请刷新当前页'
                } else {
                    error.message = '连接服务器失败'
                }
            }
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