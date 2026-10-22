# Visual assets — Milestone 1.1

14 October 2026. All new product illustrations are original SVG/CSS authored in this workspace. Cryptor is composition/motion inspiration, not an asset library. No template image, logo, Framer source, private project asset, remote font or scraped implementation is used.

## Provenance and reuse

No template asset source/license granting reuse was supplied or established from the accessible public reference. Public display is not a reuse license. The implementation therefore recreates the visual treatment with original assets; it does not assume template export rights. Reference screenshots in verification evidence are observations, not shipped application assets.

| Asset/component | Location | Source / usage |
| --- | --- | --- |
| Faceted VARTAMAN V emblem | apps/web/src/assets/visuals/vartaman-emblem.svg | Original paths/gradients; centerpiece and smaller illustration instances |
| Seven payment-symbol definitions | apps/web/src/assets/visuals/payment-symbols.svg | Original QR/wallet/store/review/authorization/status/receipt drawings; feature illustrations, not supported currencies, partner logos or audit certifications |
| Decorative orbit/connectors | apps/web/src/assets/visuals/process-orbit.svg | Original ellipse/line geometry; decorative hero layer |
| Medallions, luminous disc, ribbon | apps/web/src/components/PaymentVisuals.tsx + remix.css | Original reusable SVG/CSS composition; no 3D library |
| Beams, halos, rings, card layers | apps/web/src/remix.css | Original gradients, borders and shadows; transform/opacity motion |
| Product previews | apps/web/src/pages/Marketing.tsx | Existing exact Amount and fixture QR primitives plus original layout; scenarios explicitly independent |
| Original wordmark/UI icons | apps/web/src/components/ui.tsx; public/mark.svg | Preserved M1 drawings; system fonts, no downloaded font files |
| Functional fixture QR renderer | qrcode.react, locked version 4.2.0 | Existing ISC-licensed dependency; unchanged from M1 |

These original project files carry no third-party template license requirement; project-wide redistribution licensing remains the repository owner's choice. Existing dependency licenses remain applicable. No new application dependencies were installed for this pass.

## Implementation conventions

PaymentSymbolDefinitions injects only the developer-authored local SVG file into one hidden definition layer. It is not a renderer for user/remote SVG. Each PaymentSymbol references its stable, prefixed fragment ID; this avoids browser rejection of external data-URL fragment sprites. Definitions and decorative copies are aria-hidden and have no tab stops. Seven feature names appear once in an accessible list.

Ribbon has two identical groups, each containing two cycles of seven medallions. Each group exceeds the tested viewport widths; translating by exactly one group width returns the same visual arrangement. CSS timing is our choice (64 seconds desktop, 48 mobile), not a measured Cryptor timing. These are decorative loops, not payment-processing progress.

Operational amounts, request QR and status labels are not continuously animated. PaymentConstellation uses a decorative QR symbol; QRCard still encodes only the validated local fixture URL shape. Use AmbientRegion for continuous CSS effects so they pause offscreen/background; use Reveal and PageMotion only for presentation. Never bind payment state to animation events.
