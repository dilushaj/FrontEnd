import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient,) { }

  //post method to upload dataset file to backend
  public postFile(fileToUpload: FormData) {
    const SERVER_URL = "/api/upload";
    return this.httpClient. 
    post<any>(SERVER_URL, fileToUpload, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress, data:''};
        case HttpEventType.Response:
          return { status: event.statusText, message:0, data:(event.body.data).substr(1)}; //Substring taken to remove the leading '/' in the response.
        default:
          return { status: event.type, message:0, data:''};
      }
    })
    );
  }

  //method to get recommended algorithms list for an uploaded dataset.
  public getRecommendation(path: string) {
    const SERVER_URL = "/api/recommend";
    let params = new HttpParams().set("filepath",path);
    return this.httpClient. 
    get<any>(SERVER_URL, {
      reportProgress: true,
      observe: 'events',
      params: params
    })
    .pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.DownloadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress, algorithms:'' };
        case HttpEventType.Response:
          return { status: event.statusText, message: 0, algorithms: event.body.algorithms };
        default:
          return { status: event.type, message: 0, algorithms: '' };
      }
    })
    );
  } 

  public preprocessFile(fileToUpload: FormData) {
    const SERVER_URL = "/api/preprocess";
    return this.httpClient. 
    post<any>(SERVER_URL, fileToUpload, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.DownloadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress, data_clean_time:'', alignment_time:''};
        case HttpEventType.Response:
          return { status: event.statusText, 
            message:0, 
            data_clean_time: event.body.data_clean_time, 
            alignment_time:event.body.alignment_time}; 
        default:
          return { status: event.type, message:0, data_clean_time:'', alignment_time:''};
      }
    })
    );
  }



}
