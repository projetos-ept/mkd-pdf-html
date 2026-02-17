# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [alpha 0.7] - 2026-02-17

### Added
- Outline panel toggle to show/hide document structure
- Template system for quick document setup (Biochemistry, Corporate, Blank)
- Support for multiple themes: Modern, Notebook (ruled paper), Sepia
- Font family selection (Sans, Serif, Mono)
- Customizable font size
- Header and footer support with position toggle (Flow/Sticky)
- HTML export with Mermaid diagram rendering
- Print-to-PDF support with CSS styling preserved
- Live preview with real-time markdown rendering
- Document auto-save to browser localStorage
- Word count and reading time statistics

### Changed
- Improved layout margins from default to 50px for better spacing
- Enhanced text alignment in preview
- Mermaid diagram sanitization to prevent rendering errors from markdown syntax
- Updated README with comprehensive project documentation and editor guide

### Fixed
- Text alignment issues in document preview
- Header and footer spacing in all themes
- Mermaid diagram label rendering (remove markdown syntax)
- Outline panel only extracts headings when enabled
- Package-lock.json now properly ignored by git

### Removed
- N/A

---

## [alpha 0.6] - Previous Release

Early development version with basic markdown editing and preview functionality.
