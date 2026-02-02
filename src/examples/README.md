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

## Audio Sync with Transitions

**Problem:** Transitions create visual overlap between scenes. If voiceover continues during transition, user hears Scene 1 audio while seeing Scene 2 visuals → desync.

**Solution:** End voiceover BEFORE transition starts.

### Pattern

```tsx
const sceneDuration = 90;        // Total scene frames (3s)
const transitionDuration = 20;    // Transition length (0.67s)
const audioDuration = 70;         // Voiceover frames (2.33s)

<Sequence durationInFrames={sceneDuration}>
  <SlideTransition durationInFrames={transitionDuration}>
    <MyScene />
  </SlideTransition>
  
  {/* Audio ends BEFORE transition */}
  <Audio 
    src={staticFile('audio/scene.wav')} 
    endAt={sceneDuration - transitionDuration}
  />
</Sequence>
```

### Alternative: Audio Fade

Instead of hard cut, fade audio during transition:

```tsx
<Audio 
  src={staticFile('audio/scene.wav')} 
  volume={(frame) => {
    const fadeStart = sceneDuration - transitionDuration;
    if (frame > fadeStart) {
      return interpolate(frame, [fadeStart, sceneDuration], [1, 0]);
    }
    return 1;
  }}
/>
```

### When Generating Assets

Plan voiceover scripts to be ~0.5-1s shorter than scene duration, leaving natural gap for transitions.

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
