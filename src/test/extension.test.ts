import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	test('provides Manim shape snippets in Python files', async () => {
		const snippets = new Map<string, vscode.SnippetString>();
		for (const trigger of ['a', 'c', 'd', 'e', 'l', 's', 't']) {
			const document = await vscode.workspace.openTextDocument({
				language: 'python',
				content: trigger
			});
			const completions =
				await vscode.commands.executeCommand<vscode.CompletionList>(
					'vscode.executeCompletionItemProvider',
					document.uri,
					new vscode.Position(0, 1),
					trigger
				);

			for (const item of completions?.items ?? []) {
				if (item.insertText instanceof vscode.SnippetString) {
					snippets.set(
						typeof item.label === 'string' ? item.label : item.label.label,
						item.insertText
					);
				}
			}
		}

		for (const shape of [
			'Circle — Manim',
			'Square — Manim',
			'Triangle — Manim',
			'Star — Manim',
			'Arc — Manim',
			'Arc Between Points — Manim',
			'Curved Arrow — Manim',
			'Curved Double Arrow — Manim',
			'Dot — Manim',
			'Annotation Dot — Manim',
			'Labeled Dot — Manim',
			'Ellipse — Manim',
			'Annular Sector — Manim',
			'Sector — Manim',
			'Annulus — Manim',
			'Cubic Bezier — Manim',
			'Arc Polygon — Manim',
			'Arc Polygon From Arcs — Manim',
			'Tangential Arc — Manim'
		]) {
			const snippet = snippets.get(shape);
			assert.ok(snippet, `Missing completion: ${shape}`);
			assert.ok(
				snippet.value.startsWith('self.play(Create('),
				`Completion must animate the shape: ${shape}`
			);
			assert.ok(
				snippet.value.includes('${1:'),
				`Completion must include a snippet placeholder: ${shape}`
			);
		}
	});
});
