import { NgModule } from "@angular/core";
import { TermsOfUseComponent } from "./terms-of-use.component";
import { PrivacyPolicyComponent } from "./privacy-policy.component";
import { CopyrightComponent } from "./copyright.component";
import { CookiePolicyComponent } from "./cookie-policy.component";
import { ClassroomComponent } from "./classroom.component";
import { AboutComponent } from "./about.component";
import { TaigaModule } from "../taiga.module";

@NgModule({
    declarations: [
        AboutComponent,
        ClassroomComponent,
        CookiePolicyComponent,
        CopyrightComponent,
        PrivacyPolicyComponent,
        TermsOfUseComponent
    ],
    imports: [
        TaigaModule
    ]
})
export class StaticPagesModule{};