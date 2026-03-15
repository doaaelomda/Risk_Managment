import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormater',
  standalone: true, 
})
@Injectable({ providedIn: 'root' })
export class DateFormaterPipe implements PipeTransform {
  transform(value: string, format: string = 'DD/MM/YYYY', locale: string = 'en'): string {
    if (!value) return '';
    moment.locale(locale);
    return moment(value).format(format);
  }
}
