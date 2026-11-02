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
      label: 'Circle Through Three Points — Manim',
      filterText: 'circle through three points',
      insertText:
        'self.play(Create(Circle.from_three_points(${1:LEFT}, ${2:UP}, ${3:RIGHT}, color=${4:BLUE})))',
      detail: 'Create and animate a circle through three points'
    },
    {
      label: 'Circle Around Object — Manim',
      filterText: 'circle around object',
      insertText:
        'self.play(Create(Circle(color=${2:YELLOW}).surround(${1:mobject}, buffer_factor=${3:1.2})))',
      detail: 'Create and animate a circle around an existing mobject'
    },
    {
      label: 'Point on Circle — Manim',
      filterText: 'point on circle',
      insertText:
        'self.play(Create(Dot(Circle(radius=${1:2}).point_at_angle(${2:PI / 2}), color=${3:YELLOW})))',
      detail: 'Create and animate a dot at an angle on a circle'
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
    },
    {
      label: 'Arc — Manim',
      filterText: 'arc',
      insertText:
        'self.play(Create(Arc(radius=${1:1}, angle=${2:PI / 2}, color=${3:BLUE})))',
      detail: 'Create and animate a circular arc'
    },
    {
      label: 'Arc Between Points — Manim',
      filterText: 'arc between points',
      insertText:
        'self.play(Create(ArcBetweenPoints(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))',
      detail: 'Create and animate an arc between two points'
    },
    {
      label: 'Arc Between Points by Radius — Manim',
      filterText: 'arc between points radius',
      insertText:
        'self.play(Create(ArcBetweenPoints(${1:LEFT}, ${2:RIGHT}, radius=${3:2.5}, color=${4:BLUE})))',
      detail: 'Create and animate an arc between two points using its radius'
    },
    {
      label: 'Curved Arrow — Manim',
      filterText: 'curved arrow',
      insertText:
        'self.play(Create(CurvedArrow(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))',
      detail: 'Create and animate a curved arrow'
    },
    {
      label: 'Curved Double Arrow — Manim',
      filterText: 'curved double arrow',
      insertText:
        'self.play(Create(CurvedDoubleArrow(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))',
      detail: 'Create and animate a curved double arrow'
    },
    {
      label: 'Dot — Manim',
      filterText: 'dot',
      insertText: 'self.play(Create(Dot(${1:ORIGIN}, color=${2:YELLOW})))',
      detail: 'Create and animate a Manim dot'
    },
    {
      label: 'Annotation Dot — Manim',
      filterText: 'annotation dot',
      insertText:
        'self.play(Create(AnnotationDot(${1:ORIGIN}, radius=${2:0.1}, fill_color=${3:BLUE})))',
      detail: 'Create and animate an annotation dot'
    },
    {
      label: 'Labeled Dot — Manim',
      filterText: 'labeled dot',
      insertText:
        'self.play(Create(LabeledDot(${1:"A"}, radius=${2:0.5})))',
      detail: 'Create and animate a dot with a label'
    },
    {
      label: 'Ellipse — Manim',
      filterText: 'ellipse',
      insertText:
        'self.play(Create(Ellipse(width=${1:2}, height=${2:1}, color=${3:BLUE})))',
      detail: 'Create and animate an ellipse'
    },
    {
      label: 'Annular Sector — Manim',
      filterText: 'annular sector',
      insertText:
        'self.play(Create(AnnularSector(inner_radius=${1:0.5}, outer_radius=${2:1}, angle=${3:PI}, color=${4:BLUE})))',
      detail: 'Create and animate a sector of an annulus'
    },
    {
      label: 'Annular Sector with Start Angle — Manim',
      filterText: 'annular sector start angle',
      insertText:
        'self.play(Create(AnnularSector(inner_radius=${1:0.5}, outer_radius=${2:1}, start_angle=${3:PI / 4}, angle=${4:PI / 2}, color=${5:BLUE})))',
      detail: 'Create and animate an annular sector with a custom start angle'
    },
    {
      label: 'Sector — Manim',
      filterText: 'sector',
      insertText:
        'self.play(Create(Sector(radius=${1:1}, angle=${2:PI / 2}, color=${3:BLUE})))',
      detail: 'Create and animate a circular sector'
    },
    {
      label: 'Annulus — Manim',
      filterText: 'annulus',
      insertText:
        'self.play(Create(Annulus(inner_radius=${1:0.5}, outer_radius=${2:1}, color=${3:BLUE})))',
      detail: 'Create and animate a ring'
    },
    {
      label: 'Cubic Bezier — Manim',
      filterText: 'cubic bezier',
      insertText:
        'self.play(Create(CubicBezier(${1:LEFT}, ${2:LEFT + UP}, ${3:RIGHT + UP}, ${4:RIGHT}, color=${5:BLUE})))',
      detail: 'Create and animate a cubic Bezier curve'
    },
    {
      label: 'Arc Polygon — Manim',
      filterText: 'arc polygon',
      insertText:
        'self.play(Create(ArcPolygon(${1:LEFT}, ${2:UP}, ${3:RIGHT}, angle=${4:PI / 4}, color=${5:BLUE})))',
      detail: 'Create and animate a polygon with curved edges'
    },
    {
      label: 'Arc Polygon From Arcs — Manim',
      filterText: 'arc polygon from arcs',
      insertText:
        'self.play(Create(ArcPolygonFromArcs(${1:Arc()}, ${2:ArcBetweenPoints(LEFT, RIGHT)}, ${3:Arc()}, color=${4:BLUE})))',
      detail: 'Create and animate a polygon from arcs'
    },
    {
      label: 'Tangential Arc — Manim',
      filterText: 'tangential arc',
      insertText:
        'self.play(Create(TangentialArc(${1:Line(LEFT, RIGHT)}, ${2:Line(DOWN, UP)}, radius=${3:1}, color=${4:BLUE})))',
      detail: 'Create and animate an arc tangent to two lines'
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
    'a',
    'c',
    'd',
    'e',
    'l',
    'p',
    's',
    't'
  );

  context.subscriptions.push(helloWorld, provider);
}

export function deactivate() {}