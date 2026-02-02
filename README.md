# Remotion Video Template (Resolved EDL)

This repo provides Remotion compositions that accept the **Resolved EDL v1** contract and render videos deterministically without network calls.

## Files
- `template.manifest.json` defines supported compositions and capabilities.
- `src/index.ts` registers the Remotion root.
- `src/RemotionRoot.tsx` defines compositions and metadata.

## Expected Props
All compositions accept a `ResolvedEDLv1` object. See `src/types.ts` for the schema.

## Development
```bash
npm install
npm run dev
```

## Render (example)
```bash
npx remotion render FullVideo out/video.mp4 --props=public/resolved-edl.json
```
