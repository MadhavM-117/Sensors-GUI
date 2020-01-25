export interface SensorListingProps {

}

export interface SensorListingState {
    sensors: Sensor[]
}

export interface SensorProps {
    sensor: Sensor
}

export interface Sensor {
    path: string, 
    name: string, 
    temperatures : {label: string, value: string}[]
    fans : {value: string}[]
}