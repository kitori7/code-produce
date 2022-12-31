
//导入 Axios 请求
import { createAxios } from './request-wrapper'
const request = createAxios();
// get 请求

const tokenHeaders = {
    headers:{
        "Authorization" : `bearer ${localStorage.getItem('token')}`
    }
}
//post 注册
export const PostReg = (data: any) =>
    request.post("/coder-user/api/v1/user/register", JSON.stringify(data) , {
        headers: {
            "Content-Type": "application/json",
          },
    });

//post 登录
export const PostLogin = (data: any) =>
    request.post("/coder-auth/oauth/token",{grant_type:'password',...data},{
        headers:{
            "Authorization":"Basic Y29kZS1nZW5lcmF0b3I6MTIzNDU2",
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

//get 退出
export const PostRemove = ()=>
    request.get("/coder-auth/api/v1/auth/removeToken",tokenHeaders)

//get 工程服务 获取工程队列
export const GetProductList = ()=>
    request.get('/coder-server/api/v1/product/list',tokenHeaders)
//post 工程服务 分页获取工程队列
export const PostPageProduct = (data:any)=>
    request.post('/coder-server/api/v1/product/page',data,tokenHeaders)

//post 工程服务 添加工程
export const PostAddProduct = (data:any) =>
    request.post('/coder-server/api/v1/product/add',data,tokenHeaders)
//pull 工程服务 修改工程 
export const PutChangeProduct = (id:number,data:any) =>
    request.put(`/coder-server/api/v1/product/update/${id}`,data,tokenHeaders)
//del 工程服务 删除工程
export const DelProduct = (id:number) =>
    request.delete(`/coder-server/api/v1/product/delete/${id}`,tokenHeaders)

//post 数据源服务 分页获取数据源
export const PostGetDatasouce = (data:any) =>
    request.post('/coder-server/api/v1/datasouce/page',data,tokenHeaders)

//post 数据源服务 添加数据源
export const PostAddDatasouce = (data:any) =>
    request.post('/coder-server/api/v1/datasouce/add',data,tokenHeaders)

//pull 数据源服务 修改数据源 
export const PutChangeDatasouce = (id:number,data:any) =>
    request.put(`/coder-server/api/v1/datasouce/update/${id}`,data,tokenHeaders)
//del 数据源服务 删除数据源
export const DelDatasouce = (id:number) =>
    request.delete(`/coder-server/api/v1/datasouce/delete/${id}`,tokenHeaders)
//get 数据源服务  测试数据源
export const GetTest = (id:number) =>
    request.get(`/coder-server/api/v1/datasouce/test/${id}`,tokenHeaders)
//get 数据源服务  获取当前库的所有表数据（未存储）
export const GetTableList = (id:number) =>
    request.get(`/coder-server/api/v1/datasouce/table/list/${id}`,tokenHeaders)
//get 数据源服务  获取表字段信息（未储存）
export const GetTableField = (id:number,field:string) =>
    request.get(`/coder-server/api/v1/datasouce/table/field/${id}/${field}`,tokenHeaders)
  
//get 数据源服务 根据表名称获取表信息（未存储）
export const GetSearch = (id:number,field:string) =>
    request.get(`/coder-server/api/v1/datasouce/table/info/${id}/${field}`,tokenHeaders)
//post 数据源服务 储存表字段数据
export const PostTableAdd = (data:any) =>
    request.post('/coder-server/api/v1/table/add',data,tokenHeaders)

// get 数据源服务 根据datasourceId获取表信息
export const GetTableListed = (id:number) =>
    request.get(`/coder-server/api/v1/table/getTables/${id}`,tokenHeaders)
//post 数据源服务 数据源同步
export const PostSync = (id:number,data:any) =>
    request.put(`/coder-server/api/v1/table/sync/${id}`,data,tokenHeaders)
//get 字段服务 存缓获取所有字段类型
export const GetFieldType = () =>
    request.get('/coder-server/api/v1/fieldtype/cacheList',tokenHeaders)

//post 数据生成服务 代码生成
export const PostCode = (datasouce:number,product:number,Type:string,data:any)=>
    request.post(`/coder-server/api/v1/generate/code/${datasouce}/${product}/${Type}`,data,tokenHeaders)

export const  PostData = (data:any) =>
    request.post('/coder-server/api/v1/generate/code/data',data,tokenHeaders)

export const Refresh = (data?:any)=>
    request.post('/coder-auth/oauth/token',
    {
        grant_type:'refresh_token',
        refresh_token:localStorage.getItem('reFreshToken')
    },{
        headers:{
          "Authorization":"Basic Y29kZS1nZW5lcmF0b3I6MTIzNDU2",
          'Content-Type': 'application/x-www-form-urlencoded'
    }})
// post 请求
    // 请求 token 添加

/*
请求配置与使用

* POST 请求 方式
    export const 名字 = (data: any) =>
        request.post("接口", data, {
            直接为空
            注：只能配置 AxiosRequestConfig 里有的参数名 可不用配置
        });

* GET 请求 方式
    export const 名字 = (params: any): Promise<any> =>
        request.get("接口", { params });

*使用 方法
   *引入
        import {
            名字
        } from "../api/api"
    *生命周期中 请求
        名字({请求参数}).then((res) => {
            console.log(res)
        })
*/