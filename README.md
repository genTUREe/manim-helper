# ManimHelper

Code snippets for creating and animating [Manim](https://www.manim.community/) shapes in Python files in VS Code.

## Usage

Open a Manim Python file and type a shape name inside a `construct` method of a class derived from `Scene` or `ThreeDScene`, for example `circle`, `curved arrow`, or `annular sector`. Shape animation snippets are only offered inside these methods, where `self.play(...)` is valid. Select a Manim suggestion from the completion list and use Tab stops to edit its parameters.

## Scene templates

At the top level of a Python file, type `scene` and select one of the ready-to-edit scene templates:

- **Manim 2D Scene Template** inserts a `Scene` class with a sample circle animation.
- **Manim 3D Scene Template** inserts a `ThreeDScene` class with camera setup and a sample sphere animation.

Use Tab to move through and edit the template placeholders.

## Shape snippets

### Basic shapes

- **Circle** (`circle`)

  ```python
  self.play(Create(Circle(radius=${1:1}, color=${2:BLUE})))
  ```

- **Circle Through Three Points** (`circle through three points`)

  ```python
  self.play(Create(Circle.from_three_points(${1:LEFT}, ${2:UP}, ${3:RIGHT}, color=${4:BLUE})))
  ```

- **Circle Around Object** (`circle around object`)

  ```python
  self.play(Create(Circle(color=${2:YELLOW}).surround(${1:mobject}, buffer_factor=${3:1.2})))
  ```

- **Point on Circle** (`point on circle`)

  ```python
  self.play(Create(Dot(Circle(radius=${1:2}).point_at_angle(${2:PI / 2}), color=${3:YELLOW})))
  ```

- **Square** (`square`)

  ```python
  self.play(Create(Square(side_length=${1:2}, color=${2:BLUE})))
  ```

- **Triangle** (`triangle`)

  ```python
  self.play(Create(Triangle(color=${1:GREEN})))
  ```

- **Star** (`star`)

  ```python
  self.play(Create(Star(n=${1:5}, outer_radius=${2:1}, inner_radius=${3:0.5}, color=${4:YELLOW})))
  ```

- **Dot** (`dot`)

  ```python
  self.play(Create(Dot(${1:ORIGIN}, color=${2:YELLOW})))
  ```

- **AnnotationDot** (`annotation dot`)

  ```python
  self.play(Create(AnnotationDot(${1:ORIGIN}, radius=${2:0.1}, fill_color=${3:BLUE})))
  ```

- **LabeledDot** (`labeled dot`)

  ```python
  self.play(Create(LabeledDot(${1:"A"}, radius=${2:0.5})))
  ```

- **Ellipse** (`ellipse`)

  ```python
  self.play(Create(Ellipse(width=${1:2}, height=${2:1}, color=${3:BLUE})))
  ```

### Arcs and arrows

- **Arc** (`arc`)

  ```python
  self.play(Create(Arc(radius=${1:1}, angle=${2:PI / 2}, color=${3:BLUE})))
  ```

- **ArcBetweenPoints** (`arc between points`)

  ```python
  self.play(Create(ArcBetweenPoints(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))
  ```

- **ArcBetweenPoints by Radius** (`arc between points radius`)

  ```python
  self.play(Create(ArcBetweenPoints(${1:LEFT}, ${2:RIGHT}, radius=${3:2.5}, color=${4:BLUE})))
  ```

- **CurvedArrow** (`curved arrow`)

  ```python
  self.play(Create(CurvedArrow(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))
  ```

- **CurvedDoubleArrow** (`curved double arrow`)

  ```python
  self.play(Create(CurvedDoubleArrow(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))
  ```

- **TangentialArc** (`tangential arc`)

  ```python
  self.play(Create(TangentialArc(${1:Line(LEFT, RIGHT)}, ${2:Line(DOWN, UP)}, radius=${3:1}, color=${4:BLUE})))
  ```

### Sectors and rings

- **AnnularSector** (`annular sector`)

  ```python
  self.play(Create(AnnularSector(inner_radius=${1:0.5}, outer_radius=${2:1}, angle=${3:PI}, color=${4:BLUE})))
  ```

- **AnnularSector with Start Angle** (`annular sector start angle`)

  ```python
  self.play(Create(AnnularSector(inner_radius=${1:0.5}, outer_radius=${2:1}, start_angle=${3:PI / 4}, angle=${4:PI / 2}, color=${5:BLUE})))
  ```

- **Sector** (`sector`)

  ```python
  self.play(Create(Sector(radius=${1:1}, angle=${2:PI / 2}, color=${3:BLUE})))
  ```

- **Annulus** (`annulus`)

  ```python
  self.play(Create(Annulus(inner_radius=${1:0.5}, outer_radius=${2:1}, color=${3:BLUE})))
  ```

### Curves and polygons

- **CubicBezier** (`cubic bezier`)

  ```python
  self.play(Create(CubicBezier(${1:LEFT}, ${2:LEFT + UP}, ${3:RIGHT + UP}, ${4:RIGHT}, color=${5:BLUE})))
  ```

- **ArcPolygon** (`arc polygon`)

  ```python
  self.play(Create(ArcPolygon(${1:LEFT}, ${2:UP}, ${3:RIGHT}, angle=${4:PI / 4}, color=${5:BLUE})))
  ```

- **ArcPolygonFromArcs** (`arc polygon from arcs`)

  ```python
  self.play(Create(ArcPolygonFromArcs(${1:Arc()}, ${2:ArcBetweenPoints(LEFT, RIGHT)}, ${3:Arc()}, color=${4:BLUE})))
  ```

## Development

To run the extension in development mode, install dependencies with `npm ci`, then press **F5** in VS Code. Build with `npm run compile`; run tests with `npm test`.
