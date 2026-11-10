import { Injectable } from '@angular/core';
import { AppConfig } from '@app/model/app-config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig | null = null;

  async load(): Promise<void> {
    const response = await fetch('/assets/config.json', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Unable to load application configuration: ${response.status}`);
    }

    this.config = await response.json() as AppConfig;
    this.validateConfig(this.config);
  }

  get authApiUrl(): string {
    return this.requireConfig().api.authUrl;
  }

  private requireConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Application configuration has not been initialized');
    }
    return this.config;
  }

  private validateConfig(config: AppConfig): void {
    if (!config.api?.authUrl) {
      throw new Error('Missing configuration property: api.authUrl');
    }
  }
}
