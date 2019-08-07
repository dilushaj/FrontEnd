import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  fileUploadService: FileUploadService;  
  fileToUpload: File;
  form: FormGroup;
  recommendResponse = { status: undefined, message: undefined, algorithms: undefined };
  uploadResponse = { status: undefined, message: undefined, data: undefined };

  //constructor 
  constructor(private formBuilder: FormBuilder, fileUploadService:FileUploadService) { 
    this.fileUploadService = fileUploadService;
    
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      file: ['']
    });
    var recommendResponse  = { status: '', message: 0, algorithms: undefined };
    this.recommendResponse = recommendResponse;
    var uploadResponse = { status: '', message: 0, data: undefined };
    this.uploadResponse = uploadResponse;
  }

  //get the raw dataset
  handleFileInput(files: FileList) {
    if (files.length > 0) {
    this.fileToUpload = files[0];
    }
  }

  //send dataset file to server and get progress 
  onSubmit() {
    const formData = new FormData();
    formData.append('data', this.fileToUpload);
    this.fileUploadService.postFile(formData).subscribe(res => {
      this.uploadResponse = res;
      if(this.uploadResponse.status==="Created"){
        this.recommend(this.uploadResponse.data)
    }
    }, error => {
      console.log(error);
    });
  }

  //obtain recommended algorithhms for the uploaded dataset from server.
  recommend(path: string) {
    this.fileUploadService.getRecommendation(path).subscribe(res =>{
      this.recommendResponse = res;
    },error => {
      console.log(error);
    });
  }

}
