# ManimHelper

Подсказки-вставки для создания и анимации фигур [Manim](https://www.manim.community/) в Python-файлах VS Code.

## Как использовать

Откройте Python-файл и начните вводить название фигуры, например `circle`, `curved arrow` или `annular sector`. Выберите подсказку Manim из списка автодополнения. Вставка использует позиции Tab для редактирования параметров. В коде сцены должны быть доступны соответствующие классы и константы Manim, например `Create`, `Circle`, `PI` и `UP`.

## Подсказки фигур

### Основные фигуры

- **Circle** (`circle`)

  ```python
  self.play(Create(Circle(radius=${1:1}, color=${2:BLUE})))
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

### Дуги и стрелки

- **Arc** (`arc`)

  ```python
  self.play(Create(Arc(radius=${1:1}, angle=${2:PI / 2}, color=${3:BLUE})))
  ```

- **ArcBetweenPoints** (`arc between points`)

  ```python
  self.play(Create(ArcBetweenPoints(${1:LEFT}, ${2:RIGHT}, angle=${3:PI / 2}, color=${4:BLUE})))
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

### Секторы и кольца

- **AnnularSector** (`annular sector`)

  ```python
  self.play(Create(AnnularSector(inner_radius=${1:0.5}, outer_radius=${2:1}, angle=${3:PI}, color=${4:BLUE})))
  ```

- **Sector** (`sector`)

  ```python
  self.play(Create(Sector(radius=${1:1}, angle=${2:PI / 2}, color=${3:BLUE})))
  ```

- **Annulus** (`annulus`)

  ```python
  self.play(Create(Annulus(inner_radius=${1:0.5}, outer_radius=${2:1}, color=${3:BLUE})))
  ```

### Кривые и многоугольники

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

## Разработка

Для запуска расширения в режиме разработки установите зависимости командой `npm ci`, затем нажмите **F5** в VS Code. Сборка: `npm run compile`. Тесты: `npm test`.
