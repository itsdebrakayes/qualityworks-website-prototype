## Manual inspection log

Visual review of full-page screenshots at 360 / 768 / 1024 / 1440 px for 16 key routes (`qa-output/evidence/{width}-{route}.png`), plus targeted interaction checks. Defects found by manual or automated review were fixed and re-tested before this report was generated.

| ID | Page/component | Finding | Status |
|---|---|---|---|
| MQ-01 | Contact intro, product heroes | Text on dark surfaces that were not `.section` elements inherited the light-page body colour (near-invisible). **axe did not flag it** because text over gradient backgrounds is reported as “needs review”, not as a violation | Fixed: surface classes set their own text colour. Re-checked at all widths |
| MQ-02 | Case-study metrics, migrated articles | Single characters (right arrow, approximately-equal sign, superscript digits) rendered in a fallback font | Fixed: SVG arrow component, glyph normalisation, build-time `glyph-lint` + QA-09 |
| MQ-03 | Breadcrumbs @360 | Long current-page crumb forced horizontal scroll | Fixed (truncation inside flexible item) |
| MQ-04 | Tables in scroll containers | Visually-hidden link text escaped the scroll clip and widened the page | Fixed (`position: relative` on scroll containers) |
| MQ-05 | Mega-menu | Diagonal pointer path across sibling triggers replaced the open panel | Fixed (switch intent 200 ms); QA-10 |
| MQ-06 | Header @1024 | Navigation collapsed to the drawer at small-desktop width | Fixed: desktop nav from 1024 px with compact spacing |
| MQ-07 | Case-study images | Some migrated images are film posters/stock (e.g. Star Wars artwork) | **Open:** image-rights review (D-10) |
| MQ-08 | 200% zoom | Approximated with a 640 px viewport (QA-07-640); real browser zoom and text-only zoom not tested | **Partially verified** |
| MQ-09 | Touch | Drawer tested with touch emulation; desktop menus open on click/tap, hover is never required | Pass |
| MQ-10 | Consistency | All 96 routes render the same Header, Footer, Button and card components (no page-specific copies) | Pass (code review) |
| MQ-11 | Fictional content | Every `fixture` record renders `FixtureLabel` or a “[Fixture]” title; simulated controls are labelled | Pass (code review + screenshots) |
| MQ-12 | Claims | Every statistic renders a claim reference (build fails without one); review mode shows IDs | Pass |
| MQ-13 | Integrations | No real HubSpot, WPForms, BambooHR or marketplace integration is presented as tested | Pass (labelled as simulated or Blocked) |

### Review round 1 (18 Nov 2026)

| ID | Page/component | Finding | Status |
|---|---|---|---|
| MQ-14 | WSSC case study | Survey figure (“67% … 50%+”) still present after the brief's corrections | Fixed (R-39); grep confirms 0 |
| MQ-15 | All case-study detail pages | Migration defect: sections were cut at 1,400 characters (mid-word), and the old site's related-links titles were appended to “The result” | Fixed (R-47): parser cap removed, trailing titles stripped; all 17 stories end on a complete sentence or list item |
| MQ-16 | Homepage awards row | AIAT award label wraps to 2 lines with an administrator note; alignment differs from the single-line Inc. item | Accepted (readable at all widths) |
| MQ-17 | Agents as a Service | Labels legend renders on the dark product surface with sufficient contrast; the filter still works | Pass (visual) |
| MQ-18 | Mobile drawer @360 | “Case Studies” and “Resource Hub” listed by name; no duplicate overview links | Pass (QA-14 + visual) |
| MQ-19 | Release build | Review markers absent outside the declared blockers | Pass (release gate) |
| MQ-20 | Browsers | Only Chromium tested; Safari, Firefox and Edge **not tested** | Open |
