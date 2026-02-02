# Examples

Example compositions demonstrating various Remotion features.

## TransitionExample

Shows how to use `@remotion/transitions` to create smooth transitions between scenes:
- Scene 1: Animated text with spring physics (Anton font)
- Scene 2: Slide-up animation (Righteous font)
- Scene 3: SVG morphing with `@remotion/paths`

**Transitions used:**
- Slide from right
- Fade

**To use:**
Add to `Root.tsx`:
```tsx
import { TransitionExample } from './examples/TransitionExample';

<Composition
  id="TransitionExample"
  component={TransitionExample}
  fps={30}
  durationInFrames={305}
  width={1920}
  height={1080}
/>
```

## Creating Your Own Scenes

1. Create scene files in `src/scenes/` (not in examples)
2. Import reusable components from `src/components/`
3. Use TransitionExample as a reference for transitions
4. Mix visual strategies: UI rebuild, motion graphics, or stock media
