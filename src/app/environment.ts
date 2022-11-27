
import {TuiEditorTool} from '@taiga-ui/addon-editor';
export enum languages {
  en = 'en', // english
  ru = 'ru', // russian
  hy = 'hy', // armenian
  ka = 'ka', // georgian
  kk = 'kk', // kazakh
}

export const environment = {
  production: false,
  locales: Object.values(languages),
  defaultLocale: languages.en as string,
};

export const TUI_EDITOR_TOOLS = [
  TuiEditorTool.Undo, TuiEditorTool.Size, TuiEditorTool.Bold, TuiEditorTool.Italic, TuiEditorTool.Underline,
  TuiEditorTool.List, TuiEditorTool.Quote, TuiEditorTool.Link, TuiEditorTool.Img, TuiEditorTool.HR,
  TuiEditorTool.Sub, TuiEditorTool.Sup, TuiEditorTool.Strikethrough
];

// Undo = "undo",
// Anchor = "anchor",
// Size = "fontSize",
// Bold = "bold",
// Italic = "italic",
// Underline = "underline",
// Strikethrough = "strikeThrough",
// Align = "justify",
// List = "list",
// Quote = "quote",
// Color = "foreColor",
// Hilite = "hiliteColor",
// Clear = "clear",
// Link = "link",
// Attach = "attach",
// Tex = "tex",
// Code = "code",
// Img = "image",
// HR = "insertHorizontalRule",
// Sup = "superscript",
// Sub = "subscript",
// Table = "insertTable",
// MergeCells = "mergeCells",
// SplitCells = "splitCells",
// RowsColumnsManaging = "rowsColumnsManaging",
// Details = "details",
// Group = "group"
