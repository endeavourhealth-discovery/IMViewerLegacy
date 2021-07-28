import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import axios, { AxiosResponse } from "axios";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  // public static async getConfig(name: string): Promise<AxiosResponse<any>> {
  //   return axios.get(this.api + "api/config/getConfig", {
  //     params: {
  //       name: name
  //     }
  //   });
  // }

  public static async getConfig(name: string): Promise<any> {
    return new Promise(resolve => {
      resolve({
        data: [
          {
            label: "Name",
            predicate: RDFS.LABEL,
            type: "TextWithLabel",
            size: "50%",
            order: 0
          },
          {
            label: "Iri",
            predicate: "@id",
            type: "TextWithLabel",
            size: "50%",
            order: 1
          },
          {
            label: "Status",
            predicate: IM.STATUS,
            type: "ObjectNameWithLabel",
            size: "50%",
            order: 2
          },
          {
            label: "Types",
            predicate: RDF.TYPE,
            type: "ArrayObjectNamesToStringWithLabel",
            size: "50%",
            order: 3
          },
          {
            label: "Description",
            predicate: RDFS.COMMENT,
            type: "TextHTMLWithLabel",
            size: "100%",
            order: 4
          },
          {
            label: "Divider",
            predicate: "isa",
            type: "Divider",
            size: "100%",
            order: 5
          },
          {
            label: "is a",
            predicate: "isa",
            type: "ListboxWithLabel",
            size: "50%",
            order: 6
          },
          {
            label: "has sub types",
            predicate: "subtypes",
            type: "ListboxWithLabel",
            size: "50%",
            order: 7
          },
          {
            label: "Divider",
            predicate: "dataModelProperties",
            type: "Divider",
            size: "100%",
            order: 8
          },
          {
            label: "Semantic properties",
            predicate: "semanticProperties",
            type: "SemanticProperties",
            size: "100%",
            order: 9
          },
          {
            label: "Divider",
            predicate: "dataModelProperties",
            type: "Divider",
            size: "100%",
            order: 10
          },
          {
            label: "Data model properties",
            predicate: "dataModelProperties",
            type: "DataModelProperties",
            size: "100%",
            order: 11
          }
        ]
      });
    });
  }
}
