#!/usr/bin/env python3
"""Generate Cryo-EM v3 HTML slides from PPTX metadata."""

import json
import os

BASE = "/Volumes/TKR02ex/hanseonk/coding"
META = os.path.join(BASE, "cryo-slides-img", "slides_v2.json")
OUT = os.path.join(BASE, "cryo-em-v3")

with open(META) as f:
    all_slides = {s["num"]: s for s in json.load(f)}

# ── Slide groupings per section ──
# Each entry: (internal_slide_number, [pptx_slide_nums], title_override)

SEC1_SLIDES = [
    ([3, 4], "Cryo-EM"),
    ([5, 6], "Electron Microscope & Biological Samples"),
    ([7], "Cryo-electron Microscope"),
    ([8, 9], "From Blobs to High Resolution"),
    ([10], "From Blobs to High Resolution (2013–2015)"),
    ([11], "From Blobs to High Resolution (2016–2020)"),
    ([12, 13], "From Blobs to High Resolution"),
    ([14, 15], "PDB Entries Categorized by Method"),
    ([16, 17], "Different Structural Biology Methods in PDB"),
    ([18], "5 – 10 Å Resolution"),
    ([19], "30 kDa Protein (0.9 Å)"),
    ([20, 21], "A Structural Biologist's Dream"),
    ([22], "Cryo-EM Workflow"),
    ([23], "단백질 정제"),
    ([24, 25], "Sample Preparation Overview"),
    ([26], "The Process…"),
    ([27], "From Blobs to High Resolution – Korea"),
    ([28], "First Titan Krios in Korea: 2018"),
    ([29], "GPCR"),
    ([30], "Drug Targets – E3 Ligases / PROTAC"),
    ([31, 32], "Drug Targets – Biologics (de novo protein design)"),
    ([33, 34], "Cryo-EM CRO & Biotech"),
    ([35], "Data Processing in 'Cloud'"),
]

SEC2_SLIDES = [
    ([36, 37], "Sample Preparation"),
    ([38], "Goal of Sample Preparation"),
    ([39, 40], "Sample and Grid Preparation"),
    ([41], "Sample Homogeneity Assessment"),
    ([42, 43], "Negative Staining vs. Cryo-EM"),
    ([44], "Low Signal-to-Noise Ratio"),
    ([45, 46], "Size Augmentation Strategies"),
    ([47], "Size Augmentation – Approaches"),
    ([48, 49, 50], "Ordered Mass, Not MW"),
    ([51], "Henderson 1995 – Size Limit"),
    ([52], "Sigworth 2016 – Resolution Trends"),
    ([53, 54], "Recent Size Limit Studies"),
    ([55], "Grid Production Guide"),
    ([56], "Grid Handling"),
    ([57], "Grid Preparation (Vitrification)"),
    ([58, 59], "Automated Grid Preparation"),
    ([60], "Grid Preparation & Screening Time"),
    ([61], "Atlas View"),
    ([62], "Square View"),
    ([63], "Hole View – Ideal"),
    ([64, 65], "Hole View – Crystalline Ice & Aggregation"),
    ([66], "Hole View – Concentration Issue"),
    ([67], "Hole View – Contamination"),
    ([68, 69], "Hole View – Other Ice Issues"),
    ([70], "Air-Water Interface (AWI)"),
    ([71, 72], "Spot-to-Plunge Time Effect"),
    ([73], "Support Films"),
    ([74], "Grid Optimization"),
    ([75], "Sample Requirements Summary"),
]

SEC3_SLIDES = [
    ([76, 77], "Imaging"),
    ([78], "Proteins Are Dynamic Molecules"),
    ([79], "Micrographs"),
    ([80], "Data Collection Workflow"),
    ([81], "Particles vs. Resolution"),
    ([82], "Contrast vs. High-Resolution Information"),
    ([83, 84], "Defocus: −1.5 μm & −0.75 μm"),
    ([85], "At Focus"),
    ([86, 87], "Defocus: −3.0 μm & +3.0 μm"),
    ([88], "Hole Targeting Strategy"),
    ([89, 90, 91], "User Decisions & Collection Settings"),
    ([92, 93], "Laser Phase Plate"),
]

