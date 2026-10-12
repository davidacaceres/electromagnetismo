"""Genera descargas/Formulario_EIE2211_circuitos.pdf con todas las fórmulas del sitio.

Fuente: las 38 fórmulas del panel (js/formulas/*.js) más las que aparecen en los módulos
y no tienen ficha propia (COMPLEMENTOS). Cada entrada lleva solo el nombre y la fórmula,
para usarlo como formulario en la prueba.

Uso:  python3 tools/build_formulario.py      (requiere node y pdflatex)
"""
import json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'descargas', 'Formulario_EIE2211_circuitos.pdf')

# Fórmulas de los módulos que no están como ficha en el panel: (grupo, nombre, TeX)
COMPLEMENTOS = [
    ('Conductores y resistencia', 'Conductividad de un semiconductor', r'\sigma_{sc} = -\rho_e\mu_e + \rho_h\mu_h'),
    ('Redes equivalentes', r'Transformación estrella a triángulo (Y $\to$ $\Delta$)',
     r'\Pi = R_aR_b + R_bR_c + R_cR_a \qquad R_{ab} = \frac{\Pi}{R_c} \quad R_{bc} = \frac{\Pi}{R_a} \quad R_{ca} = \frac{\Pi}{R_b}'),
    ('Teoremas de redes', 'Máxima transferencia de potencia', r'R_L = R_{th} \qquad P_{\max} = \frac{V_{th}^2}{4R_{th}}'),
    ('Transitorios', 'Carga y descarga RC',
     r'\text{Carga: } v_C(t) = V\left(1 - e^{-t/RC}\right),\ \ i(t) = \frac{V}{R}e^{-t/RC} \qquad \text{Descarga: } v_C(t) = V_0\,e^{-t/RC}'),
    ('Resistencia en geometrías no uniformes', 'Resistencia entre esferas concéntricas',
     r'R = \frac{1}{4\pi\sigma}\left(\frac{1}{a} - \frac{1}{b}\right)'),
    ('Resistencia en geometrías no uniformes', 'Electrodo semiesférico (puesta a tierra)',
     r'R = \frac{1}{2\pi\sigma}\left(\frac{1}{a} - \frac{1}{b}\right) \xrightarrow{\,b\to\infty\,} \frac{1}{2\pi\sigma a} \qquad V(r) = \frac{I}{2\pi\sigma r}'),
    ('Capacitores y dieléctricos', r'Ley de Gauss para $\vec D$', r'\oint_S \vec D\cdot d\vec s \;=\; Q_{\text{libre}}'),
    ('Capacitores y dieléctricos', 'Capacitancia de un coaxial y de un capacitor esférico',
     r'C_{coax} = \frac{2\pi\varepsilon L}{\ln(b/a)} \qquad C_{esf} = \frac{4\pi\varepsilon}{1/a - 1/b} \qquad RC = \frac{\varepsilon}{\sigma}'),
]

# Fórmulas del panel que en el PDF se escriben en varias líneas para que quepan en la columna.
PARTIR = {
    'supermalla': [r'I_2 - I_1 = I_s', r'\text{(fuente de corriente en la rama compartida)}',
                   r'+\ \text{LVK por el contorno de ambas mallas}'],
    'supernodo': [r'V_1 - V_2 = \varepsilon', r'+\ \text{LCK de la superficie que encierra 1 y 2}'],
}

CONSTANTES = [
    (r'\varepsilon_0', r'8{,}854\times10^{-12}\ \mathrm{F/m} \approx \dfrac{10^{-9}}{36\pi}'),
    (r'\mu_0', r'4\pi\times10^{-7}\ \mathrm{H/m}'),
    (r'q_e', r'1{,}602\times10^{-19}\ \mathrm{C}'),
    (r'n_{Cu}', r'8{,}5\times10^{28}\ \text{electrones}/\mathrm{m^3}'),
    (r'\sigma_{Cu},\ \sigma_{Al},\ \sigma_{Ag}', r'5{,}8\,;\ 3{,}72\,;\ 6{,}17\ \times10^{7}\ \mathrm{S/m}'),
    (r'E_{rup,\,aire}', r'\approx 3\ \mathrm{MV/m}'),
]


def split_top(tex, sep=r'\qquad'):
    """Separa en las \\qquad de primer nivel (fuera de llaves)."""
    parts, depth, i, cur = [], 0, 0, ''
    while i < len(tex):
        c = tex[i]
        if c == '{': depth += 1
        elif c == '}': depth -= 1
        if depth == 0 and tex.startswith(sep, i) and not tex[i + len(sep):i + len(sep) + 1].isalpha():
            parts.append(cur); cur = ''; i += len(sep); continue
        cur += c; i += 1
    parts.append(cur)
    return [p.strip() for p in parts if p.strip()]


