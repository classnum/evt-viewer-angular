import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocaleService } from 'angular-l10n';

@Injectable()
export class AppConfig {
    static evtSettings: EVTConfig;
    private readonly uiConfigUrl = 'assets/config/ui_config.json';
    private readonly fileConfigUrl = 'assets/config/file_config.json';
    private readonly editionConfigUrl = 'assets/config/edition_config.json';

    constructor(
      private locale: LocaleService,
      private http: HttpClient) { }

    load() {
        return new Promise<void>((resolve, reject) => {
            forkJoin(
                this.http.get<UiConfig>(this.uiConfigUrl),
                this.http.get<EditionConfig>(this.editionConfigUrl),
                this.http.get<FileConfig>(this.fileConfigUrl)
            ).pipe(
                map(([ui, edition, files]) => {
                    console.log(ui, edition, files);
                    // Handle default values => TODO: Decide how to handle defaults!!
                    if (ui.defaultLocalization) {
                      this.locale.setCurrentLanguage(ui.defaultLocalization);
                    }
                    return { ui, edition, files };
                })
            ).subscribe(evtConfig => {
                AppConfig.evtSettings = evtConfig;
                console.log('evtConfig', evtConfig);
                resolve();
            });
        });
    }
}
export interface EVTConfig {
    ui: UiConfig;
    edition: EditionConfig;
    files: FileConfig;
}

export interface UiConfig {
    localization: boolean;
    defaultLocalization: string;
}

export interface EditionConfig {
    title: string;
}

export interface FileConfig {
    editionUrls: string[];
}
