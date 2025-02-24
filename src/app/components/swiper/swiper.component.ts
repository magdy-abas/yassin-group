import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { TranslationService } from '../../services/translation.service';

// Register Swiper web components
register();

interface Testimonial {
  name: string;
  quote: string;
  image: string;
}

@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements AfterViewInit {
  @ViewChild('swiper') swiperRef!: ElementRef;
  swiper?: Swiper;
  isRtl!: boolean;
  translate = inject(TranslationService);
  testimonials: Testimonial[] = [
    {
      name: 'Magdi Abas',
      quote:
        "I have been using the hookah glass from this company for several months, and I am truly satisfied with its quality. The glass is durable, doesn't easily warp with heat.",
      image: '../../../assets/images/person2.jpg',
    },
    {
      name: 'Ahmed Elsayed',
      quote:
        "The customer service was excellent, and I received my order quickly. The product was exactly as expected. The glass is smooth and flawless, and I haven't had any issues during use.",
      image: '../../../assets/images/person-1.jpg',
    },
    {
      name: 'Maged Ayman',
      quote:
        'I loved the variety of designs this company offers; each piece reflects a unique and exquisite taste. I will definitely continue purchasing your products.',
      image: '../../../assets/images/person2.jpg',
    },
    {
      name: 'Maged Ayman',
      quote:
        'I loved the variety of designs this company offers; each piece reflects a unique and exquisite taste. I will definitely continue purchasing your products.',
      image: '../../../assets/images/person2.jpg',
    },
    {
      name: 'Maged Ayman',
      quote:
        'I loved the variety of designs this company offers; each piece reflects a unique and exquisite taste. I will definitely continue purchasing your products.',
      image: '../../../assets/images/person2.jpg',
    },
    {
      name: 'Maged Ayman',
      quote:
        'I loved the variety of designs this company offers; each piece reflects a unique and exquisite taste. I will definitely continue purchasing your products.',
      image: '../../../assets/images/person2.jpg',
    },
    {
      name: 'Maged Ayman',
      quote:
        'I loved the variety of designs this company offers; each piece reflects a unique and exquisite taste. I will definitely continue purchasing your products.',
      image: '../../../assets/images/person2.jpg',
    },
  ];
  ngOnInit(): void {
    this.isRtl = this.translate.isRTL();
  }
  ngAfterViewInit() {
    // Get the native swiper element
    const swiperEl = this.swiperRef.nativeElement;

    // Access the Swiper instance
    this.swiper = swiperEl.swiper;
  }

  // Custom navigation methods
  goToPrevSlide() {
    this.swiper?.slidePrev();
  }

  goToNextSlide() {
    this.swiper?.slideNext();
  }
}
