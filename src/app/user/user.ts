import { Course } from "../course/course";

interface _certificate{
    link: string,
    courseId: string
}

export interface User {
    userId: string;

    name: string,
    surname: string,
    email: string,
    image: string,
    certificates: _certificate[],

    editor: boolean,
    admin: boolean,
  
    phone: string,
    country: string,
    birthday: string,

    exp: number,
    iat: number,
    sub: string,

    token: string,

    coursesCreated: Course[],
    coursesJoined: Course[],

    verified?: boolean

    lastActivity?: string,
}
  