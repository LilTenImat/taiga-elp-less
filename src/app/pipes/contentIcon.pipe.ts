import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { ObjectTypeEnum } from '../course/content/content';

/**
 * Sanitize HTML
 */
@Pipe({
  name: 'cIcon'
})
export class ContentIconPipe implements PipeTransform {

  constructor(protected _sanitizer: DomSanitizer) {
  }

  transform(value?: ObjectTypeEnum): string {
    switch(value){
        case ObjectTypeEnum.ARTICLE: return 'article';
        case ObjectTypeEnum.QUIZ: return 'quiz';
        case ObjectTypeEnum.VIDEO: return 'play_circle';
        case ObjectTypeEnum.LIBRARY_MATERIALS: return 'library_books';
        default: return 'description';
    }
  }
}