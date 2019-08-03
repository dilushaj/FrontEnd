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
  uploadResponse : Object = { status: '', message: '', filePath: '' };

  constructor(private formBuilder: FormBuilder, fileUploadService:FileUploadService) { 
    this.fileUploadService = fileUploadService;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      file: ['']
    });
  }

  //get the raw dataset
  handleFileInput(files: FileList) {
    if (files.length > 0) {
    this.fileToUpload = files[0];
    //this.form.get('data').setValue(this.fileToUpload);
    }
  }

  //send dataset file to server and get progress 
  onSubmit() {
    const formData = new FormData();
    formData.append('data', this.fileToUpload);
    this.fileUploadService.postFile(formData).subscribe(res => {
      this.uploadResponse = res;
      }, error => {
        console.log(error);
      });
  }

}
