export const CAR_SHOWCASE_FPS = 30;
export const CAR_SHOWCASE_DURATION = 15 * CAR_SHOWCASE_FPS;

export const SOCIAL_REEL_FPS = 30;
export const SOCIAL_REEL_DURATION = 12 * SOCIAL_REEL_FPS;
export const SOCIAL_REEL_WIDTH = 1080;
export const SOCIAL_REEL_HEIGHT = 1920;

export const AD_PIPELINE_FPS = 30;
export const AD_PIPELINE_WIDTH = 1920;
export const AD_PIPELINE_HEIGHT = 1080;

export function getAdPipelineDuration(carCount: number): number {
    const displayCount = Math.min(Math.max(carCount, 1), 4);
    const INTRO_FRAMES = 3 * 30;
    const FRAMES_PER_CAR = 3 * 30;
    const OUTRO_FRAMES = 4 * 30;
    return INTRO_FRAMES + displayCount * FRAMES_PER_CAR + OUTRO_FRAMES;
}

export const HOST_ONBOARDING_FPS = 30;
export const HOST_ONBOARDING_DURATION = 18 * HOST_ONBOARDING_FPS;
export const HOST_ONBOARDING_WIDTH = 1920;
export const HOST_ONBOARDING_HEIGHT = 1080;

export function getHeroVideoDuration(carCount: number): number {
    const count = Math.min(Math.max(carCount, 1), 5);
    const FRAMES_PER_CAR = 120;
    const TRANSITION_FRAMES = 20;
    return count * (FRAMES_PER_CAR - TRANSITION_FRAMES) + TRANSITION_FRAMES;
}
