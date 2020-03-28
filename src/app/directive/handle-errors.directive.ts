import { Directive } from '@angular/core';

@Directive({
  selector: '[appHandleErrors]'
})
export class HandleErrorsDirective {

  constructor() { 
    console.log(arguments)
  }

}
