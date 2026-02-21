// @ts-nocheck — Entry file for Remotion CLI only; uses separate TS resolution.
/**
 * Remotion entry point — used by Remotion CLI/Studio.
 * This file is the --entry-point for `npx remotion studio` and `npx remotion render`.
 */

import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