def lines(tex):
    tex = re.sub(r'\\qquad\s*\\Long(left)?rightarrow\s*\\qquad',
                 lambda m: r' \;\Longleftrightarrow\; ' if m.group(1) else r' \;\Longrightarrow\; ', tex)
    out = []
    for p in split_top(tex):
        if out and (p.startswith('[') or p.startswith(r'\Rightarrow') or p.startswith('(')):
            out[-1] += r'\quad ' + p      # la unidad o la aclaración queda junto a su fórmula
        else:
            out.append(p)
    return out


def name_tex(t):
    t = t.replace('Δ → Y', r'$\Delta \to Y$').replace('→', r'$\to$')
    return t.replace('&', r'\&')


def build():
    data = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'dump-formulas.js')]))
    groups = []
    by = {}
    for f in data:
        if f['g'] not in by:
            by[f['g']] = []; groups.append(f['g'])
        by[f['g']].append((name_tex(f['t']), PARTIR.get(f['id'], f['f'])))
    for g, t, f in COMPLEMENTOS:
        if g not in by:
            by[g] = []; groups.append(g)
        by[g].append((t, f))

    body = []
    n = 0
    for g in groups:
        for k, (t, f) in enumerate(by[g]):
            n += 1
            ls = f if isinstance(f, list) else lines(f)
            math = r'\\[2pt]'.join(ls)
            head = (r'\grupo{%s}' % g) if k == 0 else ''
            body.append(r'\formula{%s}{%s}{%s}' % (head, t, math))
    body.append(r'\par\begin{minipage}{\linewidth}\grupo{Constantes}')
    body.append(r'\begin{tabular}{@{}l@{\ \ }l@{}}' + r'\\[3pt]'.join(
        r'$%s$ & $%s$' % (s, v) for s, v in CONSTANTES) + r'\end{tabular}\end{minipage}')

    doc = r'''\documentclass[9pt]{extarticle}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[a4paper,margin=1.1cm,top=1.4cm,bottom=1.1cm]{geometry}
\usepackage{amsmath,amssymb,mathtools}
\usepackage{multicol}
\usepackage{xcolor}
\usepackage{fancyhdr}
\definecolor{acento}{HTML}{0A6ED6}
\setlength{\columnsep}{0.9cm}
\setlength{\columnseprule}{0.3pt}
\setlength{\parindent}{0pt}
\setlength{\abovedisplayskip}{4pt}\setlength{\belowdisplayskip}{4pt}\setlength{\abovedisplayshortskip}{2pt}\setlength{\belowdisplayshortskip}{4pt}
\pagestyle{fancy}\fancyhf{}
\renewcommand{\headrulewidth}{0.4pt}
\fancyhead[L]{\small\textbf{Formulario} \textperiodcentered\ EIE2211 Electromagnetismo PUCV \textperiodcentered\ Teoría de circuitos}
\fancyhead[R]{\small Pág. \thepage}
\newcommand{\grupo}[1]{\vspace{5pt}{\color{acento}\small\bfseries\MakeUppercase{#1}}\par\vspace{1pt}{\color{acento}\hrule height 0.5pt}\vspace{3pt}}
\newcommand{\formula}[3]{\par\vspace{2pt}\begin{minipage}{\linewidth}#1\textbf{#2}\par\vspace{-3pt}
  \[ \begin{gathered} #3 \end{gathered} \]\vspace{-6pt}\end{minipage}\par}
\begin{document}
\begin{multicols}{2}
''' + '\n'.join(body) + r'''
\end{multicols}
\end{document}
'''
    tmp = tempfile.mkdtemp()
    tex = os.path.join(tmp, 'formulario.tex')
    open(tex, 'w').write(doc)
    for _ in range(2):
        r = subprocess.run(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', 'formulario.tex'],
                           cwd=tmp, capture_output=True, text=True)
        if r.returncode:
            print(r.stdout[-3000:]); sys.exit(1)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    shutil.copy(os.path.join(tmp, 'formulario.pdf'), OUT)
    shutil.copy(tex, os.path.join(ROOT, 'tools', 'formulario.tex'))
    print(f'{n} fórmulas -> {OUT}')


if __name__ == '__main__':
    build()
