import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, ElementRef, QueryList, ViewChildren } from '@angular/core'; // **FIXED: Added ElementRef, QueryList, ViewChildren**
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

interface AddonItem {
  title: string;
  description: string;
  isOpen: boolean;
  calculatedHeight?: number;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})

export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('overviewCard') overviewCards!: QueryList<ElementRef>;

  private pressTimers: Map<HTMLElement, any> = new Map();
  private readonly LONG_PRESS_THRESHOLD = 500;
  private isTouchDevice = false;

  private boundTouchStartHandlers: Map<HTMLElement, (event: TouchEvent) => void> = new Map();
  private boundTouchEndHandlers: Map<HTMLElement, () => void> = new Map();
  private boundTouchCancelHandlers: Map<HTMLElement, () => void> = new Map();
  private boundBodyTouchStartHandler: (event: TouchEvent) => void;

  showOverviewGrid: boolean = false;
  showFullstackGrid: boolean = false;
  showFullstackSvg: boolean = false;

  showSoftwareDevGrid: boolean = false;
  showSoftwareDevSvg: boolean = false;

  showDeploymentHostingGrid: boolean = false;
  showDeploymentHostingSvg: boolean = false;

  addons: AddonItem[] = [
    {
      title: 'Non-Automated Email Consultation (FREE)',
      description: "Get personalized advice and insights directly from Verveance through a complimentary, non-automated email consultation. I'll answer your specific questions to help you clarify your project needs and outline potential solutions without any obligation. Reply may take more than a couple of days.",
      isOpen: false
    },
    {
      title: 'Support, Update, Maintenance (SUM)',
      description: "Ensure your digital assets remain secure and updated with our comprehensive maintenance and dedicated support packages. This includes security patches and bug fixes, provided on-request by you. We're committed to helping your application run smoothly by addressing specific issues and applying necessary updates as needed.",
      isOpen: false
    },
    {
      title: 'Deployment and Hosting Management',
      description: "We handle the complexities of launching and managing your web application, including secure server setup, domain configurations, continuous integration/delivery pipelines, and performance monitoring. Focus on promoting your application while we ensure seamless, high-availability operations. Should you choose to host and deploy with us, you will get a business-appropriate SSL certificate free of charge.",
      isOpen: false
    },
    {
      title: 'Comprehensive SEO Package',
      description: "While fundamental SEO practices are integrated into all our web development projects, this optional package provides a more in-depth approach to significantly boost your online visibility and organic search rankings. It covers comprehensive keyword research, advanced technical SEO audits, strategic on-page optimization, and data-driven content recommendations to drive targeted traffic to your site.",
      isOpen: false
    },
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.boundBodyTouchStartHandler = this.handleBodyTouchStart.bind(this);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
    }

    // START OF SEO CONFIGURATION (existing)
    // Page Title (<title> tag)
    this.titleService.setTitle('Services | Verveance');

    // Meta Description (<meta name="description">)
    this.metaService.updateTag({ name: 'description', content: "Verveance develops custom digital solutions including custom website and software development. We leverage full-stack expertise, AI integration, PWAs, API integrations, and cloud deployment to transform your business across diverse industries." });
    
    // Open Graph Meta Tags (for social media shares)
    this.metaService.updateTag({ property: 'og:title', content: 'Custom Web & Software Development Services | Verveance' });
    this.metaService.updateTag({ property: 'og:description', content: 'Verveance crafts bespoke digital solutions including custom website and software development. We leverage full-stack expertise, AI integration, PWAs, API integrations, and cloud deployment...' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://www.verveance.com/assets/logoseo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://www.verveance.com/services' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card Meta Tags (for Twitter shares)
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Custom Web & Software Development Services | Verveance' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Verveance crafts bespoke digital solutions...' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://www.verveance.com/assets/logoseo.webp' });
    // this.metaService.updateTag({ name: 'twitter:site', content: '@YourTwitterHandle' }); // Uncomment and replace with Twitter handle

    this.metaService.addTag({ rel: 'canonical', href: 'https://www.verveance.com/services' });
    //END OF SEO CONFIGURATION

    if (!isPlatformBrowser(this.platformId)) {
      this.showOverviewGrid = true;
      this.showFullstackGrid = true;
      this.showFullstackSvg = true;
      this.showSoftwareDevGrid = true;
      this.showSoftwareDevSvg = true;
      this.showDeploymentHostingGrid = true;
      this.showDeploymentHostingSvg = true;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('ServicesComponent: ngAfterViewInit triggered in BROWSER. Ready for interactions.');

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const setupIntersectionObserver = (
        selector: string,
        propertyToShow: keyof ServicesComponent
      ) => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  (this as any)[propertyToShow] = true;
                  this.cdr.detectChanges();
                }, 0);
                obs.unobserve(entry.target);
              }
            });
          }, observerOptions);
          observer.observe(element);
        }
      };

      setupIntersectionObserver('.overview-cards-grid', 'showOverviewGrid');
      setupIntersectionObserver('#fullstack-webapp .details-content-grid', 'showFullstackGrid');
      setupIntersectionObserver('#fullstack-webapp .details-svg-icon', 'showFullstackSvg');
      setupIntersectionObserver('#software-development .details-content-grid', 'showSoftwareDevGrid');
      setupIntersectionObserver('#software-development .details-svg-icon', 'showSoftwareDevSvg');

      setupIntersectionObserver('#deployment-hosting .details-content-grid', 'showDeploymentHostingGrid');
      setupIntersectionObserver('#deployment-hosting .details-svg-icon', 'showDeploymentHostingSvg');

      if (this.isTouchDevice) {
        this.overviewCards.forEach(cardElRef => {
          const cardElement = cardElRef.nativeElement;

          const touchStartHandler = (event: TouchEvent) => {
            this.clearActiveCards();
            this.startPressTimer(cardElement);
          };
          const touchEndHandler = () => {
            this.clearPressTimer(cardElement);
          };
          const touchCancelHandler = () => {
            this.clearPressTimer(cardElement);
            cardElement.classList.remove('active');
          };

          this.boundTouchStartHandlers.set(cardElement, touchStartHandler);
          this.boundTouchEndHandlers.set(cardElement, touchEndHandler);
          this.boundTouchCancelHandlers.set(cardElement, touchCancelHandler);

          cardElement.addEventListener('touchstart', touchStartHandler);
          cardElement.addEventListener('touchend', touchEndHandler);
          cardElement.addEventListener('touchcancel', touchCancelHandler);
        });

        document.body.addEventListener('touchstart', this.boundBodyTouchStartHandler);
      }

    } else {
      console.log('ServicesComponent: ngAfterViewInit skipped in SSR environment (as expected).');
    }

    if (isPlatformBrowser(this.platformId)) {
    const existing = document.getElementById('json-ld-services');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'json-ld-services';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://www.verveance.com/services",
          "name": "Services That Power Your Vision | Verveance",
          "description": "We engineer robust web applications and intelligent software solutions, meticulously tailored to transform your ambitious ideas into tangible, impactful digital realities.",
          "url": "https://www.verveance.com/services",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Verveance",
            "url": "https://www.verveance.com/"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://www.verveance.com/#organization",
          "name": "Verveance",
          "url": "https://www.verveance.com/",
          "logo": "https://www.verveance.com/assets/logoseo.webp",
          "sameAs": [
            "https://linkedin.com/yourcompanyprofile"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "mailto:contact@verveance.com"
          },
          "areaServed": [
            { "@type": "Place", "name": "Philippines" },
            { "@type": "Place", "name": "United States" },
            { "@type": "Place", "name": "Canada" },
            { "@type": "Place", "name": "United Kingdom" },
            { "@type": "Place", "name": "Australia" },
            { "@type": "Place", "name": "Germany" },
            { "@type": "Place", "name": "Singapore" },
            { "@type": "Place", "name": "Saudi Arabia" },
            { "@type": "Place", "name": "United Arab Emirates" },
            { "@type": "Place", "name": "Worldwide" }
          ]
        },
        {
          "@type": "Service",
          "@id": "https://www.verveance.com/services#fullstack-webapp",
          "name": "Full-Stack Web App Development",
          "description": "Building responsive, high-performance websites and web applications tailored to your business needs, from simple landing pages to complex enterprise solutions using modern frameworks.",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.verveance.com/services"
          },
          "serviceType": "WebSiteDevelopingService",
          "provider": {
            "@id": "https://www.verveance.com/#organization"
          },
          "url": "https://www.verveance.com/services#fullstack-webapp",
          "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "Variable",
            "url": "https://www.verveance.com/contact",
            "availability": "https://schema.org/InStock"
          },
          "inLanguage": "en",
          "audience": {
            "@type": "Audience",
            "audienceType": "Small and Medium-sized Enterprises"
          }
        },
        {
          "@type": "Service",
          "@id": "https://www.verveance.com/services#software-development",
          "name": "Custom Software Development",
          "description": "Off-the-shelf solutions rarely fit perfectly. Verveance crafts bespoke software applications designed precisely to your unique operational challenges and strategic goals...",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.verveance.com/services"
          },
          "serviceType": "SoftwareDevelopmentService",
          "provider": {
            "@id": "https://www.verveance.com/#organization"
          },
          "url": "https://www.verveance.com/services#software-development",
          "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "Variable",
            "url": "https://www.verveance.com/contact",
            "availability": "https://schema.org/InStock"
          },
          "inLanguage": "en",
          "audience": {
            "@type": "Audience",
            "audienceType": "Small and Medium-sized Enterprises"
          }
        },
        {
          "@type": "Service",
          "@id": "https://www.verveance.com/services#deployment-hosting",
          "name": "Deployment & Hosting",
          "description": "Bringing your application to life requires a robust and reliable infrastructure. Verveance ensures seamless deployment, secure hosting, and continuous performance for all your digital assets...",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.verveance.com/services"
          },
          "serviceType": "SoftwareHostingService",
          "provider": {
            "@id": "https://www.verveance.com/#organization"
          },
          "url": "https://www.verveance.com/services#deployment-hosting",
          "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "Variable",
            "url": "https://www.verveance.com/contact",
            "availability": "https://schema.org/InStock"
          },
          "inLanguage": "en",
          "audience": {
            "@type": "Audience",
            "audienceType": "Small and Medium-sized Enterprises"
          }
        }
      ]
    });
    document.head.appendChild(script);
  }
  }

  ngOnDestroy(): void {
    this.pressTimers.forEach(timer => clearTimeout(timer));

    if (isPlatformBrowser(this.platformId) && this.isTouchDevice) {
      this.overviewCards.forEach(cardElRef => {
        const cardElement = cardElRef.nativeElement;

        const touchStartHandler = this.boundTouchStartHandlers.get(cardElement);
        const touchEndHandler = this.boundTouchEndHandlers.get(cardElement);
        const touchCancelHandler = this.boundTouchCancelHandlers.get(cardElement);

        if (touchStartHandler) cardElement.removeEventListener('touchstart', touchStartHandler);
        if (touchEndHandler) cardElement.removeEventListener('touchend', touchEndHandler); 
        if (touchCancelHandler) cardElement.removeEventListener('touchcancel', touchCancelHandler);
      });

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

  private clearActiveCards(): void {
    this.overviewCards.forEach(cardElRef => {
      this.clearPressTimer(cardElRef.nativeElement);
      cardElRef.nativeElement.classList.remove('active');
    });
  }

  private handleBodyTouchStart = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.overview-card-item')) {
      this.clearActiveCards();
    }
  };

  toggleAddon(addonToToggle: AddonItem, event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      event.stopPropagation();

      this.addons.forEach(item => {
        if (item !== addonToToggle && item.isOpen) {
          item.isOpen = false;
          item.calculatedHeight = 0;
        }
      });

      addonToToggle.isOpen = !addonToToggle.isOpen;

      if (addonToToggle.isOpen) {
        setTimeout(() => {
          const panelElement = document.getElementById(`desc-${this.addons.indexOf(addonToToggle)}`);
          if (panelElement) {
            addonToToggle.calculatedHeight = panelElement.scrollHeight + 30;
            this.cdr.detectChanges();
          }
        }, 0);
      } else {
        addonToToggle.calculatedHeight = 0;
      }
    }
  }
}