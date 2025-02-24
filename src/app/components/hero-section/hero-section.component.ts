import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from './../../services/translation.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TranslateModule, NgIf],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  currentLang: string = 'en';
  private langSubscription!: Subscription;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    const backgroundImg = new Image();
    backgroundImg.src = '../../../assets/images/Background.webp';

    const hookahImg = new Image();
    hookahImg.src = '../../../assets/images/hookah.webp';

    this.langSubscription = this.translationService.currentLanguage$.subscribe(
      (lang) => {
        this.currentLang = lang;
      }
    );
  }
  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
