import { LoaderComponent } from './../../../../../libs/shared/shared-ui/src/lib/loader/loader.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-verify',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {

  }
  ngOnInit() {
    this.getToken();
  }
  getToken() {
    const AccessKey = this._activatedRoute.snapshot.queryParamMap.get('token');
    if(AccessKey){
      this._authService.verifyToken(AccessKey).subscribe({
        next: (res) => {
          console.log("res verfiy" , res);

          this._authService.setAccessData(res?.accessKey);
          this._router.navigate(['/welcome']);
        },
        error: (err) => {
          this._router.navigate(['/access-denaid']);
        }
      });
    }else{
      this._router.navigate(['/access-denaid']);
    }
  }
}
