/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { enviroment } from "apps/gfw-portal/env/dev.env";
@Injectable({
  providedIn:'root'
})


export class AssetsService{

  constructor(private _HttpClient:HttpClient){}


  getAssetById(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Asset/Id?AssetId=${id}`)
  }

  getAssetsSearch(req?:any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Asset/Search', req);
  }



  addAsset(req:any ):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL+'Asset',req)
  }
  updateAsset(req:any ):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL+'Asset/Id',req)
  }



  deleteAsset(assetId:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `Asset/Id`,{
      body:{
        assetId
      }
    })
  }



  getAllCategoriesTree():Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Asset/AssetCategory`)
  }


  createCategory(data:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `Asset/AssetCategory` , data)
  }

  updateCategory(data:any):Observable<any>{
        return this._HttpClient.put(enviroment.API_URL + `Asset/AssetCategory/id` , data)

  }

  getCategoryById(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Asset/AssetCategory/Id?AssetCategoryId=${id}`)
  }

  deleteCategory(id:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `Asset/AssetCategory/id`,{
      body:{
        assetCategoryId:id
      }
    })
  }

}
