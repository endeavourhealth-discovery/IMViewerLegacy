import { bundleToText } from "@/helpers/Transforms";
import ConfigService from "@/services/ConfigService";

describe("bundleToText", () => {
  const testBundle = {
    entity: {
      "http://endhealth.info/im#isA": [
        { "@id": "http://snomed.info/sct#82354003", name: "Multiple system malformation syndrome (disorder)" },
        { "@id": "http://snomed.info/sct#85995004", name: "Autosomal recessive hereditary disorder (disorder)" },
        { "@id": "http://snomed.info/sct#89886004", name: "Congenital anomaly of skeletal muscle (disorder)" },
        { "@id": "http://snomed.info/sct#128084001", name: "Duane's syndrome, type 3 (disorder)" },
        { "@id": "http://snomed.info/sct#298382003", name: "Scoliosis deformity of spine (disorder)" },
        { "@id": "http://snomed.info/sct#363212003", name: "Hereditary disorder of musculoskeletal system (disorder)" },
        { "@id": "http://snomed.info/sct#363235000", name: "Hereditary disorder of nervous system (disorder)" },
        { "@id": "http://snomed.info/sct#363343008", name: "Hereditary disorder of the visual system (disorder)" },
        { "@id": "http://snomed.info/sct#257277002", name: "Combined disorder of muscle AND peripheral nerve (disorder)" },
        { "@id": "http://snomed.info/sct#363070008", name: "Developmental hereditary disorder (disorder)" },
        {
          "http://endhealth.info/im#roleGroup": [
            {
              "http://snomed.info/sct#370135005": { "@id": "http://snomed.info/sct#308490002", name: "Pathological developmental process (qualifier value)" },
              "http://snomed.info/sct#116676008": {
                "@id": "http://snomed.info/sct#49755003",
                name: "Morphologically abnormal structure (morphologic abnormality)"
              },
              "http://snomed.info/sct#363698007": { "@id": "http://snomed.info/sct#80622005", name: "Abducens nerve structure (body structure)" },
              "http://snomed.info/sct#246454002": { "@id": "http://snomed.info/sct#255399007", name: "Congenital (qualifier value)" }
            },
            {
              "http://snomed.info/sct#370135005": { "@id": "http://snomed.info/sct#308490002", name: "Pathological developmental process (qualifier value)" },
              "http://snomed.info/sct#116676008": { "@id": "http://snomed.info/sct#31739005", name: "Lateral abnormal curvature (morphologic abnormality)" },
              "http://snomed.info/sct#363698007": { "@id": "http://snomed.info/sct#289959001", name: "Musculoskeletal structure of spine (body structure)" }
            },
            {
              "http://snomed.info/sct#370135005": { "@id": "http://snomed.info/sct#308490002", name: "Pathological developmental process (qualifier value)" },
              "http://snomed.info/sct#116676008": {
                "@id": "http://snomed.info/sct#49755003",
                name: "Morphologically abnormal structure (morphologic abnormality)"
              },
              "http://snomed.info/sct#363698007": { "@id": "http://snomed.info/sct#127954009", name: "Skeletal muscle structure (body structure)" },
              "http://snomed.info/sct#246454002": { "@id": "http://snomed.info/sct#255399007", name: "Congenital (qualifier value)" }
            },
            {
              "http://snomed.info/sct#370135005": { "@id": "http://snomed.info/sct#308490002", name: "Pathological developmental process (qualifier value)" },
              "http://snomed.info/sct#116676008": {
                "@id": "http://snomed.info/sct#49755003",
                name: "Morphologically abnormal structure (morphologic abnormality)"
              },
              "http://snomed.info/sct#363698007": { "@id": "http://snomed.info/sct#81745001", name: "Structure of eye proper (body structure)" },
              "http://snomed.info/sct#246454002": { "@id": "http://snomed.info/sct#255399007", name: "Congenital (qualifier value)" }
            }
          ]
        }
      ]
    },
    predicates: {
      "http://snomed.info/sct#370135005": "Pathological process (attribute)",
      "http://endhealth.info/im#roleGroup": "Where",
      "http://snomed.info/sct#116676008": "Associated morphology (attribute)",
      "http://snomed.info/sct#363698007": "Finding site (attribute)",
      "http://snomed.info/sct#246454002": "Occurrence (attribute)",
      "http://endhealth.info/im#isA": "Is a",
      "http://www.w3.org/2002/07/owl#onProperty": "On property",
      "http://www.w3.org/2002/07/owl#intersectionOf": "Combination of",
      "http://www.w3.org/2002/07/owl#someValuesFrom": "With a value",
      "http://www.w3.org/2002/07/owl#equivalentClass": "Is equivalent to"
    }
  };
  const expected =
    "Is a:\n" +
    "  Multiple system malformation syndrome\n" +
    "  Autosomal recessive hereditary disorder\n" +
    "  Congenital anomaly of skeletal muscle\n" +
    "  Duane's syndrome, type 3\n" +
    "  Scoliosis deformity of spine\n" +
    "  Hereditary disorder of musculoskeletal system\n" +
    "  Hereditary disorder of nervous system\n" +
    "  Hereditary disorder of the visual system\n" +
    "  Combined disorder of muscle AND peripheral nerve\n" +
    "  Developmental hereditary disorder\n" +
    "  Where:\n" +
    "    ( Pathological process : Pathological developmental process\n" +
    "      Associated morphology : Morphologically abnormal structure\n" +
    "      Finding site : Abducens nerve structure\n" +
    "      Occurrence : Congenital )\n" +
    "    ( Pathological process : Pathological developmental process\n" +
    "      Associated morphology : Lateral abnormal curvature\n" +
    "      Finding site : Musculoskeletal structure of spine )\n" +
    "    ( Pathological process : Pathological developmental process\n" +
    "      Associated morphology : Morphologically abnormal structure\n" +
    "      Finding site : Skeletal muscle structure\n" +
    "      Occurrence : Congenital )\n" +
    "    ( Pathological process : Pathological developmental process\n" +
    "      Associated morphology : Morphologically abnormal structure\n" +
    "      Finding site : Structure of eye proper\n" +
    "      Occurrence : Congenital )\n";
  beforeEach(() => {
    jest.resetAllMocks();

    ConfigService.getDefaultPredicatenames = jest.fn().mockResolvedValue({
      "http://endhealth.info/im#isA": "Is a",
      "http://endhealth.info/im#roleGroup": "Where",
      "http://www.w3.org/2002/07/owl#onProperty": "On property",
      "http://www.w3.org/2002/07/owl#intersectionOf": "Combination of",
      "http://www.w3.org/2002/07/owl#someValuesFrom": "With a value",
      "http://www.w3.org/2002/07/owl#equivalentClass": "Is equivalent to"
    });
  });

  it("can convert a bundle to text", async () => {
    expect(await bundleToText(testBundle)).toBe(expected);
  });
});
