// src/app/services/translation.service.ts

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Database, set, ref, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private availableLanguages = ['en', 'ar'];

  constructor(
    private translate: TranslateService,
    private auth: Auth,
    private db: Database
  ) {
    this.initializeLanguage();
  }

  private async initializeLanguage() {
    // Set available languages
    this.translate.addLangs(this.availableLanguages);
    this.translate.setDefaultLang('en');

    // Try to get language from localStorage first
    const savedLang = localStorage.getItem('selectedLanguage');

    if (savedLang && this.availableLanguages.includes(savedLang)) {
      await this.setLanguage(savedLang);
      return;
    }

    const user = this.auth.currentUser;
    if (user) {
      try {
        const userLangRef = ref(this.db, `users/${user.uid}/language`);
        const snapshot = await get(userLangRef);
        const userLang = snapshot.val();

        if (userLang && this.availableLanguages.includes(userLang)) {
          await this.setLanguage(userLang);
          return;
        }
      } catch (error) {
        console.error('Error getting language from Firebase:', error);
      }
    }

    // If no saved preference, use browser language or default to English
    const browserLang = this.translate.getBrowserLang();
    const defaultLang =
      browserLang && this.availableLanguages.includes(browserLang)
        ? browserLang
        : 'en';

    await this.setLanguage(defaultLang);
  }

  async setLanguage(lang: string) {
    if (!this.availableLanguages.includes(lang)) {
      console.error('Language not supported:', lang);
      return;
    }

    // Update TranslateService
    this.translate.use(lang);

    // Update BehaviorSubject
    this.currentLanguageSubject.next(lang);

    // Update localStorage
    localStorage.setItem('selectedLanguage', lang);

    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // If user is logged in, save to Firebase
    const user = this.auth.currentUser;
    if (user) {
      try {
        const userLangRef = ref(this.db, `users/${user.uid}/language`);
        await set(userLangRef, lang);
      } catch (error) {
        console.error('Error saving language to Firebase:', error);
      }
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  isRTL(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }

  getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  // Helper method to get translated text programmatically
  async getTranslation(key: string, params?: Object): Promise<string> {
    return new Promise((resolve) => {
      this.translate.get(key, params).subscribe((res: string) => {
        resolve(res);
      });
    });
  }

  // Helper method to get multiple translations at once
  async getTranslations(keys: string[]): Promise<{ [key: string]: string }> {
    return new Promise((resolve) => {
      this.translate.get(keys).subscribe((res: { [key: string]: string }) => {
        resolve(res);
      });
    });
  }
}

// Usage example in a component:
/*
import { Component } from '@angular/core';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <select
      [value]="translationService.getCurrentLanguage()"
      (change)="switchLanguage($event)"
      class="form-select">
      <option value="en">English</option>
      <option value="ar">عربي</option>
    </select>
  `
})
export class LanguageSwitcherComponent {
  constructor(public translationService: TranslationService) {}

  async switchLanguage(event: any) {
    await this.translationService.setLanguage(event.target.value);
  }
}
*/
