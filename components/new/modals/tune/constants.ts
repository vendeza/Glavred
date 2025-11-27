export type PlatformOption = {
  id: string;
  label: string;
  icon: string;
};

export type GoalOption = {
  id: string;
  label: string;
};

export type Option = {
  id: string;
  label: string;
};

export type BrandPersonaOption = {
  id: string;
  label: string;
  value: string;
  description: string;
};

export const platforms: PlatformOption[] = [
  { id: 'x', label: 'X', icon: 'x' },
  { id: 'threads', label: 'Threads', icon: 'threads' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
];

export const goals: GoalOption[] = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'comments', label: 'Comments' },
  { id: 'reposts', label: 'Reposts' },
  { id: 'subscribes', label: 'Subscribes' },
  { id: 'likes', label: 'Likes' },
];

export const targetAudiences: Option[] = [
  { id: 'general', label: 'General' },
  { id: 'tech', label: 'Tech' },
  { id: 'business', label: 'Business' },
  { id: 'creatives', label: 'Creatives' },
];

export const tones: Option[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'authoritative', label: 'Authoritative' },
];

export const languages: Option[] = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Russian' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
];

export const postTypes: Option[] = [
  { id: 'longform_thread', label: 'Longform thread' },
  { id: 'short_post', label: 'Short post' },
  { id: 'shitpost', label: 'Shitpost' },
  { id: 'storytelling', label: 'Storytelling' },
  { id: 'viral_one_liner', label: 'Viral one-liner' },
  { id: 'cta_focused', label: 'CTA-focused' },
];

export const brandPersonas: BrandPersonaOption[] = [
  {
    id: 'none',
    label: 'None',
    value: '',
    description: 'без указания какого-либо человека',
  },
  {
    id: 'naval',
    label: 'Naval',
    value: '@naval',
    description: 'афористичность, философия, покой, лаконичность, краткие истины',
  },
  {
    id: 'sam_altman',
    label: 'Sam Altman',
    value: '@sama',
    description: 'стратегические мысли, спокойный рациональный тон',
  },
  {
    id: 'levelsio',
    label: 'Levelsio',
    value: '@levelsio',
    description: 'короткие резкие фразы, юмор, практичность, DIY подход',
  },
];

