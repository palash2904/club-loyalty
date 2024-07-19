import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    //searchTerm = searchTerm.toLowerCase();order_value

    return value.filter(item => {
      return item.full_name && item.full_name.toLowerCase().includes(searchTerm) || item.full_name && item.full_name.includes(searchTerm)
    });
  }
  //date_raised
}