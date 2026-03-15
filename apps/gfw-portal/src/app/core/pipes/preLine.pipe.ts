import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2BrPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value !== 'string') {
      return String(value);
    }

    return value.replace(/\n/g, '<br/>');
  }
}
