import React from 'react';
import { BASE_SENSOR_PATH } from '../../constants/paths';
import * as fs from '../../utils/fileSystem';
import path from 'path';

import { SensorListingProps, SensorListingState, SensorProps, Sensor } from './index.types';

export const SensorItem: React.FC<SensorProps> = (props: SensorProps) => {
  const { name, temperatures, fans } = props.sensor;
  return (
    <div>
      <h1>{name}</h1>
      <h2>Temperatures</h2>
      {temperatures.map(t => {
        return <div><label>{t.label}{" - "}</label><span>{t.value}</span></div>;
      })}
      <h2>Fans</h2>
      {fans.map(f => {
        return <div>{f.value}</div>
      })}
    </div>
  );
}

export class SensorListing extends React.Component<SensorListingProps, SensorListingState> {
  private sensorFetchInterval: any;

  constructor(props: SensorListingProps) {
    super(props);
    this.state = {
      sensors: []
    }
  }

  public componentDidMount = () => {
    this.sensorFetchInterval = setInterval(async () => {
      const sensors = await this.getAllSensorData();
      this.setState({ sensors });
    }, 1000);
  }

  public componentWillUnmount = () => {
    if (this.sensorFetchInterval) {
      clearInterval(this.sensorFetchInterval);
    }
  }

  private getSensorPaths = async (): Promise<string[]> => {
    var sensorPaths = [];
    var dir = await fs.readdir(BASE_SENSOR_PATH);
    for (let entryPath in dir) {
      sensorPaths.push(path.join(BASE_SENSOR_PATH, dir[entryPath]));
    }

    return sensorPaths;
  }

  private getSensorName = async (sensorPath: string) => {
    var namePath = path.join(sensorPath, "name");
    // var nameFD = fs.openSync(namePath);
    const name = await fs.readFile(namePath)
    return name.toString().trim();
  }

  private getSensorTemperatures = async (sensorPath: string) => {
    const allTemperatures = [];
    let index = 1;
    while (true) {
      var labelPath = path.join(sensorPath, `temp${index}_label`);
      const valuePath = path.join(sensorPath, `temp${index}_input`);

      if (!await fs.exists(labelPath)) {
        break;
      }
      if (!await fs.exists(valuePath)) {
        break;
      }

      const tempLabel = await fs.readFile(labelPath);
      const tempValue = await fs.readFile(valuePath);
      const tempDict = {
        label: tempLabel.toString().trim(),
        value: tempValue.toString().trim()
      }
      index++;
      allTemperatures.push(tempDict);
    }
    return allTemperatures;
  }

  private getSensorFans = async (sensorPath: string) => {
    const allFans = [];
    let index = 1;
    while (true) {
      const valuePath = path.join(sensorPath, `fan${index}_input`);
      if (!await fs.exists(valuePath)) {
        break;
      }

      const fanValue = await fs.readFile(valuePath);
      const fanDict = { "value": fanValue.toString().trim() };
      index++;
      allFans.push(fanDict);
    }
    return allFans;
  }

  private getAllSensorData = async (): Promise<Sensor[]> => {
    const sensorPaths = await this.getSensorPaths();
    const allSensorData = []
    for (let path of sensorPaths) {
      const sensorName = await this.getSensorName(path);
      const sensorData = {
        temperatures: await this.getSensorTemperatures(path),
        fans: await this.getSensorFans(path),
        name: sensorName,
        path
      }

      allSensorData.push(sensorData);
    }

    return allSensorData;
  }

  public render = () => {
    const { sensors } = this.state;
    return (
      <React.Fragment>
        {sensors.map(s => <SensorItem sensor={s} key={s.name} />)}
      </React.Fragment>
    );
  }
}