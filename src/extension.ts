import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('ManimHelper is now active!');

  const helloWorld = vscode.commands.registerCommand(
    'manim-helper.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from ManimHelper!');
    }
  );

  const shapes = [
    {
      label: 'Circle — Manim',
      filterText: 'circle',
      insertText:
        'self.play(Create(Circle(radius=${1:1}, color=${2:BLUE})))',
      detail: 'Create and animate a Manim circle'
    },
    {
      label: 'Square — Manim',
      filterText: 'square',
      insertText:
        'self.play(Create(Square(side_length=${1:2}, color=${2:BLUE})))',
      detail: 'Create and animate a Manim square'
    },
    {
      label: 'Triangle — Manim',
      filterText: 'triangle',
      insertText: 'self.play(Create(Triangle(color=${1:GREEN})))',
      detail: 'Create and animate a Manim triangle'
    },
    {
      label: 'Star — Manim',
      filterText: 'star',
      insertText:
        'self.play(Create(Star(n=${1:5}, outer_radius=${2:1}, inner_radius=${3:0.5}, color=${4:YELLOW})))',
      detail: 'Create and animate a Manim star'
    }
  ];

  const provider = vscode.languages.registerCompletionItemProvider(
    { language: 'python' },
    {
      provideCompletionItems() {
        return shapes.map((shape) => {
          const item = new vscode.CompletionItem(
            shape.label,
            vscode.CompletionItemKind.Snippet
          );

          item.filterText = shape.filterText;
          item.insertText = new vscode.SnippetString(shape.insertText);
          item.detail = shape.detail;

          return item;
        });
      }
    },
	'c', 's', 't'
  );

  context.subscriptions.push(helloWorld, provider);
}

export function deactivate() {}