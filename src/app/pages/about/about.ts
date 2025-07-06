import { Component, Inject, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Use @ViewChildren to get references to all .logo-category elements from the template
  @ViewChildren('logoCategory') logoCategories!: QueryList<ElementRef>;

  // A map to store the setTimeout timers keyed by the HTML element
  private pressTimers: Map<HTMLElement, any> = new Map();
  // 500 milliseconds long press
  private readonly LONG_PRESS_THRESHOLD = 500;
  // Checking if device is touchscreen
  private isTouchDevice = false;

  // Store references to bound event handlers for proper removal in ngOnDestroy
  private boundTouchStartHandlers: Map<HTMLElement, (event: TouchEvent) => void> = new Map();
  private boundTouchEndHandlers: Map<HTMLElement, () => void> = new Map();
  private boundTouchCancelHandlers: Map<HTMLElement, () => void> = new Map();
  private boundBodyTouchStartHandler: (event: TouchEvent) => void;


  // Inject PLATFORM_ID to determine the execution environment
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private titleService: Title,
              private metaService: Meta
  ) {
    this.boundBodyTouchStartHandler = this.handleBodyTouchStart.bind(this);
  }

  ngOnInit(): void {
    // Only check for touch device capabilities if running in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
    }

    // START OF SEO CONFIGURATION
    // Page Title (<title> tag)
    this.titleService.setTitle('About | Verveance');

    // Meta Description (<meta name="description">)
    this.metaService.updateTag({name: 'description', content: "Learn about Kram, the founder of Verveance. Discover his journey in web and software development, core philosophies of transparency and excellence, and expertise in Angular, Node.js, and AI-powered digital solutions." });

    // Open Graph Meta Tags (for social media shares)
    this.metaService.updateTag({ property: 'og:title', content: 'About Kram - Full-Stack Developer & Verveance Founder' });
    this.metaService.updateTag({ property: 'og:description', content: 'Learn about Kram, the founder of Verveance. Discover his journey in web and software development, core philosophies of transparency and excellence...' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://www.verveance.com/assets/logoseo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://www.verveance.com/about' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card Meta Tags (for Twitter shares)
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'About Kram - Verveance Founder' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Learn about Kram, the founder of Verveance...' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://www.verveance.com/assets/avatar.webp' });
    // this.metaService.updateTag({ name: 'twitter:site', content: '@YourTwitterHandle' }); // Uncomment and replace with Twitter handle

    this.metaService.addTag({ rel: 'canonical', href: 'https://www.verveance.com/about' });
    // END OF SEO CONFIGURATION
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.isTouchDevice) {
      this.logoCategories.forEach(categoryElRef => {
        const categoryElement = categoryElRef.nativeElement;

        // Create bound handlers for each element to ensure correct context and for proper removal
        const touchStartHandler = (event: TouchEvent) => {
          this.clearActiveCategories();
          this.startPressTimer(categoryElement);
          // event.preventDefault(); // Uncomment to prevent default touch behavior like scrolling
        };
        const touchEndHandler = () => {
          this.clearPressTimer(categoryElement);
        };
        const touchCancelHandler = () => {
          this.clearPressTimer(categoryElement);
          categoryElement.classList.remove('active');
        };

        // Store bound handlers
        this.boundTouchStartHandlers.set(categoryElement, touchStartHandler);
        this.boundTouchEndHandlers.set(categoryElement, touchEndHandler);
        this.boundTouchCancelHandlers.set(categoryElement, touchCancelHandler);

        // Add event listeners
        categoryElement.addEventListener('touchstart', touchStartHandler);
        categoryElement.addEventListener('touchend', touchEndHandler);
        categoryElement.addEventListener('touchcancel', touchCancelHandler);
      });

      // Add a global listener to the document body to clear active states when tapping outside a category
      document.body.addEventListener('touchstart', this.boundBodyTouchStartHandler);
    }

      if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Kram",
        "jobTitle": "Founder & Lead Developer",
        "url": "https://www.verveance.com/about",
        "image": "https://www.verveance.com/assets/avatar.webp",
        "description": "Kram is the founder of Verveance, specializing in full-stack web and software development, AI integration, and custom digital solutions for SMEs worldwide.",
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Mapúa University"
        },
        "worksFor": {
          "@type": "Organization",
          "name": "Verveance",
          "url": "https://www.verveance.com",
          "logo": "https://www.verveance.com/assets/logoseo.webp"
        },
        "sameAs": [
          "https://linkedin.com/in/your-kram-linkedin-profile",
          "https://github.com/your-kram-github-profile",
          "https://twitter.com/your-kram-twitter-handle"
        ],
        "knowsAbout": [
          "Web Application Development",
          "Custom Software Development",
          "Frontend Frameworks (React, Angular, Next.js)",
          "Backend APIs (Node.js, NestJS, Express)",
          "NoSQL Databases (MongoDB, Firebase)",
          "Cloud Hosting and Deployment",
          "AI Integration",
          "UI/UX Design",
          "Version Control",
          "DevOps"
        ],
        "knowsLanguage": [
          {
            "@type": "Language",
            "name": "English"
          }
        ],
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.verveance.com/about"
        }
      });
      document.head.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    // Clear all pending long-press timers to prevent memory leaks
    this.pressTimers.forEach(timer => clearTimeout(timer));

    // Remove event listeners only if they were attached
    if (isPlatformBrowser(this.platformId) && this.isTouchDevice) {
      this.logoCategories.forEach(categoryElRef => {
        const categoryElement = categoryElRef.nativeElement;

        // Retrieve and remove the function instances that were added
        const touchStartHandler = this.boundTouchStartHandlers.get(categoryElement);
        const touchEndHandler = this.boundTouchEndHandlers.get(categoryElement);
        const touchCancelHandler = this.boundTouchCancelHandlers.get(categoryElement);

        if (touchStartHandler) categoryElement.removeEventListener('touchstart', touchStartHandler);
        if (touchEndHandler) categoryElement.removeEventListener('touchend', touchEndHandler);
        if (touchCancelHandler) categoryElement.removeEventListener('touchcancel', touchCancelHandler);
      });

      // Remove the global body touch listener
      document.body.removeEventListener('touchstart', this.boundBodyTouchStartHandler);
    }
  }

  private startPressTimer(element: HTMLElement): void {
    this.clearPressTimer(element);
    const timer = setTimeout(() => {
      element.classList.add('active');
    }, this.LONG_PRESS_THRESHOLD);
    this.pressTimers.set(element, timer);
  }

  private clearPressTimer(element: HTMLElement): void {
    const timer = this.pressTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      this.pressTimers.delete(element);
    }
  }

  private clearActiveCategories(): void {
    this.logoCategories.forEach(catElRef => {
      catElRef.nativeElement.classList.remove('active');
    });
  }

  private handleBodyTouchStart = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.logo-category')) {
      this.clearActiveCategories();
    }
  };

  isMenuOpen: boolean = false;
}