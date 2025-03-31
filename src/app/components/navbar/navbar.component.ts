// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentLang: string = 'en';

  constructor(
    private translationService: TranslationService,
    private router: Router
  ) {}
  navigateToSection(sectionId: string) {
    if (this.router.url.startsWith('/home')) {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -20;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/home'], { fragment: sectionId });
    }
  }

  navigateToProductsSection() {
    if (this.router.url.startsWith('/products')) {
      const el = document.getElementById('products-grid');
      if (el) {
        const yOffset = -120;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/products'], { fragment: 'products-grid' });
    }
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      this.currentLang = savedLang;
      this.switchLang(savedLang);
    }

    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  switchLang(lang: string) {
    this.translationService.setLanguage(lang);
  }
}
