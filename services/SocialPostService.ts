import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';

export type SocialPostAnalyzerInput = {
  post: string;
  platform?: string;
  goal?: string;
  target_audience?: string;
  tone?: string;
  language?: string;
  max_length?: number;
  post_type?: string;
  brand_persona?: string;
  reference_twitter_handles?: string[];
  reference_texts?: string[];
};

export type ScoreBlock = {
  total: number;
  hook: number;
  clarity: number;
  emotional_charge: number;
  opinion_edge: number;
  shareability: number;
  value: number;
  identity_match: number;
  cta_strength: number;
  readability: number;
  uniqueness: number;
};

export type IssueBlock = {
  id: string;
  type: string;
  title: string;
  description: string;
  score_impact: number;
  advice: string;
  suggested_fix: string;
  priority: 'low' | 'medium' | 'high';
};

export type SocialPostEvaluation = {
  post: string;
  summary?: string;
  scores: ScoreBlock;
  issues: IssueBlock[];
  auto_fixes?: string;
  version: string;
};

export type AnalyzeSocialPostResponse = {
  result: 'OK';
  evaluation: SocialPostEvaluation;
  openaiResponse: unknown;
};

export type ChangeInstruction = {
  id?: string;
  description: string;
  context?: string;
  reference_text?: string;
  priority?: 'low' | 'medium' | 'high';
};

export type ApplyPostChangesInput = {
  post: string;
  changes: ChangeInstruction[];
  language?: string;
};

export type ChangeLogEntry = {
  id: string;
  status: 'applied' | 'partial' | 'skipped';
  summary: string;
  notes?: string;
  conflicts?: string[];
};

export type ApplyPostChangesResponse = {
  result: 'OK';
  updatedPost: string;
  changeLog: ChangeLogEntry[];
  warnings: string[];
  openaiResponse: unknown;
};

export type AnalyzePostOptions = {
  /**
   * Custom timeout for the callable request in milliseconds.
   * Defaults to the Firebase SDK setting (60s).
   */
  timeoutMs?: number;
};

export class SocialPostService {
  private static readonly FUNCTION_NAME = 'buildSocialPostEvaluationPrompt';
  private static readonly APPLY_FUNCTION_NAME = 'applyPostChanges';

  static async analyzePost(
    payload: SocialPostAnalyzerInput,
    options?: AnalyzePostOptions,
  ): Promise<AnalyzeSocialPostResponse> {
    const functionsInstance = functions();
    const callOptions: FirebaseFunctionsTypes.HttpsCallableOptions | undefined =
      options?.timeoutMs !== undefined ? { timeout: options.timeoutMs } : undefined;

    try {
      const callable = functionsInstance.httpsCallable<
        SocialPostAnalyzerInput,
        AnalyzeSocialPostResponse
      >(SocialPostService.FUNCTION_NAME, callOptions);

      const { data } = await callable(payload);

      if (!data) {
        throw new Error('Firebase function returned an empty response');
      }

      return data;
    } catch (error) {
      console.error('[SocialPostService] analyzePost failed', error);
      throw error;
    }
  }

  static async applyPostChanges(
    payload: ApplyPostChangesInput,
    options?: AnalyzePostOptions,
  ): Promise<ApplyPostChangesResponse> {
    if (!payload.post?.trim()) {
      throw new Error('Post text is required to apply changes');
    }

    if (!payload.changes?.length) {
      throw new Error('At least one change instruction is required');
    }

    const functionsInstance = functions();
    const callOptions: FirebaseFunctionsTypes.HttpsCallableOptions | undefined =
      options?.timeoutMs !== undefined ? { timeout: options.timeoutMs } : undefined;

    try {
      const callable = functionsInstance.httpsCallable<
        ApplyPostChangesInput,
        ApplyPostChangesResponse
      >(SocialPostService.APPLY_FUNCTION_NAME, callOptions);

      const { data } = await callable(payload);

      if (!data) {
        throw new Error('Firebase function returned an empty response');
      }

      return data;
    } catch (error) {
      console.error('[SocialPostService] applyPostChanges failed', error);
      throw error;
    }
  }
}

