import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
//import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient,) { }

  public postFile(fileToUpload: FormData) {
    
    const DJANGO_SERVER = "/api/upload";
    
    

    return this.httpClient. 
    post<any>(DJANGO_SERVER, fileToUpload, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;

        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );

  }

}
