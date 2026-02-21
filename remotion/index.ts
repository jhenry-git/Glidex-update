/**
 * Remotion entry point — used by Remotion CLI/Studio.
 * This file is the --entry-point for `npx remotion studio` and `npx remotion render`.
 */

// @ts-expect-error TypeScript cannot resolve Remotion CJS types with bundler module resolution
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
