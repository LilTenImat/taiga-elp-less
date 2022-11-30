import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { TaigaModule } from "./taiga.module";

import { AppComponent } from './app.component';

import { IconComponent } from "./helpers/icon.component";

import { SafePipe } from './pipes/safe.pipe';
import { ImageUrlPipe } from "./pipes/imageUrl.pipe";
import { ContentIconPipe } from "./pipes/contentIcon.pipe";

import { LandingComponent } from "./course/landing/landing.component";
import { EditLandingComponent } from "./course/landing/edit-landing.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CourseCardComponent } from "./course/card/course-card.component";
import { CourseListComponent } from "./course/list/course-list.component";
import { CourseComponent } from "./course/main/course.component";
import { ModulesComponent } from "./course/module/modules.component";
import { CreateCourseComponent } from "./course/create/create.component";
import { ContentComponent } from './course/content/content.component';
import { EditContentComponent } from './course/module/edit-modules.component';
import { StaticPagesModule } from "./static/static.module";
import { ToobarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from "./footer/footer.component";
import { EditBlockComponent } from './course/content/edit-block.component';
import { ContentTypePipe } from './pipes/content-type.pipe';


import {DragDropModule} from '@angular/cdk/drag-drop';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import { of } from "rxjs";

import {
  defaultEditorExtensions,
  TUI_EDITOR_CONTENT_PROCESSOR,
  TUI_EDITOR_EXTENSIONS,
  tuiLegacyEditorConverter,
} from '@taiga-ui/addon-editor';
import { ButtonToggleComponent } from "./helpers/button-toggle/button-toggle.component";
import { LoginComponent } from "./user/auth/login.component";
import { AuthComponent } from "./user/auth/auth.component";

@NgModule({
  declarations: [
    AppComponent,

    ToobarComponent, 
    FooterComponent,
    
    CourseCardComponent,
    LandingComponent,
    EditLandingComponent,
    CourseListComponent,
    CourseComponent,
    ModulesComponent,
    CreateCourseComponent,
    ContentComponent,
    EditContentComponent,
    EditBlockComponent,
    LoginComponent,
    AuthComponent,

    ButtonToggleComponent,
    
    IconComponent,
    SafePipe,
    ImageUrlPipe,
    ContentIconPipe,
    ContentTypePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TaigaModule,
    DragDropModule,
    StaticPagesModule,
    
],
  providers: [
    {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
    {provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE)},
    {provide: TUI_EDITOR_EXTENSIONS, useValue: defaultEditorExtensions},
    {provide: TUI_EDITOR_CONTENT_PROCESSOR, useValue: tuiLegacyEditorConverter},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
