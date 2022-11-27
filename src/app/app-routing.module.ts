import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course/list/course-list.component'
import { CourseComponent } from './course/main/course.component';
import { CreateCourseComponent } from './course/create/create.component';
import { EditorGuard } from './helpers/editor.guard';
import { AuthGuarg } from './helpers/auth.guard';
import { LogoutGuarg } from './helpers/logout.guard';
import { AboutComponent } from './static/about.component';
import { TermsOfUseComponent } from './static/terms-of-use.component';
import { ClassroomComponent } from './static/classroom.component';
import { CopyrightComponent } from './static/copyright.component';
import { CookiePolicyComponent } from './static/cookie-policy.component';
import { PrivacyPolicyComponent } from './static/privacy-policy.component';

const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },

  // // admin section
  // { path: 'admin', 
  //   children: [
  //     { path: '', component: AdminComponent },
  //     { path: 'user/:id', component: UserInfoComponent },
  //     // { path: 'course/:id', component: CourseInfoComponent }
  //   ],
  //   canActivate: [AdminGuard]
  // },

  // // blog pages
  // {
  //   path: 'blog',
  //   children: [
  //     { path: '', component: PostsListComponent },
  //     { path: 'post', redirectTo: '', pathMatch: 'full' },
  //     {
  //       path: 'post/:id',
  //       children: [
  //         { path: '', component: PostPageComponent },
  //         // {path: 'edit', component: PostPageComponent},
  //       ],
  //     },
  //   ],
  // },

  // // course pages
  {
    path: 'course',
    children: [
      { path: '', redirectTo: '/courses', pathMatch: 'full'},
      { path: 'new', component: CreateCourseComponent, canActivate: [EditorGuard]},
      { path: ':courseUrl', redirectTo: `en/:courseUrl`, pathMatch: 'full' },
      {
        path: ':language/:courseUrl', 
        children: [
          { path: '', component: CourseComponent, data: {mode: 'landing'} },
          { path: 'content/:moduleUrl', component: CourseComponent, data: { mode: 'content' } },
        ],
        canActivate: [AuthGuarg]
      },
    ],
  },

  // // list pages
  {
    path: 'courses',
    children: [
      { path: '', component: CourseListComponent },
  //     { path: 'my', component: MyCoursesComponent },
    ],
  },

  // { path: 'profile', component: ProfileComponent },

  // // auth
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  // { path: 'recovery', component: RestoreComponent },
  { path: 'logout', canActivate: [LogoutGuarg], component: CourseListComponent},
  // { path: 'verify', component: VerifyMailComponent },
  // { path: 'check', component: CheckComponent },

  // static pages
  { path: 'about-us', component: AboutComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: 'copyright', component: CopyrightComponent },
  // { path: 'contacts', component: ContactusComponent },
  { path: 'classroom', component: ClassroomComponent },
  // { path: 'library', component: LibraryComponent },
  // // stripe
  // {
  //   path: 'payment', 
  //   children: [
  //     {
  //       path: ':courseId',
  //       component: StripeComponent,
  //     }
  //   ],
  //   canActivate: [AuthGuard]
  // },
  

  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
