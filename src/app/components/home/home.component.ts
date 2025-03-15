import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from '../swiper/swiper.component';
import { ReactiveFormsModule } from '@angular/forms';

interface HookahProduct {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    HeroSectionComponent,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SwiperComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentLang: string = 'en';
  products: HookahProduct[] = [];
  testimonials: any[] = [];
  expandedIndex = -1;
  email: string = 'yassingroup2010@gmail.com';
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.currentLang = this.translate.currentLang || 'en';

    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.loadTranslations();

    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
      this.contactForm.reset();
      this.submitSuccess = false;
      this.submitError = null;
      this.isSubmitting = false;
    });

    this.translationService.currentLanguage$.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
  }

  ngOnInit() {
    emailjs.init('gFdBihYV4hyk0sDbX');
  }

  private loadTranslations() {
    this.translate
      .get(['PRODUCTS', 'TESTIMONIALS'])
      .subscribe((translations) => {
        this.products = [
          {
            id: 1,
            title: translations.PRODUCTS.HOOKAH1.TITLE,
            description: translations.PRODUCTS.HOOKAH1.DESCRIPTION,
            imageUrl: 'assets/images/s1.webp',
            featured: true,
          },
          {
            id: 2,
            title: translations.PRODUCTS.HOOKAH2.TITLE,
            description: translations.PRODUCTS.HOOKAH2.DESCRIPTION,
            imageUrl: 'assets/images/s2.webp',
            featured: true,
          },
          {
            id: 3,
            title: translations.PRODUCTS.HOOKAH3.TITLE,
            description: translations.PRODUCTS.HOOKAH3.DESCRIPTION,
            imageUrl: 'assets/images/s3.webp',
            featured: true,
          },
          {
            id: 4,
            title: translations.PRODUCTS.HOOKAH4.TITLE,
            description: translations.PRODUCTS.HOOKAH4.DESCRIPTION,
            imageUrl: 'assets/images/s4.webp',
            featured: true,
          },
        ];
      });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = null;

    const formData = this.contactForm.value;

    const templateParams = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      to_email: this.email,
    };

    try {
      const response = await emailjs.send(
        'service_jk4q5xr',
        'template_aehtown',
        templateParams
      );
      console.log('Email sent successfully:', response);
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.contactForm.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      this.isSubmitting = false;
      this.submitError = 'Failed to send email: ' + (error || 'Unknown error');
    }
  }
}
