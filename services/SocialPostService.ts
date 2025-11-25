import type { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import { Platform } from 'react-native';

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
  private static nativeFunctionsInstance: FirebaseFunctionsTypes.Module | null = null;

  private static async getNativeFunctions() {
    if (Platform.OS === 'web') {
      throw new Error('Native Firebase Functions module is unavailable on web.');
    }

    if (!SocialPostService.nativeFunctionsInstance) {
      const { default: functions } = await import('@react-native-firebase/functions');
      SocialPostService.nativeFunctionsInstance = functions();
    }

    return SocialPostService.nativeFunctionsInstance;
  }

  private static async callCallable<Request, Response>(
    functionName: string,
    payload: Request,
    options?: AnalyzePostOptions,
  ): Promise<Response> {
    const callOptions = options?.timeoutMs !== undefined ? { timeout: options.timeoutMs } : undefined;

    if (Platform.OS === 'web') {
      const [{ getFirebaseWebFunctions }, firebaseWebFunctions] = await Promise.all([
        import('@/configs/firebaseWeb'),
        import('firebase/functions'),
      ]);

      const functionsInstance = getFirebaseWebFunctions();
      const callable = firebaseWebFunctions.httpsCallable<Request, Response>(
        functionsInstance,
        functionName,
        callOptions,
      );
      const { data } = await callable(payload);

      if (!data) {
        throw new Error('Firebase function returned an empty response');
      }

      return data;
    }

    const functionsInstance = await SocialPostService.getNativeFunctions();
    const callable = functionsInstance.httpsCallable<Request, Response>(functionName, callOptions);
    const { data } = await callable(payload);

    if (!data) {
      throw new Error('Firebase function returned an empty response');
    }

    return data;
  }

  static async analyzePost(
    payload: SocialPostAnalyzerInput,
    options?: AnalyzePostOptions,
  ): Promise<AnalyzeSocialPostResponse> {
    try {
      return await SocialPostService.callCallable<
        SocialPostAnalyzerInput,
        AnalyzeSocialPostResponse
      >(SocialPostService.FUNCTION_NAME, payload, options);
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

    try {
      return await SocialPostService.callCallable<ApplyPostChangesInput, ApplyPostChangesResponse>(
        SocialPostService.APPLY_FUNCTION_NAME,
        payload,
        options,
      );
    } catch (error) {
      console.error('[SocialPostService] applyPostChanges failed', error);
      throw error;
    }
  }
}

