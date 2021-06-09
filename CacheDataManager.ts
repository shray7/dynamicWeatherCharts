import { Resolution, Datapoints } from "./controller";

export class CacheDataManager {
    private _oneMindata: Map<number, number | null> = new Map();
    private _fiveMindata: Map<number, number | null> = new Map();
    private _oneHourdata: Map<number, number | null> = new Map();

    private _sendOneMinRequest: boolean = false;
    private _sendFiveMinRequest: boolean = false;
    private _sendOneHourRequest: boolean = false;


    getData(start: number, end: number, resolution: Resolution): Datapoints | null {
        let result = null;
        // Roll Up logic from 1 Min To 1 Hour
        if (resolution == 60) {
            result = this.getOneMinData(start, end);
            if (result == null) {
                this._sendOneMinRequest = true;
                result = this.getFiveMinData(start, end);
                if (result) {
                    result = this.convertFiveMinDataToOneMin(start, end);
                    return result;
                }
                else {
                    result = this.getOneHourData(start, end);
                    if (result) {
                        result = this.convertOneHourDataToOneMinData(start, end);
                        return result;
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        else if (resolution == 300) {
            // After searching for 5min, if DNE look at one min, and if doesnt exit then look at 1 hour
            result = this.getFiveMinData(start, end);
            if (result == null) {
                this._sendFiveMinRequest = true;
                result = this.getOneMinData(start, end);
                if (result) {
                    result = this.convertOneMinDataToFiveMinData(start, end);
                    return result;
                }
                else {
                    result = this.getOneHourData(start, end);
                    if (result) {
                        result = this.convertOneHourDataToFiveMinData(start, end);
                        return result;
                    }
                }
            }
        }

        else {
            result = this.getOneHourData(start, end);
            if (result == null) {
                this._sendOneHourRequest = true;
                result = this.getFiveMinData(start, end);
                if (result) {
                    result = this.convertFiveMinDataToOneHourData(start, end);
                    return result;
                }
            }
        }
    }
    convertFiveMinDataToOneHourData(start: number, end: number): any {
        throw new Error("Method not implemented.");
    }
    convertOneHourDataToFiveMinData(start: number, end: number): any {
        throw new Error("Method not implemented.");
    }
    convertOneMinDataToFiveMinData(start: number, end: number): any {
        throw new Error("Method not implemented.");
    }
    convertOneHourDataToOneMinData(start: number, end: number): any {
        throw new Error("Method not implemented.");
    }
    convertFiveMinDataToOneMin(start: number, end: number) {
        throw new Error("Method not implemented.");
    }

    getOneMinData(start: number, end: number): Datapoints | null {
        throw new Error("Method not implemented.");
    }

    getFiveMinData(start: number, end: Number): Datapoints | null {
        throw new Error("Method not implemented.");
    }

    getOneHourData(start: number, end: number): Datapoints | null {
        throw new Error("Method not implemented.");
    }
    saveData(start: number, end: number, resolution: Resolution, dataPoints: Datapoints) {
        if (resolution == 60) {
            this.saveOneMinData(start, end, dataPoints);
            this._sendOneMinRequest = false;
        }
        else if (resolution == 300) {
            this.saveFiveMinData(start, end, dataPoints);
            this._sendFiveMinRequest = false;
        }
        else {
            this.saveOneHourData(start, end, dataPoints);
            this._sendOneHourRequest = false;
        }
    }

    saveOneHourData(start: number, end: number, dataPoints: Datapoints) {
        const seconds = (end - start) / 1000;
        const hours = seconds / 60 / 60;
        let startCounter = start;
        for (let i = 0; i < hours; i++, startCounter += 3600) {
            this._oneHourdata.set(startCounter, dataPoints[i]);
        }
    }

    saveFiveMinData(start: number, end: number, dataPoints: Datapoints) {
        const seconds = (end - start) / 1000;
        const fiveMinIncrements = seconds / 300;
        let startCounter = start;
        for (let i = 0; i < fiveMinIncrements; i++, startCounter += 300) {
            this._fiveMindata.set(startCounter, dataPoints[i]);
        }
    }

    saveOneMinData(start: number, end: number, dataPoints: Datapoints) {
        const seconds = (end - start) / 1000;
        const oneMinIncrements = seconds / 60;
        let startCounter = start;
        for (let i = 0; i < oneMinIncrements; i++, startCounter += 60) {
            this._oneMindata.set(startCounter, dataPoints[i]);
        }
    }
}
