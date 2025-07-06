import { Component, HostListener, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="back-to-top-btn" [class.show]="showButton" (click)="scrollToTop()">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  `,
  styleUrls: ['./back-to-top.scss']
})

export class BackToTopComponent implements OnInit, OnDestroy {
  showButton: boolean = false;
  private routerSubscription: Subscription | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.onWindowScroll();

      this.routerSubscription = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.showButton = false;

        setTimeout(() => {
          this.onWindowScroll();
        }, 100);
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentScrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const totalDocumentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = totalDocumentHeight - viewportHeight;

      const threshold = Math.max(0, scrollableHeight * 0.50);

      this.showButton = currentScrollPosition >= threshold;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}