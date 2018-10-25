import {
    ContentChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    HostBinding,
    Input,
    IterableDiffers,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import { IgxSelectionAPIService } from '../core/selection';
import { cloneArray, DisplayDensity } from '../core/utils';
import { ISortingExpression } from '../data-operations/sorting-expression.interface';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { IgxGridBaseComponent } from '../grid-common/grid-base.component';

import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { GridBaseAPIService } from '../grid-common/api.service';
import { ITreeGridRecord } from './tree-grid.interfaces';
import { ITreeGridRowExpansionEventArgs } from './tree-grid.interfaces';

let NEXT_ID = 0;

/**
 * **Ignite UI for Angular Grid** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid.html)
 *
 * The Ignite UI Grid is used for presenting and manipulating tabular data in the simplest way possible.  Once data
 * has been bound, it can be manipulated through filtering, sorting & editing operations.
 *
 * Example:
 * ```html
 * <igx-grid [data]="employeeData" autoGenerate="false">
 *   <igx-column field="first" header="First Name"></igx-column>
 *   <igx-column field="last" header="Last Name"></igx-column>
 *   <igx-column field="role" header="Role"></igx-column>
 * </igx-grid>
 * ```
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: 'igx-tree-grid',
    templateUrl: 'tree-grid.component.html',
    providers: [ { provide: GridBaseAPIService, useClass: IgxTreeGridAPIService } ]
})
export class IgxTreeGridComponent extends IgxGridBaseComponent {
    private _id = `igx-tree-grid-${NEXT_ID++}`;

    /**
     * An @Input property that sets the value of the `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-grid [id]="'igx-grid-1'" [data]="Data" [autoGenerate]="true"></igx-grid>
     * ```
	 * @memberof IgxGridComponent
     */
    @HostBinding('attr.id')
    @Input()
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        if (this._id !== value) {
            const oldId = this._id;
            this._id = value;
            this.gridAPI.reset(oldId, this._id);
        }
    }

    /**
    * @hidden
    */
    public flatData: any[];

    public treeGridRecords: ITreeGridRecord[];

    public treeGridRecordsMap: Map<any, ITreeGridRecord> = new Map<any, ITreeGridRecord>();

    public processedTreeGridRecords: ITreeGridRecord[];

    public processedTreeGridRecordsMap: Map<any, ITreeGridRecord> = new Map<any, ITreeGridRecord>();

    /**
     * An @Input property that sets the child data key of the `IgxTreeGridComponent`.
     * ```html
     * <igx-tree-grid #grid [data]="localData" [showToolbar]="true" [childDataKey]="employees" [autoGenerate]="true"></igx-tree-grid>
     * ```
	 * @memberof IgxTreeGridRowComponent
     */
    @Input()
    public childDataKey;

    /**
     * An @Input property that sets the foreign key of the `IgxTreeGridComponent`.
     * ```html
     * <igx-tree-grid #grid [data]="localData" [primaryKey]="employeeID" [foreignKey]="parentID" [autoGenerate]="true"></igx-tree-grid>
     * ```
	 * @memberof IgxTreeGridRowComponent
     */
    @Input()
    public foreignKey;

    private _expandedLevels = Infinity;

    /**
     * An @Input property that sets the count of levels to expand by default in the `IgxTreeGridComponent`.
     * ```html
     * <igx-tree-grid #grid [data]="localData" [childDataKey]="employees" expandedLevels="1" [autoGenerate]="true"></iigx-tree-grid>
     * ```
	 * @memberof IgxTreeGridRowComponent
     */
    @Input()
    public get expandedLevels(): number {
        return this._expandedLevels;
    }

    public set expandedLevels(value: number) {
        this._expandedLevels = value;
        this.cdr.markForCheck();
    }

    private _expandedStates:  Map<any, boolean> = new Map<any, boolean>();

    @Input()
    public get expandedStates() {
        return this._expandedStates;
    }

    public set expandedStates(value) {
        this._expandedStates = this.cloneMap(value);
        this.cdr.detectChanges();
    }

    @Output()
    public onRowExpansionToggle = new EventEmitter<ITreeGridRowExpansionEventArgs>();

    private gridAPI: IgxTreeGridAPIService;

    constructor(
        gridAPI: GridBaseAPIService<IGridBaseComponent>,
        selection: IgxSelectionAPIService,
        elementRef: ElementRef,
        cdr: ChangeDetectorRef,
        resolver: ComponentFactoryResolver,
        differs: IterableDiffers,
        viewRef: ViewContainerRef) {
        super(gridAPI, selection, elementRef, cdr, resolver, differs, viewRef);
        this.gridAPI = <IgxTreeGridAPIService>gridAPI;
    }

    private cloneMap(mapIn: Map<any, boolean>):  Map<any, boolean> {
        const mapCloned: Map<any, boolean> = new Map<any, boolean>();

        mapIn.forEach((value: boolean, key: any, mapObj: Map<any, boolean>) => {

          mapCloned.set(key, value);
        });

        return mapCloned;
    }

    public expandRow(rowID: any) {
        this.gridAPI.expand_row(this.id, rowID);
    }

    public collapseRow(rowID: any) {
        this.gridAPI.collapse_row(this.id, rowID);
    }

    public toggleRowExpansion(rowID: any) {
        this.gridAPI.toggle_row_expansion(this.id, rowID);
    }

    public expandAll() {
        this._expandedLevels = Infinity;
        this.expandedStates = new Map<any, boolean>();
    }

    public collapseAll() {
        this._expandedLevels = 0;
        this.expandedStates = new Map<any, boolean>();
    }

    public addChildRow(parentRowID: any, data: any) {
        this.gridAPI.add_child_row(this.id, parentRowID, data);
    }
}