import { XapiStatement } from '../../interfaces/xapiStatement';
import { languages } from '../../environment';

export enum ObjectTypeEnum {
  PAGE = 'page',
  ARTICLE = 'article',
  PPT = 'ppt',
  VIDEO = 'video',
  QUIZ = 'quiz',
  IMAGE = 'image',
  EXTERNAL_COURSE = 'external_course',
  READING_MATERIALS = 'reading_materials',
  LIBRARY_MATERIALS = 'library_materials',
}


export function emptyContent(type: ObjectTypeEnum = ObjectTypeEnum.ARTICLE) {
  switch(type){
    case ObjectTypeEnum.VIDEO: return { completed: false, title: '', link: '', files: [] } as Video;
    case ObjectTypeEnum.QUIZ: return { completed: false, title: '', questions: [] } as Quiz;
    case ObjectTypeEnum.READING_MATERIALS: return { completed: false, title: '', text: '', texts: [], titles: [], files: [] } as ReadingMaterials;
    case ObjectTypeEnum.PPT: return { completed: false, title: '', link: '', text: '' } as Ppt;
    case ObjectTypeEnum.ARTICLE: 
    default: return { completed: false, title: '', link: '', text: '' } as Article;
  }
}

export type _blockLanguages = {
  [key in languages]: Content;
};

export type Content = Article | Video | Quiz | ReadingMaterials | LibraryMaterialsContent | Ppt;

export interface Video {
  title: string;
  completed: boolean;
  link: string;
  files: {
    url: string;
    fileId?: string;
  }[];
  subtitles?: string;
}

export interface Article {
  title: string;
  completed: boolean;
  link: string;
  text: string;
}

export interface _question{
  questionText: string;
  answers: {
    answerText: string;
    isCorrect: boolean;
  }[];
}

export interface Quiz {
  title: string;
  completed: boolean;
  questions: _question[]
  final_test?: boolean;
  welcome?: '';
}

export interface Ppt {
  title: string;
  completed: boolean;
  text: string;
  link: string;
}
export interface ReadingMaterials {
  title: string;
  text: string,
  completed: boolean;
  texts: string[];
  titles: string[];
  files: {
    url: string;
    fileId?: string;
  }[];
}
export interface LibraryMaterialsContent {
  title: string;
  subtitle: string;
  footer: string;
  filename: string;
}
export interface IObject {
  title: string;
  objectId: string;
  order: number;
  type: ObjectTypeEnum;
  courseId: string;
  moduleId: string;
  content: {languages: _blockLanguages, final_test?: boolean};

  completed: boolean;

  actions: XapiStatement[];

  loading?: boolean;
  public?: boolean;
  
}
export interface LibraryMaterials{
  title: string;
  objectId: string;
  order: number;
  type: ObjectTypeEnum.LIBRARY_MATERIALS;
  courseId: string;
  moduleId: string;
  content: LibraryMaterialsContent;

  completed: boolean;

  actions: XapiStatement[];
}
