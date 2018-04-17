import {Pipe,PipeTransform}  from '@angular/core';

@Pipe({name:"Hour"})
export class HourPipe implements PipeTransform{

    transform(value: number):string{
        
        let result:string;
        let minutes = value%60;
        let hours = Math.floor(value/60);
        
        result = (hours > 0?String(hours)+"h":"")+" " + (minutes > 0?String(minutes)+"m":"");
         
        return result;
         
      
    }

}