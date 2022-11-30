import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
    TuiIslandModule, 
    TuiMarkerIconModule, 
    TuiBadgeModule,
    TuiBadgedContentModule,
    TuiAccordionModule,
    TuiInputModule,
    TuiTextAreaModule,
    TuiInputFilesModule,
    TuiLineClampModule,
    TuiDataListDropdownManagerModule,
	TuiDataListWrapperModule,
    TuiBreadcrumbsModule,
    TuiToggleModule,
    TuiRadioBlockModule,
    TuiFieldErrorPipeModule,
    TuiInputPasswordModule,
    TuiActionModule,
} from '@taiga-ui/kit';

// import {TuiTilesModule} from '@taiga-ui/kit';

import { 
    TuiHintModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiSvgModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiDropdownModule,
    TuiThemeNightModule, 
    TuiModeModule,
    TuiLoaderModule,
    TuiGroupModule,
    TuiExpandModule,
    TuiErrorModule,
    TuiPrimitiveTextfieldModule
} from '@taiga-ui/core';

import { 
    TuiActiveZoneModule,
    TuiLetModule,
    TuiPortalModule,
    TuiForModule
} from '@taiga-ui/cdk';

import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiEditorModule } from '@taiga-ui/addon-editor';
import { TuiReorderModule } from '@taiga-ui/addon-table';

@NgModule({
    exports: [
        TuiIslandModule,
        TuiMarkerIconModule,
        TuiBadgeModule,
        TuiBadgedContentModule,
        TuiHintModule,
        TuiButtonModule,
        TuiSidebarModule,
        TuiActiveZoneModule,
        TuiAccordionModule,
        TuiLinkModule,
        TuiInputModule,
        ReactiveFormsModule,
        FormsModule,
        TuiSvgModule,
        TuiTextfieldControllerModule,
        TuiTextAreaModule,
        TuiEditorModule,
        TuiInputFilesModule,
        TuiLetModule,
        TuiLineClampModule,
        TuiReorderModule,
        TuiDataListModule,
        TuiDataListDropdownManagerModule,
        TuiDataListWrapperModule,
        TuiDropdownModule,
        TuiHostedDropdownModule,
        TuiPortalModule,
        TuiBreadcrumbsModule,
        TuiThemeNightModule, 
        TuiModeModule,
        TuiToggleModule,
        TuiForModule,
        TuiLoaderModule,
        TuiGroupModule,
        TuiRadioBlockModule,
        TuiExpandModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiInputPasswordModule,
        TuiActionModule,
        TuiPrimitiveTextfieldModule,
        TuiTilesModule
    ]
})
export class TaigaModule { }
