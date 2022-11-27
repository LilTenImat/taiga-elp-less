import { languages } from "../../environment";

export function emptyModuleLanguages(){
  return Object.assign({}, ...Object.values(languages).map(l => {
    return {[l]: {title: `title(${l})`}}
  }))
}

export type _moduleLanguages = {
  [lang in languages]: {
    title: string
  }
}

export interface Module{
    title: string,
    url?: string,
    moduleId: string,
    courseId: string
    order: number,

    completed?: boolean,

    languages: _moduleLanguages
}