import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormatter',
  pure: true
})
export class TimeFormatterPipe implements PipeTransform {

  transform(
    value: number,
    inputUnit: 'seconds' | 'minutes' | 'hours' = 'seconds',
    outputFormat: 'hh:mm' | 'hh:mm:ss' | 'mm:ss' = 'hh:mm'
  ): string {

    if (value == null) return '-';

    let totalSeconds = value;
    switch (inputUnit) {
      case 'minutes':
        totalSeconds = value * 60;
        break;
      case 'hours':
        totalSeconds = value * 3600;
        break;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    switch (outputFormat) {
      case 'hh:mm':
        return `${hours}h ${minutes}m`;
      case 'hh:mm:ss':
        return `${hours}h ${minutes}m ${seconds}s`;
      case 'mm:ss':
        return `${Math.floor(totalSeconds / 60)}m ${seconds}s`;
      default:
        return `${hours}h ${minutes}m`;
    }
  }
}
