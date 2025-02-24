// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    // Get saved language on component init
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
