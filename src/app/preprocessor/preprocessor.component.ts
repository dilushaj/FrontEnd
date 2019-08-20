import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-preprocessor',
  templateUrl: './preprocessor.component.html',
  styleUrls: ['./preprocessor.component.scss']
})
export class PreprocessorComponent implements OnInit {
  fileUploadService: FileUploadService;  
  fileToUpload: File;
  form: FormGroup;
  response = { status: undefined, 
              message: undefined, 
              data_clean_time: undefined, 
              alignment_time: undefined };
  
  //constructor
  constructor(private formBuilder: FormBuilder, 
    fileUploadService:FileUploadService,
    private spinner: NgxSpinnerService) { 
    this.fileUploadService = fileUploadService;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      file: ['']
    });
    var response  = { status: '', 
                    message: 0, 
                    data_clean_time: undefined, 
                    alignment_time: undefined };
    this.response = response;
  }

  //get the raw dataset
  handleFileInput(files: FileList) {
    if (files.length > 0) {
    this.fileToUpload = files[0];
    }
  }

  //send dataset file to server and get progress, and clean and alignment times when finished
  onSubmit() {
    const formData = new FormData();
    formData.append('data', this.fileToUpload);
    this.fileUploadService.preprocessFile(formData).subscribe(res => {
      this.response = res;
      this.spinner.show();
      if(this.response.status === "OK") {
        this.spinner.hide();
      }
      console.log(this.response);
    }, error => {
      console.log(error);
    });
  }

}
