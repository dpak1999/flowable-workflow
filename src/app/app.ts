import { Component, HostBinding, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly themeStorageKey = 'flowable-workflow-theme';

  protected readonly title = signal('flowable-workflow');
  protected readonly isDarkTheme = signal(this.getInitialTheme());

  @HostBinding('class.dark-theme')
  protected get darkThemeClass(): boolean {
    return this.isDarkTheme();
  }

  protected toggleTheme(): void {
    this.isDarkTheme.update((isDark) => {
      const nextTheme = !isDark;
      this.storeTheme(nextTheme);

      return nextTheme;
    });
  }

  private getInitialTheme(): boolean {
    try {
      const storedTheme = globalThis.localStorage?.getItem(this.themeStorageKey);

      if (storedTheme) {
        return storedTheme === 'dark';
      }

      return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  }

  private storeTheme(isDark: boolean): void {
    try {
      globalThis.localStorage?.setItem(this.themeStorageKey, isDark ? 'dark' : 'light');
    } catch {
      // Theme persistence is optional; the toggle still works without storage access.
    }
  }
}
