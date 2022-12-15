import { IObject } from "./content/content";
import { languages } from "../environment";
import { XapiStatement } from "../interfaces/xapiStatement";
import { Module } from "./module/module";

export function emptyCourseLanguage(){
  return {
    goals: [],
    benefits: [],
    requirements: [],
    intro: '',
    description: '',
    title: '',
    additional: '',
    cardInfo: '',
  } as _language;
}

export interface _language{
  goals?: string[],
  benefits?: string[],
  requirements?: string[],
  intro: string,
  description: string,
  title: string,
  additional: string,
  cardInfo?: string
}


export type _languages = {
  [key in languages]: _language
}

export interface Course {
    title: string,
    url?: string,
    image?: string,
    published: boolean,
    mode: 'sequential' | 'free',
    duration: string,
    courseId: string,
    price: number,
  
    certificateTemplate: string,
    quizThreshold?: number,
  
    languages?: _languages,
  
    actions: XapiStatement[],
  
    pubicationDate?: string,
    courseLanguages?: string[],
    modules?: Module[],
    content?: IObject[],
    joined?: number,
    isJoined?: boolean,
    createdBy: string,
    createdAt: string,
    updatedBy: string,
    updatedAt: string,
  
  }