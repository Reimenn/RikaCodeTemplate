import * as vscode from "vscode";
import { templates, reloadTemplates } from "./templates";


function showError(m: string) {
    vscode.window.showErrorMessage(m);
}

function tryRender(source: string, language: string): string {
    for (let i = 0; i < templates.length; i++) {
        let temp = templates[i];
        if (!temp.language.test(language)) {
            continue;
        }
        let match = temp.match(source);
        if (!match) {
            continue;
        }
        return temp.render(match);
    }
    throw new Error("No template");
}

export default function run() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    let selections = editor.selections;
    if (!selections) {
        return;
    }
    let doc = editor.document;
    reloadTemplates();
    selections.forEach((item) => {
        editor?.edit((e) => {
            let line = doc.lineAt(item.start.line);
            let snippet: vscode.SnippetString;
            try {
                let str = tryRender(
                    line.text.trim(),
                    doc.languageId.toLowerCase()
                );
                if (str.length === 0) { throw new Error("Template to Snippet error"); }
                snippet = new vscode.SnippetString(str);
            } catch (e) {
                showError(e + "");
                return;
            }
            let start = new vscode.Position(
                line.lineNumber,
                line.firstNonWhitespaceCharacterIndex
            );
            let range = new vscode.Range(start, line.range.end);
            editor?.insertSnippet(snippet, range);
        });
    });
}