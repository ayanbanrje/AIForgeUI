import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaljsonService {

  private url: string = './assets/data/';

    constructor(private http: HttpClient) {}

    public getFilters(): Observable<any> {
        return this.http.get(this.url + 'filters.json');
    }

    public getTestCode(): Observable<any> {
        return this.http.get(this.url + 'testcode.json');
    }

    public getModalHeader(): Observable<any> {
        return this.http.get(this.url + 'modalHeader.json');
    }

    public getFitmentModalHeader(): Observable<any> {
        return this.http.get(this.url + 'fitmentModalHeader.json');
    }

    public getTyres(): Observable<any> {
        return this.http.get(this.url + 'tyre.json');
    }

    public getFleet(): Observable<any> {
        return this.http.get(this.url + 'fleet.json');
    }

    public getVehicle(): Observable<any> {
        return this.http.get(this.url + 'vehicle.json');
    }

    public getDriver(): Observable<any> {
        return this.http.get(this.url + 'driver.json');
    }

    public getSummary(): Observable<any> {
        return this.http.get(this.url + 'summary.json');
    }

    public getView(): Observable<any> {
        return this.http.get(this.url + 'view.json');
    }

    public getMove(): Observable<any> {
        return this.http.get(this.url + 'move.json');
    }

    public getRemove(): Observable<any> {
        return this.http.get(this.url + 'remove.json');
    }

    public getVehicleLocation(): Observable<any> {
        return this.http.get(this.url + 'vehicleLoc.json');
    }

    public getInspection(): Observable<any> {
        return this.http.get(this.url + 'periodic-inspection.json');
    }

    public newFitment(): Observable<any> {
        return this.http.get(this.url + 'new-fitment/testcode.json');
    }

    public newFitmentFleet(): Observable<any> {
        return this.http.get(this.url + 'new-fitment/fleet.json');
    }

    public defects(): Observable<any> {
        return this.http.get(this.url + 'constants/defects.json');
    }

    public success(): Observable<any> {
        return this.http.get(this.url + 'alerts/success.json');
    }

    public swapError(): Observable<any> {
        return this.http.get(this.url + 'alerts/swap-error.json');
    }

    public moveError(): Observable<any> {
        return this.http.get(this.url + 'alerts/move-error.json');
    }

    public swapSuccess(): Observable<any> {
        return this.http.get(this.url + 'alerts/swap-success.json');
    }

    public swapAndShoulderOutSuccess(): Observable<any> {
        return this.http.get(this.url + 'alerts/swap-shoulderout-success.json');
    }

    public moveAndShoulderOutSuccess(): Observable<any> {
        return this.http.get(this.url + 'alerts/move-shoulderout-success.json');
    }

    public moveSuccess(): Observable<any> {
        return this.http.get(this.url + 'alerts/move-success.json');
    }

    public shoulderOutSuccess(): Observable<any> {
        return this.http.get(this.url + 'alerts/shoulder-out-success.json');
    }

    public multipleActions(): Observable<any> {
        return this.http.get(this.url + 'new-fitment/multiple-action.json');
    }

    public manualBarcode(): Observable<any> {
        return this.http.get(this.url + 'constants/manual-barcode.json');
    }
    public inspection(): Observable<any> {
        return this.http.get(this.url + 'inspection/inspection.json');
    }
    // alert tranction
    public transaction(): Observable<any> {
        return this.http.get(this.url + 'transaction/definition.json');
    }
    // alert tranction
    public alertsTable(): Observable<any> {
        return this.http.get(this.url + 'alertsTable/alertTableDefinition.json');
    }
    public layout(): Observable<any> {
        return this.http.get(this.url + 'inspection/layout.json');
    }

    public inspectionConfirm(): Observable<any> {
        return this.http.get(this.url + 'inspection/pre-confirm.json');
    }

    public inspectionCompleted(): Observable<any> {
        return this.http.get(this.url + 'inspection/confirm.json');
    }

    public inspectionPendingUpdated(): Observable<any> {
        return this.http.get(this.url + 'inspection/pending.json');
    }

    public errorCodes(): Observable<any> {
        return this.http.get(this.url + 'error-code.json');
    }

    public hitrate(): Observable<any> {
        return this.http.get(this.url + 'hitrate.json');
    }
}
