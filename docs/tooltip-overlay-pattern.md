# Tooltip Overlay Pattern

Use this pattern for hover help on compact UI elements, especially code lines, buttons, and dense controls.

## Goal

Show short contextual help without changing layout height, moving nearby content, or making the interface feel noisy.

## Interaction Rules

- The tooltip appears only on hover or focus when the trigger is an interactive control.
- The tooltip is an overlay, not an inserted DOM row.
- The tooltip must not resize the parent section.
- Keep copy short: one sentence, usually under 8 words for buttons and under 18 words for code.
- Use muted styling: dark surface, soft gray text, subtle border, regular font weight.
- Avoid bright borders, bold text, warning colors, or large shadows.

## Visual Style

```css
.tooltip {
  position: absolute;
  z-index: 20;
  width: 190px;
  max-width: calc(100vw - 48px);
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 8px;
  background: #111827;
  color: #d6dee8;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
  padding: 9px 11px;
  pointer-events: none;
  white-space: normal;
  overflow-wrap: break-word;
}
```

## Code Line Tooltip

For code lines, keep the code block height stable by rendering the tooltip with a pseudo-element.

```css
.code-block {
  overflow: visible;
}

.code-line {
  position: relative;
}

.code-line[data-tip]::after {
  position: absolute;
  left: 42px;
  top: calc(100% + 6px);
  z-index: 20;
  width: min(360px, calc(100vw - 96px));
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 8px;
  background: #111827;
  color: #d6dee8;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34);
  content: attr(data-tip);
  font-family: Inter, system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  opacity: 0;
  padding: 10px 12px;
  pointer-events: none;
  transform: translateY(-3px);
  transition: opacity 160ms ease, transform 160ms ease;
  white-space: normal;
}

.code-line[data-tip]:hover::after {
  opacity: 1;
  transform: translateY(0);
}
```

## Button Tooltip

For buttons, anchor the tooltip above the button and keep it short.

```css
.tooltip-trigger {
  position: relative;
}

.tooltip-trigger .tooltip {
  left: 50%;
  bottom: calc(100% + 10px);
  opacity: 0;
  transform: translate(-50%, 5px);
  transition: opacity 160ms ease, transform 160ms ease;
}

.tooltip-trigger:hover .tooltip,
.tooltip-trigger:focus-visible .tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}
```

## Copy Examples

- `Click to trigger getByRole().`
- `New text is visible.`
- `Finds the button by role and name.`
- `Verifies the success text appears.`

## Avoid

- Inline tooltip rows that push code lines down.
- Tooltip text in bold by default.
- Bright yellow borders unless the tooltip is a warning.
- Long paragraphs inside tooltips.
- Tooltips that alter the accessible name of the trigger unless that is intentional.
