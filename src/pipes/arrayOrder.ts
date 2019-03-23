import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: "sort" // use for sort:asc or :desc ascending or descending
  })
  
export class ArraySortPipe implements PipeTransform {
    transform(array: Array<string>, args: string): Array<string> {
      if (args&&args[0]&&args[0].toLowerCase()=='desc')
        return array.reverse()
      else return array.sort()
      
      
    }
  }