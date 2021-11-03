export default interface TTGraphData {
  name: string;
  relToParent: string;
  children: TTGraphData[];
  _children: TTGraphData[];
}
