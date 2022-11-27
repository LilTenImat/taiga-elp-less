import { Pipe, PipeTransform } from '@angular/core';
import { ObjectTypeEnum } from '../course/content/content';

@Pipe({
  name: 'contentType'
})
export class ContentTypePipe implements PipeTransform {

  transform(type: `${ObjectTypeEnum}`): string {

    switch(type){
      case ObjectTypeEnum.ARTICLE : {
        return "Article";
      }
      case ObjectTypeEnum.VIDEO : {
        return "Video";
      }
      case ObjectTypeEnum.PPT : {
        return 'Presentation';
      }
      case ObjectTypeEnum.QUIZ : {
        return 'Quiz';
      }
      case ObjectTypeEnum.READING_MATERIALS : {
        return "Materials";
      }
      default: {
        return "Page";
      }
    }
  }

}
