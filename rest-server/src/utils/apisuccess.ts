/**
 * Disabling eslint since we wouldn't be able to predict the type of
 * response from APIs
 */
export class ApiSuccess {
    public message: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public data: any;
    /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
    constructor (message: string, data: any) {
        this.message = message;
        this.data = data;
    }
}