SEC4_SLIDES = [
    ([94, 95], "Data Processing"),
    ([96, 97], "Micrograph Quality Assessment"),
    ([98], "Cryo-EM Map – 2D"),
    ([99, 100], "Fourier Transform & Spatial Frequencies"),
    ([101], "Contrast Transfer Function (CTF)"),
    ([102], "Understanding Raw Cryo-EM Data"),
    ([103], "Beam Damage & Long Exposure"),
    ([104], "Motion Correction"),
    ([105, 106], "CTF Correction – SNR Optimization"),
    ([107, 108], "CTF Parameter Estimation (1)"),
    ([109, 110], "CTF Parameter Estimation (2)"),
    ([111, 112], "Particle Selection & Signal Enhancement"),
    ([113, 114], "Particle Picking Methods"),
    ([115, 116, 117], "2D Classification"),
    ([118], "Fourier Slice Theorem"),
    ([119, 120], "3D Reconstruction – Initial Map"),
    ([121, 122], "3D Reconstruction – Map Optimization"),
    ([123], "Resolution – Bragg's Law"),
    ([124, 125], "Map Resolution"),
    ([126, 127], "Conformational Variability"),
    ([128, 129], "Rosenthal Plot – Particles vs. Resolution"),
    ([130], "Size Limitation Revisited"),
    ([131, 132], "감사합니다"),
]

SECTIONS = [
    ("overview", "Cryo-EM Overview", SEC1_SLIDES, "#7c3aed"),
    ("sample-prep", "Sample Preparation", SEC2_SLIDES, "#059669"),
    ("imaging", "Imaging", SEC3_SLIDES, "#2563eb"),
    ("processing", "Data Processing", SEC4_SLIDES, "#dc2626"),
]


def build_slide_content(pptx_nums):
    """Build HTML content for one internal slide from one or more PPTX slides."""
    # Collect ALL images and text across all pptx slides in this group
    all_images = []
    all_text_blocks = []

    for num in pptx_nums:
        s = all_slides.get(num)
        if not s:
            continue

        for img in s.get("images", []):
            all_images.append(img)

        for t in s.get("texts", []):
            lines = [l for l in t.get("lines", []) if l.strip()]
            if not lines:
                continue
            font_size = t.get("font_size", 18)
            bold = t.get("bold", False)
            all_text_blocks.append({
                "lines": lines,
                "font_size": font_size,
                "bold": bold,
            })

    has_images = len(all_images) > 0
    has_text = len(all_text_blocks) > 0
    total_text_chars = sum(sum(len(l) for l in tb["lines"]) for tb in all_text_blocks)

    # Build image HTML
    def img_html():
        parts = []
        if len(all_images) == 1:
            img = all_images[0]
            parts.append(
                f'<div class="img-single">'
                f'<img src="../cryo-slides-img/{img["file"]}" alt="" loading="lazy">'
                f'</div>'
            )
        elif len(all_images) <= 4:
            parts.append('<div class="img-grid g' + str(len(all_images)) + '">')
            for img in all_images:
                parts.append(
                    f'<img src="../cryo-slides-img/{img["file"]}" alt="" loading="lazy">'
                )
            parts.append('</div>')
        else:
            # Many images
            cols = 4 if len(all_images) >= 7 else 3
            parts.append(f'<div class="img-grid gm gc{cols}">')
            for img in all_images:
                parts.append(
                    f'<img src="../cryo-slides-img/{img["file"]}" alt="" loading="lazy">'
                )
            parts.append('</div>')
        return "\n".join(parts)

    # Build text HTML
    def text_html(compact=False):
        parts = []
        for tb in all_text_blocks:
            cls = "text-block"
            if tb["bold"]:
                cls += " bold"
            if compact:
                cls += " text-sm"
            else:
                fs = tb["font_size"]
                if fs and fs >= 24:
                    cls += " text-lg"
                elif fs and fs >= 18:
                    cls += " text-md"
                else:
                    cls += " text-sm"

            parts.append(f'<div class="{cls}">')
            for line in tb["lines"]:
                line_esc = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                parts.append(f'  <p>{line_esc}</p>')
            parts.append('</div>')
        return "\n".join(parts)

    # ── Layout decision ──
    if has_images and has_text:
        if total_text_chars > 300:
            # Lots of text: side-by-side layout (images left 60%, text right 40%)
            return (
                f'<div class="layout-split">\n'
                f'  <div class="split-img">\n{img_html()}\n  </div>\n'
                f'  <div class="split-text">\n{text_html(compact=True)}\n  </div>\n'
                f'</div>'
            )
        else:
            # Little text: images on top (flex:1), text below (compact)
            return f'{img_html()}\n{text_html(compact=True)}'
    elif has_images:
        return img_html()
    elif has_text:
        return text_html()
    else:
        return '<div class="text-block text-md"><p>(No content)</p></div>'


