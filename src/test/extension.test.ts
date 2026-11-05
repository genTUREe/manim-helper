import * as assert from 'assert';
import * as vscode from 'vscode';

async function getSnippetCompletions(
	documentText: string,
	position: vscode.Position,
	triggerCharacter: string
): Promise<Map<string, vscode.SnippetString>> {
	const snippets = new Map<string, vscode.SnippetString>();

	for (const item of await getCompletionItems(
		documentText,
		position,
		triggerCharacter
	)) {
		if (item.insertText instanceof vscode.SnippetString) {
			snippets.set(
				typeof item.label === 'string' ? item.label : item.label.label,
				item.insertText
			);
		}
	}

	return snippets;
}

async function getCompletionItems(
	documentText: string,
	position: vscode.Position,
	triggerCharacter: string
): Promise<vscode.CompletionItem[]> {
	const document = await vscode.workspace.openTextDocument({
		language: 'python',
		content: documentText
	});
	const completions =
		await vscode.commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			document.uri,
			position,
			triggerCharacter
		);

	return completions?.items ?? [];
}

suite('Extension Test Suite', () => {
	test('provides shape snippets inside a Manim scene construct', async () => {
		const snippets = new Map<string, vscode.SnippetString>();
		for (const trigger of [
			'a',
			'c',
			'd',
			'e',
			'f',
			'g',
			'l',
			'p',
			'r',
			's',
			't',
			'v'
		]) {
			const completions = await getSnippetCompletions(
				'class MyScene(Scene):\n    def construct(self):\n        ',
				new vscode.Position(2, 8),
				trigger
			);

			for (const [label, snippet] of completions) {
				snippets.set(label, snippet);
			}
		}

		for (const shape of [
			'Circle — Manim',
			'Filled Shape — Manim',
			'Circle Through Three Points — Manim',
			'Circle Around Object — Manim',
			'Point on Circle — Manim',
			'Square — Manim',
			'Triangle — Manim',
			'Star — Manim',
			'Arc — Manim',
			'Arc Between Points — Manim',
			'Arc Between Points by Radius — Manim',
			'Curved Arrow — Manim',
			'Curved Double Arrow — Manim',
			'Dot — Manim',
			'Annotation Dot — Manim',
			'Labeled Dot — Manim',
			'Ellipse — Manim',
			'Annular Sector — Manim',
			'Annular Sector with Start Angle — Manim',
			'Sector — Manim',
			'Annulus — Manim',
			'Cubic Bezier — Manim',
			'VMobject Polyline — Manim',
			'VMobject Smooth Curve — Manim',
			'Dashed VMobject — Manim',
			'Point on Bezier Path — Manim',
			'VMobject Stroke Style — Manim',
			'Gradient Curve — Manim',
			'VGroup Composition — Manim',
			'Sheen Highlight — Manim',
			'Rounded Line Caps — Manim',
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

		assert.ok(
			!snippets.has('Manim 2D Scene Template'),
			'Scene templates should not be offered inside construct'
		);
	});

	test('VMobject keyword matches vector path completions', async () => {
		const items = await getCompletionItems(
			'class MyScene(Scene):\n    def construct(self):\n        ',
			new vscode.Position(2, 8),
			'v'
		);
		const filterTexts = new Map(
			items.map((item) => [
				typeof item.label === 'string' ? item.label : item.label.label,
				item.filterText
			])
		);

		for (const label of [
			'VMobject Polyline — Manim',
			'VMobject Smooth Curve — Manim',
			'Gradient Curve — Manim'
		]) {
			assert.ok(
				filterTexts.get(label)?.startsWith('vmobject'),
				`Typing "vmobject" should match the leading filter text for ${label}`
			);
		}
	});

	test('provides scene templates for the scene prefix at module scope', async () => {
		const snippets = await getSnippetCompletions(
			'scene',
			new vscode.Position(0, 5),
			'e'
		);

		for (const [template, sceneType] of [
			['Manim 2D Scene Template', 'Scene'],
			['Manim 3D Scene Template', 'ThreeDScene']
		]) {
			const snippet = snippets.get(template);
			assert.ok(snippet, `Missing completion: ${template}`);
			assert.ok(
				snippet.value.startsWith('from manim import *'),
				`Template must include the Manim import: ${template}`
			);
			assert.ok(
				snippet.value.includes(`(${sceneType}):`),
				`Template must use ${sceneType}: ${template}`
			);
		}

		assert.ok(
			!snippets.has('Circle — Manim'),
			'Shape animations should not be offered at module scope'
		);
	});

	test('does not offer animation snippets in a class declaration', async () => {
		const snippets = await getSnippetCompletions(
			'class MyVector(Scene):',
			new vscode.Position(0, 10),
			'a'
		);

		assert.strictEqual(snippets.size, 0);
	});

	test('does not offer animation snippets outside a scene construct', async () => {
		const snippets = await getSnippetCompletions(
			'class MyVector:\n    def __init__(self):\n        ',
			new vscode.Position(2, 8),
			'a'
		);

		assert.strictEqual(snippets.size, 0);
	});
});
