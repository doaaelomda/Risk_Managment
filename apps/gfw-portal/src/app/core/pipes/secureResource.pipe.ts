import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'secureResource',
  standalone: true,
  pure: true
})
export class SecureResourcePipe implements PipeTransform {

  constructor(private http: HttpClient) {}

  transform(url: string): Observable<string> {

    if (!url) {
      return new Observable<string>();
    }

    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob))
    );

  }

}
