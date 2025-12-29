export interface AuthServerConfig {
  apiUrl: string;
  version: string;
}

export interface AppConfig {
  authServer: AuthServerConfig;
}
