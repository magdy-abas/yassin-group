import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from '../swiper/swiper.component';
import { TranslationService } from '../../services/translation.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SwiperComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  currentLang: string = 'en';
  products: HookahProduct[] = [];
  testimonials: any[] = [];
  expandedIndex = -1;

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || 'en';

    // Load translations initially
    this.loadTranslations();

    // Listen for language changes and update dynamically
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });

    this.translationService.currentLanguage$.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
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
            imageUrl: 'assets/images/pngwing-com-3-116.png',
            featured: true,
          },
          {
            id: 2,
            title: translations.PRODUCTS.HOOKAH2.TITLE,
            description: translations.PRODUCTS.HOOKAH2.DESCRIPTION,
            imageUrl: 'assets/images/pngwing-com-3-116.png',
            featured: true,
          },
          {
            id: 3,
            title: translations.PRODUCTS.HOOKAH3.TITLE,
            description: translations.PRODUCTS.HOOKAH3.DESCRIPTION,
            imageUrl: 'assets/images/pngwing-com-3-116.png',
            featured: true,
          },
          {
            id: 4,
            title: translations.PRODUCTS.HOOKAH4.TITLE,
            description: translations.PRODUCTS.HOOKAH4.DESCRIPTION,
            imageUrl: 'assets/images/pngwing-com-3-116.png',
            featured: true,
          },
        ];

        this.testimonials = [
          {
            name: 'Magdi Abas',
            image: 'assets/images/customer1.jpg',
            feedback: translations.TESTIMONIALS.CUSTOMER1.FEEDBACK,
          },
          {
            name: 'Ahmed Elsayed',
            image: 'assets/images/customer2.jpg',
            feedback: translations.TESTIMONIALS.CUSTOMER2.FEEDBACK,
          },
          {
            name: 'Maged Ayman',
            image: 'assets/images/customer3.jpg',
            feedback: translations.TESTIMONIALS.CUSTOMER3.FEEDBACK,
          },
        ];
      });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
