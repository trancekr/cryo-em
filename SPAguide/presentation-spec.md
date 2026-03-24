# Cryo-EM SPA Tutorial — Presentation Spec

## Meta
- title: Cryo-EM SPA Guide
- target-file: overview.html
- resolution: 1920x1080
- image-dir: ../cryo-slides-img/
- editor: editor.js
- validator: check-slide-design.js

## Sections
- overview: slides 1-23, status: in-review
- sample-prep: planned (~27 slides)
- imaging: planned (~12 slides)
- data-processing: planned (~23 slides)

---

## Slides

### Slide 1: Cover
- layout: hero (fullbleed)
- status: complete
- references: none
- images:
  - file: cryo-em-compare.png
    source: user-provided
    used-on: [1, 2]

### Slide 2: What is Cryo-EM? (tweet)
- layout: hero (blur background + centered image)
- status: complete
- references: none
- images:
  - file: s004_3.png
    source: Twitter screenshot
    used-on: [2]

### Slide 3: Electron Microscopy & Biological Samples
- layout: layout-two-cards
- status: review
- references:
  - doi: 10.1017/S0033583500004297
    display: "Dubochet et al., Q Rev Biophys (1988)"
    verified: true
    content-match: pending
  - doi: 10.1016/S0022-5320(71)80118-1
    display: "Glaeser, J Ultrastruct Res (1971)"
    verified: true
    content-match: pending
  - doi: 10.1126/science.186.4168.1036
    display: "Taylor & Glaeser, Science (1974)"
    verified: true
    content-match: pending

### Slide 4: Conventional TEM vs Cryo-EM
- layout: layout-two-cards
- status: review
- references:
  - doi: 10.1016/bs.mie.2016.04.011
    display: "Images: Passmore & Russo, Methods Enzymol (2016)"
    verified: true
    content-match: pending
- images:
  - file: neg_stain_crop.jpg
    source: Passmore & Russo 2016
    used-on: [4]
  - file: cryo_em_crop.jpg
    source: Passmore & Russo 2016
    used-on: [4]

### Slide 5: Key Components of Modern Cryo-TEM
- layout: 3-column grid
- status: review
- references:
  - doi: 10.1016/j.ultramic.2009.04.002
    display: "McMullan et al., Ultramicroscopy (2009)"
    verified: true
    content-match: pending
  - doi: 10.1017/S0033583511000035
    display: "Faruqi & McMullan, Q Rev Biophys (2011)"
    verified: true
    content-match: pending
  - url: https://myscope.training
    display: "MyScope, Microscopy Australia"
    type: website

### Slide 6: From Blobs to High Resolution
- layout: before-after overlay
- status: review
- references:
  - doi: 10.1126/science.1251652
    display: "Kühlbrandt, Science (2014)"
    verified: true
    content-match: pending
  - doi: 10.1038/nmeth.2472
    display: "Li et al., Nat Methods (2013)"
    verified: true
    content-match: pending
  - doi: 10.1016/j.tibs.2014.10.005
    display: "Bai et al., TiBS (2015)"
    verified: true
    content-match: pending

### Slide 7: History 1968-1982
- layout: history-grid (3-column)
- status: review
- references:
  - doi: 10.1038/217130a0
    display: "DeRosier & Klug, Nature (1968)"
    verified: true
    content-match: pending
  - doi: 10.1126/science.186.4168.1036
    display: "Taylor & Glaeser, Science (1974)"
    verified: true
    content-match: pending
  - doi: 10.1111/j.1365-2818.1981.tb02483.x
    display: "Dubochet & McDowall, J Microsc (1982)"
    verified: true
    content-match: pending
  - url: https://www.youtube.com/watch?v=Y6sB8aSSck8&list=PLOyuQaVrp4qptpASFzwFCmjsGtWkG5dSb
    display: "Eva Nogales, Cryo-EM Conference"
    type: video

### Slide 8: History 1987-1994
- layout: history-grid (3-column)
- status: review
- references:
  - doi: 10.1016/0304-3991(87)90078-7
    display: "van Heel, Ultramicroscopy (1987)"
    verified: true
    content-match: pending
  - doi: 10.1016/S0022-2836(05)80271-2
    display: "Henderson et al., J Mol Biol (1990)"
    verified: true
    content-match: pending
  - doi: 10.1016/0304-3991(94)90038-8
    display: "Penczek, Grassucci & Frank, Ultramicroscopy (1994)"
    verified: true
    content-match: pending
    notes: "DOI 수정 (90003-5→90038-8). 실제 논문: 'The ribosome at improved resolution'"

### Slide 9: History 1997-2008
- layout: history-grid (3-column)
- status: review
- references:
  - doi: 10.1038/386088a0
    display: "Böttcher et al., Nature (1997)"
    verified: true
    content-match: pending
  - doi: 10.1038/386091a0
    display: "Conway et al., Nature (1997)"
    verified: true
    content-match: pending
  - doi: 10.1006/jsbi.1998.4014
    display: "Sigworth, J Struct Biol (1998)"
    verified: true
    content-match: pending
  - doi: 10.1038/nature06893
    display: "Yu, Jin & Zhou, Nature (2008)"
    verified: true
    content-match: pending
    notes: "DOI 수정 (06923→06893). 실제 논문: '3.88 Å structure of CPV by cryo-EM'"

### Slide 10: History 2012-2013
- layout: history-grid (3-column)
- status: review
- references:
  - doi: 10.1038/nmeth.2472
    display: "Li et al., Nat Methods (2013)"
    verified: true
    content-match: pending
  - doi: 10.7554/eLife.00461
    display: "Bai et al., eLife (2013)"
    verified: true
    content-match: pending
  - doi: 10.1038/nature12822
    display: "Liao et al., Nature (2013)"
    verified: true
    content-match: pending

