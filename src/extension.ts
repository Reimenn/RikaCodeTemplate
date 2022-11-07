import * as vscode from 'vscode';
import run from './run';

export const id = "rikacodetemplate";

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand(id + ".run", run)
	);
}

export function deactivate() { }
