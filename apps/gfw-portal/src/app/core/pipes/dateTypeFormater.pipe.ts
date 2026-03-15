import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTypeFormater',
  standalone: true,
})
@Injectable({
  providedIn: 'root'
})
export class DateTypeFormaterPipe implements PipeTransform {
  transform(value: string | null | undefined, format: string = '', locale: string = 'en'): Date | null {
    if (!value) return null;
    moment.locale(locale);

    if (format) {
      const parsed = moment(value, format, true);
      return parsed.isValid() ? parsed.toDate() : null;
    }

    const parsed = moment(value);
    return parsed.isValid() ? parsed.toDate() : null;
  }
}
