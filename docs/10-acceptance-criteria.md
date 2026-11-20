---
title: "10 · Example developer acceptance criteria"
summary: "Specific Given/When/Then criteria for the future backlog (no Jira tickets created)."
---

# Example developer acceptance criteria

These are **examples of the required specificity** for the backlog that follows prototype review. No Jira tickets have been created. Each criterion names the prototype screen and the automated check that already demonstrates it. The QM-112 AC ID is to be added once the SRS is accessible.

## Shared navigation
- **AC-NAV-1** (screen: any page, 1440px; check QA-10) Given a visitor on desktop with a mouse, when they hover “Solutions” and move the pointer diagonally across neighbouring triggers into the open panel, then the Solutions panel stays open, and a sibling menu opens only if the pointer rests on its trigger for at least  200 ms.
- **AC-NAV-2** (QA-12) Given keyboard focus on a top-level trigger, when Enter is pressed, then `aria-expanded="true"` is set and the panel is shown; ArrowDown moves focus to the first link; Escape closes the panel and returns focus to the trigger; tabbing past the last link closes the panel.
- **AC-NAV-3** (QA-14) Given a visitor on a 360px viewport, when “Menu” is activated, then a modal navigation opens with focus inside it, contains every destination present in the desktop menu (same data source), keeps focus within the dialog, and on Escape or Close returns focus to “Menu” without trapping it.
- **AC-NAV-4** (QA-13) Given a visitor on any service page, then the “Solutions” trigger shows the active indicator, includes the hidden text “(current section)”, and the matching menu link has `aria-current="page"`.

## Homepage
- **AC-HOME-1** (QA-16) Given a 1440×900 viewport, then the H1, two hero CTAs (“Talk to an expert” to `/contact-us/`, “Explore solutions” to `/services/`) and all three pathway links are visible without scrolling.
- **AC-HOME-2** Given any statistic on the homepage, then it references an approved claim ID; the build fails if a statistic has no claim record.
- **AC-HOME-3** Given no upcoming events in the data source, then the events band shows the fallback message and lists past/TBC events without registration links.

## Contact form
- **AC-FORM-1** (QA-18) Given the empty form, when Send is activated, then an error summary listing each missing required field receives focus, each field is `aria-invalid="true"` and has an associated error message, and nothing is sent.
- **AC-FORM-2** (QA-19) Given “not-an-email” in Email, when the field loses focus after a first submit attempt, then the message “Enter an email address in the format name@company.com” is shown and linked via `aria-describedby`.
- **AC-FORM-3** (QA-21/22) Given a valid form with consent, when submitted, then the button shows a busy state; on 2xx the success panel receives focus and names the email; on error a `role="alert"` message appears, the entered values are kept, and the visitor can retry. *Integration with the approved CRM endpoint must be verified with test credentials (Q-03).*

## Case studies
- **AC-CS-1** (QA-23) Given the case-study list, when Industry = Finance & Banking and Service = Test Automation are selected, then only matching cards remain, the count is announced politely, the URL contains both parameters, and reloading that URL restores the same state.
- **AC-CS-2** Given a filter combination with no matches, then the empty state appears with a working “Clear filters” control that restores all records and moves focus to the first filter.
- **AC-CS-3** Given a case study whose `clientDisclosureApproved` is not `true`, then the client name is replaced with the approved anonymous descriptor and the page is `noindex`.

## Events, careers
- **AC-EV-1** (QA-26) Given an event whose end date is before the current date, then no registration link is rendered on any page, and its status reads “Past event”.
- **AC-JOB-1** (QA-27) Given the BambooHR list returns zero jobs, then the careers page shows “No open roles right now” and a link to the BambooHR careers page; given the request fails or times out (5s), then a warning with a direct BambooHR link is shown; there is no file upload on the site.

## Typography and accessibility
- **AC-TYPE-1** (QA-9) Given any page, then every rendered glyph uses Montserrat or Lato (the brand fonts; code samples excepted) (verified with CDP `getPlatformFontsForNode`); content containing unsupported characters is normalised per doc 04 §11.
- **AC-A11Y-1** (QA-8) Given any template, then axe-core reports zero WCAG 2.2 A/AA violations, and a manual screen-reader pass of the six persona journeys is recorded before release.
- **AC-RESP-1** (QA-7) Given widths 360, 640, 768, 1024 and 1440 px, then no page scrolls horizontally.
