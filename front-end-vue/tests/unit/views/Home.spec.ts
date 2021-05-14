import store from "@/store/index";
import { shallowMount } from "@vue/test-utils";
import { Auth } from "aws-amplify";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Home from "@/views/Home.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import SideNav from "@/components/home/SideNav.vue";
import { CustomAlert } from "@/models/user/CustomAlert";

const mock = new MockAdapter(axios);
const url = process.env.VUE_APP_API;
mock
  .onGet(url + "api/concept", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, {
    "@id": "http://endhealth.info/im#DiscoveryOntology",
    "http://endhealth.info/im#isA": [
      { "@id": "http://www.w3.org/2002/07/owl#Thing" },
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
      { "@id": "http://endhealth.info/im#Folder", name: "Folder" },
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment":
      "A folder of ontologies including information models, valuesets, query sets and maps",
    "http://www.w3.org/2000/01/rdf-schma": "Discovery ontology",
  });

mock
  .onGet(url + "api/concept/parents", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, []);

mock
  .onGet(url + "api/concept/children", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, {
    "@id": "http://snomed.info/sct#138875005",
    hasChildren: true,
    name: "SNOMED CT Concept (SNOMED RT+CTV3)",
    type: { elements: [{ "@id": "http://www.w3.org/2002/07/owl#Class" }] },
  });

mock
  .onGet(url + "api/concept/mappedTo", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, ["test"]);

mock
  .onGet(url + "api/concept/mappedFrom", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, []);

mock
  .onGet(url + "api/concept/usages", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, [
    {
      "@id": "http://snomed.info/sct#138875005",
      name: "SNOMED CT Concept (SNOMED RT+CTV3)",
    },
  ]);

mock
  .onGet(url + "api/concept/graph", {
    params: { iri: "http://endhealth.info/im#DiscoveryOntology" },
  })
  .reply(200, {
    children: [],
    iri: "http://endhealth.info/#imDiscoveryOntology",
    name: "Discovery ontology",
  });

describe("Home.vue currentUser found", () => {
  let wrapper: any;
  beforeEach(() => {
    const $router = { push: jest.fn() };
    const $route = { name: "Home" };
    const $toast = { add: jest.fn() };
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
      return {
        username: "devtest",
        attributes: {
          "custom:avatar": "colour/001-man.png",
          "custom:forename": "Dev",
          "custom:surname": "Test",
          email: "dev.test@ergosoft.co.uk",
          email_verified: true,
          sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09",
        },
      };
    });
    wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
        components: { SidebarControl, SideNav },
        mocks: { $router, $route, $toast },
        stubs: ["router-link", "router-view"],
      },
    });
    store.commit("updateSnomedLicenseAccepted", "true");
  });

  it("should check for authenticated user on mount and log in if found", () => {
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(store.state.currentUser.username).toBe("devtest");
    expect(store.state.currentUser.firstName).toBe("Dev");
    expect(store.state.currentUser.lastName).toBe("Test");
    expect(store.state.currentUser.email).toBe("dev.test@ergosoft.co.uk");
    expect(store.state.currentUser.avatar.value).toBe("colour/001-man.png");
  });

  it("should update store from route name ___ Home", () => {
    expect(store.state.conceptIri).toBe(
      "http://endhealth.info/im#DiscoveryOntology"
    );
  });

  it("should fetchConceptAggregate and add to store", () => {
    expect(store.state.conceptAggregate.concept["@id"]).toBe(
      "http://endhealth.info/im#DiscoveryOntology"
    );
  });
});

describe("Home.vue no currentUser", () => {
  let wrapper: any;
  beforeEach(() => {
    const $router = { push: jest.fn() };
    const $route = { name: "Home" };
    const $toast = { add: jest.fn() };
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
      return { status: 403 };
    });
    Auth.signOut = jest.fn().mockImplementation(() => {
      return new CustomAlert(200, "Logged out successfully");
    });
    wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
        components: { SidebarControl, SideNav },
        mocks: { $router, $route, $toast },
        stubs: ["router-link", "router-view"],
      },
    });
    store.commit("updateSnomedLicenseAccepted", "true");
  });

  it("should check for authenticated user on mount and logout if not found", () => {
    expect(Auth.currentAuthenticatedUser).toBeCalledTimes(1);
    expect(Auth.signOut).toBeCalledTimes(1);
  });
});
