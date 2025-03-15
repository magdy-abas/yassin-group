import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { TranslationService } from '../../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

// Register Swiper web components
register();

@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swiper') swiperRef!: ElementRef;
  swiper?: Swiper;
  translate = inject(TranslationService);
  isLoading: boolean = true;
  private langChangeSubscription?: Subscription;

  swiperBreakpoints = {
    0: { slidesPerView: 1, spaceBetween: 10 },
    768: { slidesPerView: 2, spaceBetween: 15 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
  };

  ngOnInit(): void {
    this.translate.currentLanguage$.subscribe(() => {
      this.isLoading = false;
    });

    this.langChangeSubscription = this.translate.currentLanguage$.subscribe(
      () => {
        this.refreshSwiper();
      }
    );
  }

  ngAfterViewInit() {
    this.initializeSwiper();
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }

    if (this.swiper) {
      this.swiper.destroy();
    }
  }
  initializeSwiper() {
    const swiperEl = this.swiperRef.nativeElement;
    this.swiper = swiperEl.swiper;

    setTimeout(() => {
      this.swiper?.update();
    }, 0);
  }

  refreshSwiper() {
    if (this.swiper) {
      setTimeout(() => {
        this.swiper?.update();
      }, 0);
    }
  }

  goToPrevSlide() {
    this.swiper?.slidePrev();
  }

  goToNextSlide() {
    this.swiper?.slideNext();
  }
}
