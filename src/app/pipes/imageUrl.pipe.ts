import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Sanitize HTML
 */
@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

  constructor(protected _sanitizer: DomSanitizer) {
  }

  transform(value?: string): string {
    if(!value) return '/assets/images/placeholder.png'
    return `url(${value})`;
  }
}