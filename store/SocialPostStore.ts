import { makeAutoObservable, runInAction } from 'mobx';

import {
  AnalyzeSocialPostResponse,
  ApplyPostChangesInput,
  ApplyPostChangesResponse,
  ChangeInstruction,
  ChangeLogEntry,
  SocialPostAnalyzerInput,
  SocialPostEvaluation,
  SocialPostService,
} from '@services/SocialPostService';

export class SocialPostStore {
  post: SocialPostAnalyzerInput['post'] = '';
  platform?: SocialPostAnalyzerInput['platform'];
  goal?: SocialPostAnalyzerInput['goal'];
  target_audience?: SocialPostAnalyzerInput['target_audience'];
  tone?: SocialPostAnalyzerInput['tone'];
  language?: SocialPostAnalyzerInput['language'];
  max_length?: SocialPostAnalyzerInput['max_length'];
  post_type?: SocialPostAnalyzerInput['post_type'];
  brand_persona?: SocialPostAnalyzerInput['brand_persona'];
  reference_twitter_handles: string[] = [];
  reference_texts: string[] = [];

  evaluation?: SocialPostEvaluation;
  changeLog?: ChangeLogEntry[];
  warnings: string[] = [];
  pendingChanges: ChangeInstruction[] = [];

  postVersions: Array<{ id: string; label: string; content: string; timestamp: number }> = [];

  isAnalyzing = false;
  isApplyingChanges = false;
  error?: string;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get canAnalyze(): boolean {
    return !!this.post.trim();
  }

  setPost(post: string) {
    this.post = post;
  }

  updateInput(partial: Partial<SocialPostAnalyzerInput>) {
    if (partial.post !== undefined) {
      this.post = partial.post;
    }
    if (partial.platform !== undefined) {
      this.platform = partial.platform;
    }
    if (partial.goal !== undefined) {
      this.goal = partial.goal;
    }
    if (partial.target_audience !== undefined) {
      this.target_audience = partial.target_audience;
    }
    if (partial.tone !== undefined) {
      this.tone = partial.tone;
    }
    if (partial.language !== undefined) {
      this.language = partial.language;
    }
    if (partial.max_length !== undefined) {
      this.max_length = partial.max_length;
    }
    if (partial.post_type !== undefined) {
      this.post_type = partial.post_type;
    }
    if (partial.brand_persona !== undefined) {
      this.brand_persona = partial.brand_persona;
    }
    if (partial.reference_twitter_handles !== undefined) {
      this.reference_twitter_handles = partial.reference_twitter_handles ?? [];
    }
    if (partial.reference_texts !== undefined) {
      this.reference_texts = partial.reference_texts ?? [];
    }
  }

  resetForm() {
    this.post = '';
    this.platform = undefined;
    this.goal = undefined;
    this.target_audience = undefined;
    this.tone = undefined;
    this.language = undefined;
    this.max_length = undefined;
    this.post_type = undefined;
    this.brand_persona = undefined;
    this.reference_twitter_handles = [];
    this.reference_texts = [];
    this.resetEvaluation();
    this.resetChanges();
  }

  resetEvaluation() {
    this.evaluation = undefined;
    this.error = undefined;
  }

  resetChanges() {
    this.pendingChanges = [];
    this.changeLog = undefined;
    this.warnings = [];
  }

  addPostVersion(content: string, label: string = 'Your') {
    const id = `version-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const version = {
      id,
      label,
      content,
      timestamp: Date.now(),
    };
    this.postVersions = [version, ...this.postVersions];
    return version;
  }

  clearPostVersions() {
    this.postVersions = [];
  }

  removePostVersion(versionId: string) {
    this.postVersions = this.postVersions.filter(version => version.id !== versionId);
  }

  removeIssues(issueIds: string[]) {
    if (!this.evaluation) {
      return;
    }
    this.evaluation = {
      ...this.evaluation,
      issues: this.evaluation.issues.filter(issue => !issueIds.includes(issue.id)),
    };
  }

  setPendingChanges(changes: ChangeInstruction[]) {
    this.pendingChanges = [...changes];
  }

  addChangeInstruction(instruction: ChangeInstruction) {
    this.pendingChanges = [...this.pendingChanges, instruction];
  }

  removeChangeInstruction(changeId: string) {
    this.pendingChanges = this.pendingChanges.filter(change => change.id !== changeId);
  }

  updateChangeInstruction(changeId: string, patch: Partial<ChangeInstruction>) {
    this.pendingChanges = this.pendingChanges.map(change =>
      change.id === changeId ? { ...change, ...patch } : change,
    );
  }

  async analyzePost(overrides?: Partial<SocialPostAnalyzerInput>): Promise<AnalyzeSocialPostResponse> {
    if (this.isAnalyzing) {
      throw new Error('Analysis already in progress');
    }

    const payload = this.buildPayload(overrides);

    if (!payload.post?.trim()) {
      const error = new Error('Post text is required for analysis');
      this.error = error.message;
      throw error;
    }

    this.isAnalyzing = true;
    this.error = undefined;

    try {
      const response = await SocialPostService.analyzePost(payload);

      runInAction(() => {
        this.evaluation = response.evaluation;
      });

      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to analyze the post. Please try again.';

      runInAction(() => {
        this.error = message;
      });

      throw error;
    } finally {
      runInAction(() => {
        this.isAnalyzing = false;
      });
    }
  }

  private buildPayload(overrides?: Partial<SocialPostAnalyzerInput>): SocialPostAnalyzerInput {
    return {
      post: overrides?.post ?? this.post,
      platform: overrides?.platform ?? this.platform,
      goal: overrides?.goal ?? this.goal,
      target_audience: overrides?.target_audience ?? this.target_audience,
      tone: overrides?.tone ?? this.tone,
      language: overrides?.language ?? this.language,
      max_length: overrides?.max_length ?? this.max_length,
      post_type: overrides?.post_type ?? this.post_type,
      brand_persona: overrides?.brand_persona ?? this.brand_persona,
      reference_twitter_handles:
        overrides?.reference_twitter_handles ??
        (this.reference_twitter_handles.length ? this.reference_twitter_handles : undefined),
      reference_texts:
        overrides?.reference_texts ??
        (this.reference_texts.length ? this.reference_texts : undefined),
    };
  }

  async applyChanges(overrides?: Partial<ApplyPostChangesInput>): Promise<ApplyPostChangesResponse> {
    if (this.isApplyingChanges) {
      throw new Error('Change application already in progress');
    }

    const post = overrides?.post ?? this.post;
    const changes = overrides?.changes ?? this.pendingChanges;
    const language = overrides?.language ?? this.language;

    if (!post?.trim()) {
      const error = new Error('Post text is required to apply changes');
      this.error = error.message;
      throw error;
    }

    if (!changes?.length) {
      const error = new Error('No change instructions provided');
      this.error = error.message;
      throw error;
    }

    this.isApplyingChanges = true;
    this.error = undefined;

    try {
      const response = await SocialPostService.applyPostChanges(
        {
          post,
          changes,
          language,
        },
        undefined,
      );

      runInAction(() => {
        const previousPost = this.post;
        this.post = response.updatedPost;
        this.changeLog = response.changeLog;
        this.warnings = response.warnings;
        this.pendingChanges = [];
        
        // Добавляем версию после применения изменений
        this.addPostVersion(response.updatedPost, 'AI');
      });

      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to apply post changes. Please try again.';

      runInAction(() => {
        this.error = message;
      });

      throw error;
    } finally {
      runInAction(() => {
        this.isApplyingChanges = false;
      });
    }
  }
}

