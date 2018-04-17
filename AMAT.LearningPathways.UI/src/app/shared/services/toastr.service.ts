import { Injectable } from '@angular/core';
import { IToastrService } from './IToastrService';
declare let toastr: any;

@Injectable()
export class ToastrService implements IToastrService {


  constructor() { }

  success(message: string, title?: string): void {

    toastr.options = {
      "closeButton": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "1000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    toastr.success(message, title);


  }
  error(message: string, title?: string): void {
    toastr.options = {
      "closeButton": true,
    }
    toastr.error(message, title);

  }
  warning(message: string, title?: string): void {
    toastr.options = {
      "closeButton": true,
    }
    toastr.warning(message, title);

  }
  info(message: string, title?: string): void {
    toastr.options = {
      "closeButton": true,
    }
    toastr.info(message, title);

  }


}
