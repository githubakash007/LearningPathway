import { Component, OnInit } from '@angular/core';
import { IEmployeeDetails } from '../../model/fileupload.interface'
import { SuperAdminService } from '../../../super-admin/services/superAdmin.service'
import { NotificationService } from '../../../shared/services/notification.service';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  excelJsonHeader: string[] = null;
  excelJsonData: IEmployeeDetails[] = null;
  showSubmitButton: boolean = false;



  constructor(private _superAdminService: SuperAdminService, private _toastr: NotificationService) { }

  ngOnInit() {
  }

  arrayBuffer: any;
  file: File = null;
  incomingFile(event) {
    this.clearVariables();
    this.file = event.target.files[0];
  }

  uploadFile() {

    if (this.file != undefined && this.file.name === 'LP_Employee_Upload.xlsx') {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.excelJsonHeader = this.get_header_row(worksheet);
        this.excelJsonData = XLSX.utils.sheet_to_json(worksheet);
        this.showSubmitButton = true;
      }
      fileReader.readAsArrayBuffer(this.file);
    }
    else {
      alert('Please choose the valid file and then proceed...!');

    }
  }

  get_header_row(sheet: any) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
      var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if (cell && cell.t) hdr = (<any>XLSX.utils).format_cell(cell);
      headers.push(hdr);
    }
    return headers;
  }

  onSubmit(e: any): void {
    this._superAdminService.submitFileUpload(this.excelJsonData, this.processResult.bind(this));
  }

  processResult(result: boolean): void {
    if (result === true) {
      this._toastr.success("File uploaded successfully !");
      this.clearVariables();
    }
    else {
      this._toastr.error(`File upload failed. Please contact the support team !!`);
    }
  }

  clearVariables(): void {
    this.excelJsonHeader = null;
    this.excelJsonData = null;
    this.showSubmitButton = false;
  }
}