def generate_section_html(filename, section_title, slides_def, accent_color):
    """Generate a full section HTML file with internal slide navigation."""
    N = len(slides_def)

    # Build all slide divs
    slide_divs = []
    for i, (pptx_nums, title) in enumerate(slides_def):
        n = i + 1
        active = ' active' if n == 1 else ''
        content = build_slide_content(pptx_nums)

        # Reference info
        refs = []
        for num in pptx_nums:
            s = all_slides.get(num)
            if s:
                for t in s.get("texts", []):
                    for l in t.get("lines", []):
                        l_lower = l.lower()
                        if any(kw in l_lower for kw in ["et al", "doi:", "http", "2020", "2021", "2022", "2023", "2024", "2025", "2019", "2018", "2017", "2016", "1995"]):
                            if len(l.strip()) > 10 and len(l.strip()) < 200:
                                refs.append(l.strip())

        # Unique refs
        refs = list(dict.fromkeys(refs))[:3]  # max 3
        ref_html = ""
        if refs:
            ref_lines = " &middot; ".join(
                r.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")[:80]
                for r in refs
            )
            ref_html = f'<div class="slide-ref">{ref_lines}</div>'

        pptx_label = ", ".join(f"p{n}" for n in pptx_nums)
        title_esc = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

        slide_divs.append(f'''  <div class="slide{active}" data-n="{n}">
    <div class="slide-title">{title_esc}</div>
    <div class="slide-body">
{content}
    </div>
    {ref_html}
    <div class="slide-pptx">PPTX: {pptx_label}</div>
  </div>''')

    slides_html = "\n".join(slide_divs)

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{section_title} – Cryo-EM Tutorial</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  background: #f0f0f5;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1a1a2e;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}}

