import * as vscode from 'vscode';

function getIndentation(line: string): number {
  return line.length - line.trimStart().length;
}

function isInsideSceneConstruct(
  document: vscode.TextDocument,
  position: vscode.Position
): boolean {
  let sceneClassIndent: number | undefined;
  let constructIndent: number | undefined;

  for (let lineNumber = 0; lineNumber <= position.line; lineNumber++) {
    const line = document.lineAt(lineNumber).text;
    const text =
      lineNumber === position.line
        ? line.slice(0, position.character)
        : line;
    const trimmed = text.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const indentation = getIndentation(text);

    if (sceneClassIndent !== undefined && indentation <= sceneClassIndent) {
      sceneClassIndent = undefined;
      constructIndent = undefined;
    }

    if (
      /^class\s+\w+\s*\([^)]*\b(?:Scene|ThreeDScene)\b[^)]*\)\s*:/.test(
        trimmed
      )
    ) {
      sceneClassIndent = indentation;
      constructIndent = undefined;
      continue;
    }

    if (sceneClassIndent === undefined) {
      continue;
    }

    if (constructIndent !== undefined && indentation <= constructIndent) {
      constructIndent = undefined;
    }

    if (
      indentation > sceneClassIndent &&
      /^def\s+construct\s*\(/.test(trimmed)
    ) {
      constructIndent = indentation;
    }
  }

  return (
    sceneClassIndent !== undefined &&
    constructIndent !== undefined &&
    getIndentation(document.lineAt(position.line).text) > constructIndent
  );
}

function isAtModuleScopeScenePrefix(
  document: vscode.TextDocument,
  position: vscode.Position
): boolean {
  let classIndent: number | undefined;

  for (let lineNumber = 0; lineNumber < position.line; lineNumber++) {
    const line = document.lineAt(lineNumber).text;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const indentation = getIndentation(line);
    if (classIndent !== undefined && indentation <= classIndent) {
      classIndent = undefined;
    }

    if (/^class\s+\w+/.test(trimmed)) {
      classIndent = indentation;
    }
  }

  const line = document.lineAt(position.line).text;
  const prefix = line.slice(0, position.character);
  const currentWord = prefix.match(/[A-Za-z_]\w*$/)?.[0].toLowerCase() ?? '';

  return (
    classIndent === undefined &&
    getIndentation(line) === 0 &&
    currentWord.length > 0 &&
    'scene'.startsWith(currentWord)
  );
}

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
      label: 'VMobject Polyline — Manim',
      filterText: 'polyline',
      insertText:
        'self.play(Create(VMobject(color=${2:BLUE}).set_points_as_corners([${1:LEFT}, ${3:UP}, ${4:RIGHT}])))',
      detail: 'Draw a vector path through editable corner points'
    },
    {
      label: 'VMobject Smooth Curve — Manim',
      filterText: 'smooth curve',
      insertText:
        'self.play(Create(VMobject(color=${2:BLUE}).set_points_smoothly([${1:LEFT}, ${3:UP}, ${4:RIGHT}])))',
      detail: 'Draw a smooth vector path through editable anchor points'
    },
    {
      label: 'Dashed VMobject — Manim',
      filterText: 'dashed vmobject',
      insertText:
        'self.play(Create(DashedVMobject(${1:Circle()}, num_dashes=${2:16}, dashed_ratio=${3:0.5}, color=${4:BLUE})))',
      detail: 'Draw a dashed copy of a vector shape'
    },
    {
      label: 'Point on Bezier Path — Manim',
      filterText: 'point on bezier path',
      insertText:
        'self.play(Create(Dot(CubicBezier(${1:LEFT}, ${2:LEFT + UP}, ${3:RIGHT + UP}, ${4:RIGHT}).point_from_proportion(${5:0.5}), color=${6:YELLOW})))',
      detail: 'Place and animate a dot at a proportion along a Bezier path'
    },
    {
      label: 'VMobject Stroke Style — Manim',
      filterText: 'vmobject stroke style',
      insertText:
        'self.play(Create(VMobject(stroke_color=${1:BLUE}, stroke_width=${2:6}).set_points_smoothly([${3:LEFT}, ${4:UP}, ${5:RIGHT}])))',
      detail: 'Create a smooth vector path with an editable stroke color and width'
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

  const sceneTemplates = [
    {
      label: 'Manim 2D Scene Template',
      filterText: 'scene',
      insertText:
        'from manim import *\n\n\nclass ${1:MyScene}(Scene):\n    def construct(self):\n        ${0:self.play(Create(Circle(color=BLUE)))}',
      detail: 'Insert a ready-to-edit 2D Manim scene'
    },
    {
      label: 'Manim 3D Scene Template',
      filterText: 'scene',
      insertText:
        'from manim import *\n\n\nclass ${1:My3DScene}(ThreeDScene):\n    def construct(self):\n        self.set_camera_orientation(phi=${2:70} * DEGREES, theta=${3:-45} * DEGREES)\n        ${0:self.play(Create(Sphere()))}',
      detail: 'Insert a ready-to-edit 3D Manim scene'
    }
  ];

  const provider = vscode.languages.registerCompletionItemProvider(
    { language: 'python' },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        const availableSnippets = isInsideSceneConstruct(document, position)
          ? shapes
          : isAtModuleScopeScenePrefix(document, position)
            ? sceneTemplates
            : [];

        return availableSnippets.map((snippet) => {
          const item = new vscode.CompletionItem(
            snippet.label,
            vscode.CompletionItemKind.Snippet
          );

          item.filterText = snippet.filterText;
          item.insertText = new vscode.SnippetString(snippet.insertText);
          item.detail = snippet.detail;

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
    't',
    'v'
  );

  context.subscriptions.push(helloWorld, provider);
}

export function deactivate() {}