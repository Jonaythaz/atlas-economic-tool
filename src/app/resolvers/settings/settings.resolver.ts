import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import type { Settings } from '@atlas/models';
import { SettingsService } from '@atlas/services/settings';

export const settingsResolver: ResolveFn<Settings> = () => inject(SettingsService).loadSettings();
