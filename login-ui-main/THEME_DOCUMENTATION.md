# Color Theme Documentation

## Overview
This project uses a dark/light theme system controlled by the `data-theme` attribute on the `<html>` element. Theme changes are stored in localStorage under `netpay-theme`.

---

## Dark Theme (Default)

### CSS Variables

| Variable | HSL Value | Description |
|----------|-----------|-------------|
| `--background` | `150 60% 3%` | Main app background |
| `--foreground` | `0 0% 98%` | Primary text |
| `--card` | `150 40% 6%` | Card backgrounds |
| `--card-foreground` | `0 0% 98%` | Card text |
| `--popover` | `150 40% 6%` | Popover backgrounds |
| `--popover-foreground` | `0 0% 98%` | Popover text |
| `--primary` | `160 84% 39%` | Primary actions/accent |
| `--primary-foreground` | `0 0% 100%` | Text on primary |
| `--secondary` | `150 30% 10%` | Secondary elements |
| `--secondary-foreground` | `0 0% 98%` | Text on secondary |
| `--muted` | `150 20% 12%` | Muted/disabled elements |
| `--muted-foreground` | `150 10% 65%` | Muted text |
| `--accent` | `160 84% 39%` | Accent color |
| `--accent-foreground` | `0 0% 100%` | Text on accent |
| `--destructive` | `0 70% 50%` | Error/destructive |
| `--destructive-foreground` | `0 0% 98%` | Text on destructive |
| `--border` | `150 20% 15%` | Border color |
| `--input` | `150 20% 15%` | Input borders |
| `--ring` | `160 84% 39%` | Focus ring |

### Hardcoded Colors (Dark)

**Aurora Background:**
- `rgba(16, 185, 129, 0.18)` - Primary gradient
- `rgba(5, 150, 105, 0.20)` - Secondary gradient
- `rgba(6, 78, 59, 0.40)` - Tertiary gradient
- `#020a07`, `#041a10`, `#02110a` - Background gradient

**Glass Effects:**
- `rgba(255, 255, 255, 0.04)` - Light variant background
- `rgba(255, 255, 255, 0.02)` - Darker variant
- `rgba(255, 255, 255, 0.08)` - Border

**Buttons:**
- `#10b981` (emerald-500) through `#047857` (emerald-700) gradient

---

## Light Theme

### CSS Variables

| Variable | HSL Value | Description |
|----------|-----------|-------------|
| `--background` | `0 0% 98%` | Main app background |
| `--foreground` | `0 0% 10%` | Primary text |
| `--card` | `0 0% 100%` | Card backgrounds |
| `--card-foreground` | `0 0% 10%` | Card text |
| `--popover` | `0 0% 100%` | Popover backgrounds |
| `--popover-foreground` | `0 0% 10%` | Popover text |
| `--primary` | `160 84% 30%` | Primary actions/accent |
| `--primary-foreground` | `0 0% 100%` | Text on primary |
| `--secondary` | `160 40% 85%` | Secondary elements |
| `--secondary-foreground` | `0 0% 10%` | Text on secondary |
| `--muted` | `160 30% 92%` | Muted/disabled |
| `--muted-foreground` | `160 10% 35%` | Muted text |
| `--accent` | `160 84% 30%` | Accent color |
| `--accent-foreground` | `0 0% 100%` | Text on accent |
| `--destructive` | `0 70% 50%` | Error/destructive |
| `--destructive-foreground` | `0 0% 100%` | Text on destructive |
| `--border` | `160 30% 80%` | Border color |
| `--input` | `160 30% 80%` | Input borders |
| `--ring` | `160 84% 30%` | Focus ring |

### Hardcoded Colors (Light)

**Backgrounds:**
- `#f0f7f3`, `#f4faf6`, `#ebf5ef` - Gradient stops
- `#f4faf6` - Body background

**Glass Effects:**
- `rgba(255, 255, 255, 0.85)` through `rgba(255, 255, 255, 0.6)` - Background
- `rgba(16, 185, 129, 0.20)` - Border

**Aurora:**
- `rgba(16, 185, 129, 0.10)` - Primary gradient
- `rgba(5, 150, 105, 0.08)` - Secondary gradient
- `rgba(187, 247, 208, 0.45)` - Tertiary gradient

---

## Color Palette Summary

### Primary Color (Emerald)
| Usage | Dark | Light |
|-------|------|-------|
| Primary | `#10b981` (hsl 160 84% 39%) | `hsl 160 84% 30%` |
| Gradient Range | `#10b981` → `#059669` → `#047857` | Same HSL, darker |

### Text Colors
| Usage | Dark | Light |
|-------|------|-------|
| Primary text | `#f8f9fa` (near white) | `#0f1714` (dark gray) |
| Muted text | `hsl 150 10% 65%` | `hsl 160 10% 35%` |

### Background Colors
| Usage | Dark | Light |
|-------|------|-------|
| Main bg | `hsl 150 60% 3%` | `hsl 0 0% 98%` |
| Card | `hsl 150 40% 6%` | `hsl 0 0% 100%` |

---

## Usage

### Toggle Theme
```javascript
// In App.js
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('netpay-theme') || 'dark';
});
document.documentElement.setAttribute('data-theme', theme);
```

### Apply in CSS
```css
/* Uses CSS variables automatically */
body {
  @apply bg-background text-foreground;
}
```

### Tailwind Classes
The theme extends Tailwind with `hsl(var(--color-name))` for all semantic colors.