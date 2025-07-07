import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})

export class ContactComponent implements OnInit {

  @ViewChild('emptyspace') emptyspace!: ElementRef;

  emailConsultationForm!: FormGroup;
  developmentInquiryForm!: FormGroup

  activeFormType: 'emailConsultation' | 'developmentInquiry' | null = null;
  animateForm: boolean = false;

  isLoading: boolean = false;
  showNotificationModal: boolean = false;
  notificationMessage: string = '';
  isSuccessNotification: boolean = true;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.emailConsultationForm = this.fb.group({
      name: ['', Validators.required],
      organization: [''],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

    // Initialize Development Inquiry Form
    this.developmentInquiryForm = this.fb.group({
      name: ['', Validators.required],
      organization: [''],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required], // Can be 'Project Title'
      projectType: ['', Validators.required], // For the radio buttons
      message: ['', Validators.required]
    });

    // --- START OF SEO CONFIGURATION ---
    // Page Title (<title> tag)
    this.titleService.setTitle('Contact Us | Verveance');
    
    // Meta Description (<meta name="description">)
    this.metaService.updateTag({ name: 'description', content: 'Get in touch with Verveance for custom web and software development inquiries, support, or consultations. We are here to help you bring your digital ideas to reality.' });
    
    // Open Graph Meta Tags (for social media shares)
    this.metaService.updateTag({ property: 'og:title', content: 'Contact Verveance for Digital Solutions' });
    this.metaService.updateTag({ property: 'og:description', content: 'Reach out to Verveance for custom web and software development, support, or free consultations.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://www.verveance.com/assets/logoseo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://www.verveance.com/contact' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card Meta Tags (for Twitter shares)
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Contact Verveance' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Reach out to Verveance for custom web and software development solutions.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://www.verveance.com/assets/logoseo.webp' });
    // this.metaService.updateTag({ name: 'twitter:site', content: '@YourTwitterHandle' }); // Uncomment and replace with Twitter handle

    this.metaService.addTag({ rel: 'canonical', href: 'https://www.verveance.com/contact' });
    // --- END OF SEO CONFIGURATION ---
  }

  startEmailConsultation(): void {
    this.activeFormType = 'emailConsultation';
    this.animateForm = false;
    this.emailConsultationForm.reset();
    this.emailConsultationForm.patchValue({ subject: '(Replace with Topic) - Email Consultation' });
    requestAnimationFrame(() => {
      this.animateForm = true;
      this.scrollToForm();
    });
  }

  startDevelopmentInquiry(): void {
    this.activeFormType = 'developmentInquiry';
    this.animateForm = false;
    this.developmentInquiryForm.reset();
    this.developmentInquiryForm.patchValue({ subject: '(Replace with Project) - Development Inquiry' });
    requestAnimationFrame(() => {
      this.animateForm = true;
      this.scrollToForm();
    });
  }

  scrollToForm(): void {
    if (isPlatformBrowser(this.platformId) && this.emptyspace) {
      setTimeout(() => {
        if (this.emptyspace.nativeElement) {
          this.emptyspace.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  onSubmit(formType: 'emailConsultation' | 'developmentInquiry'): void {
    let formToSubmit: FormGroup;
    let successMessage: string;

    if (formType === 'emailConsultation') {
      formToSubmit = this.emailConsultationForm;
      successMessage = 'Thank you for your consultation inquiry! We will get back to you shortly.';
    } else {
      formToSubmit = this.developmentInquiryForm;
      successMessage = 'Thank you for your development inquiry! We will review your project and be in touch.';
    }

    if (formToSubmit.valid) {
      this.isLoading = true; // Set loading to true

      this.contactService.submitContactForm(formToSubmit.value).subscribe({
        next: (response) => {
          console.log('Backend response:', response);
          this.showModal(true, successMessage); // Show success modal
          
          formToSubmit.reset();
          this.activeFormType = null;
          this.animateForm = false;
          this.isLoading = false; // Set loading to false on success
        },
        error: (error) => {
          console.error('Error submitting form to backend:', error);
          this.showModal(false, 'Failed to send message. Please try again later. If the problem persists, please contact us directly at contact@verveance.com'); // Show error modal

          this.isLoading = false; // Set loading to false on error
        }
      });

    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      formToSubmit.markAllAsTouched();
    }
  }

  // --- START OF NEW MODAL METHODS ---
  showModal(isSuccess: boolean, message: string): void {
    this.isSuccessNotification = isSuccess;
    this.notificationMessage = message;
    this.showNotificationModal = true;
  }

  closeModal(): void {
    this.showNotificationModal = false;
    this.notificationMessage = '';
  }
}