/* ── Header ── */
.topbar {{
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  background: #fff;
  border-bottom: 2px solid #e0e0e8;
  gap: 8px;
  min-height: 44px;
}}
.topbar .home-btn {{
  display: flex; align-items: center; gap: 4px;
  padding: 4px 12px; border-radius: 20px;
  border: 2px solid #e0e0e8; background: #fff;
  color: #666; font-size: clamp(11px, 1.3vh, 15px); font-weight: 700;
  text-decoration: none; transition: all 0.2s;
  white-space: nowrap;
}}
.topbar .home-btn:hover {{ background: #f5f3ff; color: {accent_color}; border-color: #c4b5fd; }}
.topbar .section-name {{
  font-size: clamp(14px, 1.8vh, 22px);
  font-weight: 800;
  color: {accent_color};
  text-align: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}}
.topbar .nav-group {{
  display: flex; align-items: center; gap: 6px;
  white-space: nowrap;
}}
.nav-btn {{
  padding: 4px 10px; border-radius: 8px;
  border: 2px solid #e0e0e8; background: #fff;
  color: #555; font-size: clamp(13px, 1.5vh, 18px); font-weight: 700;
  cursor: pointer; transition: all 0.15s;
  line-height: 1;
}}
.nav-btn:hover {{ background: #f5f3ff; border-color: #c4b5fd; color: {accent_color}; }}
.nav-btn:disabled {{ opacity: 0.3; cursor: default; }}
.page-info {{
  font-size: clamp(11px, 1.2vh, 15px);
  color: #888; font-weight: 600;
  min-width: 50px; text-align: center;
}}

/* ── Slide container ── */
.slides-area {{
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}}
.slide {{
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  padding: clamp(8px, 1.2vh, 16px) clamp(12px, 2vw, 32px);
  overflow: hidden;
}}
.slide.active {{
  display: flex;
}}
.slide-title {{
  font-size: clamp(18px, 2.8vh, 34px);
  font-weight: 800;
  color: #1a1a2e;
  text-align: center;
  padding: 2px 0 clamp(4px, 0.8vh, 10px);
  flex-shrink: 0;
  line-height: 1.2;
}}
.slide-body {{
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.6vh, 10px);
  overflow: hidden;
}}
/* Text-only slides: center vertically */
.slide-body:not(:has(.img-single)):not(:has(.img-grid)):not(:has(.layout-split)) {{
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}}
.slide-ref {{
  flex-shrink: 0;
  font-size: clamp(8px, 0.9vh, 11px);
  color: #aaa;
  text-align: center;
  padding: 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}}
.slide-pptx {{
  flex-shrink: 0;
  font-size: clamp(7px, 0.7vh, 9px);
  color: #ccc;
  text-align: right;
  padding: 0 4px;
}}

/* ── Image layouts ── */
.img-single {{
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}}
.img-single img {{
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}}

.img-grid {{
  flex: 1;
  min-height: 0;
  display: grid;
  gap: clamp(4px, 0.5vh, 8px);
  overflow: hidden;
}}
.img-grid img {{
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}}
.img-grid.g2 {{ grid-template-columns: 1fr 1fr; }}
.img-grid.g3 {{ grid-template-columns: 1fr 1fr 1fr; }}
.img-grid.g4 {{ grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }}
.img-grid.gm {{
  grid-template-columns: repeat(auto-fill, minmax(min(180px, 28%), 1fr));
  grid-auto-rows: 1fr;
  align-items: center;
}}
.img-grid.gc3 {{ grid-template-columns: repeat(3, 1fr); }}
.img-grid.gc4 {{ grid-template-columns: repeat(4, 1fr); }}

/* ── Text blocks ── */
.text-block {{
  flex-shrink: 0;
  padding: clamp(2px, 0.3vh, 6px) clamp(8px, 1vw, 16px);
}}
.text-block p {{
  margin-bottom: 1px;
  line-height: 1.35;
}}
.text-block.bold p {{ font-weight: 700; }}
.text-block.text-lg p {{ font-size: clamp(14px, 2vh, 26px); }}
.text-block.text-md p {{ font-size: clamp(12px, 1.5vh, 20px); }}
.text-block.text-sm p {{ font-size: clamp(10px, 1.2vh, 16px); color: #444; }}

/* ── Split layout: images left, text right ── */
.layout-split {{
  flex: 1;
  min-height: 0;
  display: flex;
  gap: clamp(8px, 1vw, 16px);
  overflow: hidden;
}}
.split-img {{
  flex: 3;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}}
.split-img .img-single,
.split-img .img-grid {{
  flex: 1;
  min-height: 0;
}}
.split-text {{
  flex: 2;
  min-width: 0;
  overflow-y: auto;
  padding-right: 4px;
}}
</style>
</head>
<body>

<div class="topbar">
  <a class="home-btn" href="index.html">&larr; Home</a>
  <div class="section-name">{section_title}</div>
  <div class="nav-group">
    <button class="nav-btn" id="prev-btn" onclick="go(-1)">&lsaquo;</button>
    <span class="page-info" id="page-info">1 / {N}</span>
    <button class="nav-btn" id="next-btn" onclick="go(1)">&rsaquo;</button>
  </div>
</div>

<div class="slides-area">
{slides_html}
</div>

<script>
const N = {N};
let cur = 1;

function show(n) {{
  n = Math.max(1, Math.min(N, n));
  const prev = document.querySelector('.slide.active');
  if (prev) prev.classList.remove('active');
  const next = document.querySelector('[data-n="' + n + '"]');
  if (next) next.classList.add('active');
  cur = n;
  document.getElementById('page-info').textContent = cur + ' / ' + N;
  document.getElementById('prev-btn').disabled = (cur === 1);
  document.getElementById('next-btn').disabled = (cur === N);
}}

function go(d) {{ show(cur + d); }}

document.addEventListener('keydown', e => {{
  if (e.key === 'ArrowLeft') {{ go(-1); e.preventDefault(); }}
  else if (e.key === 'ArrowRight') {{ go(1); e.preventDefault(); }}
  else if (e.key === 'Home') {{ show(1); e.preventDefault(); }}
  else if (e.key === 'End') {{ show(N); e.preventDefault(); }}
}});

// Touch swipe
let tx = 0;
document.addEventListener('touchstart', e => {{ tx = e.touches[0].clientX; }});
document.addEventListener('touchend', e => {{
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
}});

show(1);
</script>

</body>
</html>'''

    outpath = os.path.join(OUT, filename)
    with open(outpath, "w") as f:
        f.write(html)
    print(f"  Generated {filename} ({N} slides)")


def generate_index():
    """Generate index.html with 4 section cards."""
    html = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cryo-EM Tutorial v3</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #f0f0f5;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1a1a2e;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.container {
  max-width: 900px;
  width: 100%;
}
.title {
  text-align: center;
  margin-bottom: 40px;
}
.title h1 {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.1;
}
.title p {
  font-size: clamp(14px, 2vw, 20px);
  color: #888;
  margin-top: 8px;
  font-weight: 500;
}
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 600px) {
  .cards { grid-template-columns: 1fr; }
}
.card {
  background: #fff;
  border: 2px solid #e0e0e8;
  border-radius: 16px;
  padding: clamp(20px, 3vw, 32px);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.card .num {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 900;
  line-height: 1;
}
.card .name {
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 800;
}
.card .desc {
  font-size: clamp(12px, 1.5vw, 16px);
  color: #888;
  font-weight: 500;
}
.card .count {
  font-size: clamp(11px, 1.2vw, 14px);
  color: #aaa;
  font-weight: 600;
  margin-top: 4px;
}

.card.c1 { border-color: #c4b5fd; }
.card.c1:hover { border-color: #7c3aed; }
.card.c1 .num { color: #7c3aed; }

.card.c2 { border-color: #a7f3d0; }
.card.c2:hover { border-color: #059669; }
.card.c2 .num { color: #059669; }

.card.c3 { border-color: #bfdbfe; }
.card.c3:hover { border-color: #2563eb; }
.card.c3 .num { color: #2563eb; }

.card.c4 { border-color: #fecaca; }
.card.c4:hover { border-color: #dc2626; }
.card.c4 .num { color: #dc2626; }

.footer {
  text-align: center;
  margin-top: 40px;
  font-size: clamp(11px, 1.2vw, 14px);
  color: #bbb;
}
</style>
</head>
<body>
<div class="container">
  <div class="title">
    <h1>Cryo-EM Tutorial</h1>
    <p>서울대 기기원 Cryo-EM Workshop</p>
  </div>
  <div class="cards">
    <a class="card c1" href="overview.html">
      <div class="num">01</div>
      <div class="name">Cryo-EM Overview</div>
      <div class="desc">Introduction, history, PDB statistics, Korean facilities</div>
      <div class="count">23 slides</div>
    </a>
    <a class="card c2" href="sample-prep.html">
      <div class="num">02</div>
      <div class="name">Sample Preparation</div>
      <div class="desc">Grid preparation, vitrification, screening, ice quality</div>
      <div class="count">29 slides</div>
    </a>
    <a class="card c3" href="imaging.html">
      <div class="num">03</div>
      <div class="name">Imaging</div>
      <div class="desc">Data collection, defocus, contrast, phase plate</div>
      <div class="count">12 slides</div>
    </a>
    <a class="card c4" href="processing.html">
      <div class="num">04</div>
      <div class="name">Data Processing</div>
      <div class="desc">CTF, motion correction, 2D/3D classification, resolution</div>
      <div class="count">23 slides</div>
    </a>
  </div>
  <div class="footer">v3 &middot; Based on 130 PPTX slides</div>
</div>
</body>
</html>'''

    outpath = os.path.join(OUT, "index.html")
    with open(outpath, "w") as f:
        f.write(html)
    print("  Generated index.html")


# ── Main ──
print("Generating Cryo-EM v3 HTML slides...")
generate_index()
for filename_base, title, slides_def, color in SECTIONS:
    generate_section_html(f"{filename_base}.html", title, slides_def, color)

print(f"\nDone! Files in: {OUT}")
print(f"Total slides: {sum(len(s[2]) for s in SECTIONS)}")
