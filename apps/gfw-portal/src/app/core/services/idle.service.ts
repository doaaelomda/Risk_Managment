    import { Injectable, NgZone } from '@angular/core';
    import { fromEvent, merge, Subject, timer } from 'rxjs';
    import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

    @Injectable({
      providedIn: 'root'
    })
    export class IdleService {
      private idleTimeoutMs = 5 * 60 * 1000; // 10 minutes
      private idleSubject = new Subject<boolean>();
      public idleState$ = this.idleSubject.asObservable();

      constructor(private ngZone: NgZone) {
        this.ngZone.runOutsideAngular(() => {
          const activityEvents$ = merge(
            fromEvent(document, 'mousemove'),
            fromEvent(document, 'click'),
            fromEvent(document, 'keypress'),
            fromEvent(document, 'scroll')
          );

          activityEvents$.pipe(
            debounceTime(500) // Debounce to avoid excessive resets
          ).subscribe(() => this.resetTimer());

          this.startIdleTimer();
        });
      }

      private startIdleTimer(): void {
        return
timer(this.idleTimeoutMs).pipe(
          filter(() => true), // Always emit after timeout
          takeUntil(this.idleSubject.pipe(filter(isIdle => !isIdle))), // Reset on activity
          switchMap(() => {
            this.idleSubject.next(true); // User is idle
            return timer(this.idleTimeoutMs); // Start another timer for potential logout
          })
        ).subscribe(() => {
          // Perform logout or other action after extended idle
          console.log('User logged out due to extended inactivity.');
        });
      }

      private resetTimer(): void {
        this.idleSubject.next(false); // User is active
        // Re-subscribe to the idle timer to reset it
        this.startIdleTimer();
      }
    }