### Slide 11: Breaking the 3 Å Barrier (2015)
- layout: history-grid (3-column)
- status: review
- references:
  - doi: 10.1038/nature14892
    display: "Bai et al., Nature (2015)"
    verified: true
    content-match: pending
  - doi: 10.7554/eLife.06380
    display: "Campbell et al., eLife (2015)"
    verified: true
    content-match: pending
  - doi: 10.1126/science.aab1576
    display: "Bartesaghi et al., Science (2015)"
    verified: true
    content-match: pending

### Slide 12: Landmark Reviews
- layout: 3-card journal pages
- status: review
- references:
  - doi: 10.1126/science.1251652
    display: "Kühlbrandt, Science (2014)"
    verified: true
    content-match: pending
  - doi: 10.1016/j.tibs.2014.10.005
    display: "Bai, McMullan & Scheres, TiBS (2015)"
    verified: true
    content-match: pending
    notes: "DOI 수정 (2015.08.005→2014.10.005). 실제 논문: 'How cryo-EM is revolutionizing structural biology'"
  - doi: 10.1038/525172a
    display: "Callaway, Nature (2015)"
    verified: true
    content-match: pending

### Slide 13: Nobel Prize 2017
- layout: 3-portrait cards
- status: complete
- references:
  - url: https://www.nobelprize.org/prizes/chemistry/2017/summary/
    display: "The Royal Swedish Academy of Sciences (2017)"
    type: website

### Slide 14: PDB Statistics
- layout: chart + info cards
- status: review
- references:
  - url: https://www.rcsb.org/stats
    display: "RCSB PDB Statistics"
    type: website
  - url: https://www.wwpdb.org/documentation/annual-reports
    display: "wwPDB Annual Report"
    type: website
  - url: https://www.ebi.ac.uk/emdb/
    display: "EMDB"
    type: website

### Slide 15: MW Distribution
- layout: chart + info cards
- status: review
- references:
  - url: https://search.rcsb.org
    display: "RCSB PDB Search API"
    type: website
- notes: 251,217 entries queried, March 2026

### Slide 16: Cryo-EM Methodology
- layout: centered image
- status: review
- references: none
- notes: "기존 DOI(10.1016/j.sbi.2020.06.007)는 MD 시뮬레이션 논문 — 삭제됨. 올바른 레퍼런스 필요"

### Slide 17: Sizing Up Cryo-EM
- layout: custom (scale diagram)
- status: review
- references: none

### Slide 18: A Structural Biologist's Dream
- layout: split (image + text cards)
- status: review
- references:
  - doi: 10.1038/s41586-024-07198-2
    display: "Nogales & Mahamid, Nature (2024)"
    verified: true
    content-match: true
    notes: "이미지 출처 (s021_38.png). 'Bridging structural and cell biology with cryo-EM'"

### Slide 19: SPA Workflow — An Example
- layout: split (image + 4 step boxes)
- status: review
- references:
  - doi: 10.1016/j.xpro.2021.100855
    display: "Gangwar et al., STAR Protoc (2021)"
    verified: true
    content-match: pending
    notes: "원래 'Bhatt & Bhatt'로 표기되어 있었으나, DOI 실제 저자는 Gangwar et al. 수정 완료"

### Slide 20: SPA Workflow — Overview
- layout: 4-step cards
- status: review
- references:
  - url: https://cryoem101.org
    display: "cryoem101.org"
    type: website
  - doi: 10.1016/j.cell.2015.03.050
    display: "Cheng et al., Cell (2015)"
    verified: true
    content-match: pending
  - doi: 10.1016/bs.mie.2016.04.011
    display: "Passmore & Russo, Methods Enzymol (2016)"
    verified: true
    content-match: pending

### Slide 21: Where Does the Time & Money Go?
- layout: image + 3 info cards
- status: review
- references:
  - doi: 10.1039/d2fd00129b
    display: "Halfon et al., Faraday Discuss (2022)"
    verified: true
    content-match: pending
  - doi: 10.1038/s41592-021-01130-6
    display: "Weissenberger et al., Nat Methods (2021)"
    verified: true
    content-match: pending
  - doi: 10.1107/s2059798318006496
    display: "Drulyte et al., Acta Cryst D (2018)"
    verified: true
    content-match: pending

### Slide 22: Problems and Limitations
- layout: 3-column topic cards + info panel
- status: review
- references:
  - doi: 10.1038/nmeth.3695
    display: "Glaeser, Nat Methods (2016)"
    verified: true
    content-match: pending
  - doi: 10.1107/s2059798318006496
    display: "Drulyte et al., Acta Cryst D (2018)"
    verified: true
    content-match: pending
  - doi: 10.1073/pnas.1314449110
    display: "Henderson, PNAS (2013)"
    verified: true
    content-match: pending
    notes: "원래 'Angew Chem'으로 표기. 실제는 PNAS. 수정 완료."

### Slide 23: The Reality — Slow, Manual, Non-reproducible
- layout: 3-column topic cards
- status: review
- references:
  - doi: 10.1038/nmeth.3695
    display: "Glaeser, Nat Methods (2016)"
    verified: true
    content-match: pending
  - doi: 10.1107/s2059798318006496
    display: "Drulyte et al., Acta Cryst D (2018)"
    verified: true
    content-match: pending
- design-locked-values:
  - slide-23-microscopy-img: { width: "545px", height: "224px" }
- known-issues:
  - "Microscopy 이미지 왼쪽 100px 크롭 시 현미경 잘림 — 재크롭 필요"
  - "3개 컬럼 이미지/텍스트 높이 통일 필요"
  - "화살표 5개 위치 에디터에서 조정 완료"
