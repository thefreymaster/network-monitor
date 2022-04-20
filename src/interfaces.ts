export interface ISpeedtest {
    client:
    {
        city: string,
        countryCode: string,
        ip: string
    },

    createdAt: string,
    downloadSpeed: number,
    jitter: number,
    ping: number,
    server:
    {
        city: string,
        countryCode: string,
        distance: number,
        region: string
    }
    totalTime: number,
    uploadSpeed: number,
}

export interface IAnomaly extends ISpeedtest {
    type: string,
}