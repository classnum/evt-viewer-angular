import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppConfig, EditionLevelType } from 'src/app/app.config';
import { EditionLevelService } from '../../services/edition-level.service';

@Component({
  selector: 'evt-text-versions',
  templateUrl: './text-versions.component.html',
  styleUrls: ['./text-versions.component.scss'],
})
export class TextVersionsComponent implements OnInit {
  @ViewChild('versionsPanel', { static: true }) versionsPanel: ElementRef;
  private versions: VersionItem[] = [];

  public options: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public versionsPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };
  public versionsOptions: GridsterConfig = {};

  private defaultEditionLevel = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled))[0];
  public currentEditionLevel = this.route.params.pipe(
    map((params) => params.edLvl ?? this.defaultEditionLevel?.id),
    distinctUntilChanged((x, y) => x === y),
  );

  constructor(
    private editionLevel: EditionLevelService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.initGridster();
    this.initPageAndVersions();
  }

  handleEditionLevelChange(editionLevel: EditionLevelType) {
    this.editionLevel.handleEditionLevelChange(this.route, editionLevel, 'edLvl');
  }

  getVersions() {
    return this.versions;
  }

  addVersion() {
    const newVersion = {
      label: (this.versions.length + 1).toString(), // TODO: TEMP
      itemConfig: { cols: 1, rows: 1, y: 0, x: this.versions.length + 1 },
    };
    this.versions.push(newVersion); // TODO: TEMP
    this.updateGridsterOptions();
    // TODO: Come gestiamo la rotta nel caso di più versioni selezionate?
  }

  removeVersion(index) {
    this.versions.splice(index, 1);
    this.updateGridsterOptions();
  }

  private initPageAndVersions() {
    // TODO: subscribe to route params
  }

  private initGridster() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      margin: 0,
      maxCols: 2,
      maxRows: 1,
      draggable: {
        enabled: false,
        ignoreContent: false,
        ignoreContentClass: 'panel-content',
        dragHandleClass: 'panel-header',
      },
      resizable: {
        enabled: false,
      },
    };
    this.versionsOptions = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      compactType: CompactType.CompactLeft,
      scrollToNewItems: true,
      margin: 0,
      maxRows: 1,
      draggable: {
        enabled: true,
        ignoreContent: true,
        dragHandleClass: 'panel-header',
      },
      resizable: {
        enabled: false,
      },
      mobileBreakpoint: 0,
      itemResizeCallback: this.updateFixedColWidth.bind(this),
      itemChangeCallback: this.itemChange.bind(this),
    };
  }

  private itemChange() {
    const updatedVerList: string[] = [];
    for (const verItem of this.versions) {
      const verIndex = verItem.itemConfig.x;
      updatedVerList[verIndex] = verItem.label;
    }
    // TODO: Use this list to update URL params
    console.log('TODO! Use this list to update URL params', updatedVerList);
  }

  private updateGridsterOptions() {
    this.options.maxCols = this.versions.length <= 1 ? 2 : 3;
    this.versionsPanelItem.cols = this.versions.length <= 1 ? 1 : 2;

    this.versionsOptions.maxCols = this.versions.length;

    this.versionsOptions.gridType = this.versions.length <= 2 ? GridType.Fit : GridType.HorizontalFixed;
    this.changedOptions();
    this.updateFixedColWidth();
  }

  private changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    if (this.versionsOptions.api && this.versionsOptions.api.optionsChanged) {
      this.versionsOptions.api.optionsChanged();
    }
  }

  private updateFixedColWidth() {
    const versionsPanelEl = this.versionsPanel.nativeElement as HTMLElement;
    const fixedColWidth = versionsPanelEl.clientWidth * 0.416666666667;
    this.versionsOptions.fixedColWidth = this.versions.length > 2 ? fixedColWidth : undefined;
    this.changedOptions();
  }
}

interface VersionItem {
  label: string;
  itemConfig: GridsterItem;
}
