/** Service groups (also the anchor ids on /services). Shared by services.ts and reviews.ts. */
export const SERVICE_IDS = [
  'driveways',
  'patios-pads',
  'sport-courts',
  'steps-walkways',
  'rv-pads',
  'retaining-walls',
  'hardscape',
  'fences',
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];
