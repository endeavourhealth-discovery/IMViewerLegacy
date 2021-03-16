export class ConceptDetailsSchema {
  property: string;
  control: string;
  prefix: string;
  size: number;
  conceptKey: string;
  conceptValue: any;

  constructor(
    key: string,
    value: any,
  ){
    this.property = this.getProperty(key);
    this.control = this.getControl(key, value);
    this.prefix = this.getPrefix(key, value);
    this.size = this.getSize(value);
    this.conceptKey = key;
    this.conceptValue = this.getValue(value);
  }

  getProperty(key: string){
    if (key === "iri"){
      return "iri";
    } else if (key === "name") {
      return "name"
    } else {
      return key.split("#")[1];
    }
  }

  getControl(key: string, value: any){
    if (typeof(value) === "object"){
      return "TTExpressionList";
    } else if (typeof(value) === "string"){
      if (key ==="name"){
        return "TTEdit";
      } else {
        return "TTIRIEdit"
      }
    } else {
      return "";
    }
  }

  getSize(value: any){
    if (typeof(value) === "object"){
      return 12
    } else if (typeof(value) === "string"){
      return 6
    } else {
      return 0
    }
  }

  getPrefix(key: string, value: any){
    if (/^(?=.*[#])(?=.*[/])/.test(key)){
      const predicate: string = key.substring(key.lastIndexOf("/") + 1, key.lastIndexOf("#")) + ":";
      switch (predicate) {
        case 'im:':
          return predicate;
        case 'sct:':
          return 'sn:';
        case 'owl:':
          return predicate;
        case 'rdf-schema:':
          return 'rdfs:';
        case '22-rdf-syntax:':
          return 'rdf:';
        default:
          return "";
      }

    } else if (typeof(value) === "string" && /^(?=.*[#])(?=.*[/])/.test(value)) {
      const predicate: string = value.substring(value.lastIndexOf("/") + 1, value.lastIndexOf("#")) + ":";
        switch (predicate) {
          case 'im:':
            return predicate;
          case 'sct:':
            return 'sn:';
          case 'owl:':
            return predicate;
          case 'rdf-schema:':
            return 'rdfs:';
          case '22-rdf-syntax:':
            return 'rdf:';
          default:
            return "";
        }
    } else {
      return "";
    }
  }

  getValue(value: any) {
    if (Array.isArray(value)){
      return value
    } else if (typeof(value) === "string"){
      return value
    } else if (typeof(value) === "object"){
      const results: Array<Record<string, any>> = []
      for (const [key, data] of Object.entries(value)){
        const obj: {[k: string]: any} = {}
        obj[key] = data;
        results.push(obj)
      }
      return results
    }
  }
}
