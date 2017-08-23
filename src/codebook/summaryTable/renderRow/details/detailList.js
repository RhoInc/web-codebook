import renderValues from './renderValues';
import renderStats from './renderStats';
import renderMeta from './renderMeta';
import clearDetails from './clearDetails';

const detailList = [
  { key: 'Stats', action: renderStats },
  { key: 'Meta', action: renderMeta },
  { key: 'Values', action: renderValues },
  { key: 'None', action: clearDetails }
];
export default detailList;
