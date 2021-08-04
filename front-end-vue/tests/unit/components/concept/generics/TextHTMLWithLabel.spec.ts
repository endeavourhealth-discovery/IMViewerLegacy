import { shallowMount } from "@vue/test-utils";
import TextHTMLWithLabel from "@/components/generics/TextHTMLWithLabel.vue";

describe("TextHTMLWithLabel.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter", size: "100%", id: "TextHTMLWithLabel1" }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toEqual("<p class='TextHTMLWithLabel1-p'>An entry recording information about a criticial care encounter.</p><p class='TextHTMLWithLabel1-p'>common data model attributes for Critical care encounter</p>");
  });
});

describe("TextHTMLWithLabel.vue ___ descContainer", () => {
  let wrapper: any;
  let docSpy: any;
  let mockElement: any;

  beforeEach(() => {
    jest.resetAllMocks();

    docSpy = jest.spyOn(document, "getElementById");
    mockElement = document.createElement("div");
    mockElement.innerHTML = "";
    docSpy.mockReturnValue(mockElement);

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter", size: "100%", id: "TextHTMLWithLabel1" }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toEqual("<p class='TextHTMLWithLabel1-p'>An entry recording information about a criticial care encounter.</p><p class='TextHTMLWithLabel1-p'>common data model attributes for Critical care encounter</p>");
    expect(mockElement.innerHTML).toEqual('<p class=\"TextHTMLWithLabel1-p\">An entry recording information about a criticial care encounter.</p><p class=\"TextHTMLWithLabel1-p\">common data model attributes for Critical care encounter</p>');
  });

  it("can render data", () => {
    const label = wrapper.get(".label");
    expect(label.text()).toBe("Description:");
    expect(mockElement.innerHTML).toEqual('<p class=\"TextHTMLWithLabel1-p\">An entry recording information about a criticial care encounter.</p><p class=\"TextHTMLWithLabel1-p\">common data model attributes for Critical care encounter</p>');
  });
});

describe("TextHTMLWithLabel.vue ___ id", () => {
  let wrapper: any;
  let docSpy: any;
  let mockElement: any;

  beforeEach(() => {
    jest.resetAllMocks();

    docSpy = jest.spyOn(document, "getElementById");
    mockElement = document.createElement("div");
    mockElement.innerHTML = "";
    docSpy.mockReturnValue(mockElement);

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: undefined, size: "100%", id: undefined }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toBe("");
  });

  it("renders data", () => {
    const label = wrapper.get(".label");
    expect(label.text()).toBe("Description:");
    expect(mockElement.innerHTML).toEqual("");
  });
});

describe("TextHTMLWithLabel.vue ___ data", () => {
  let wrapper: any;
  let docSpy: any;
  let mockElement: any;

  beforeEach(() => {
    jest.resetAllMocks();

    docSpy = jest.spyOn(document, "getElementById");
    mockElement = document.createElement("div");
    mockElement.innerHTML = "";
    docSpy.mockReturnValue(mockElement);

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: undefined, size: "100%", id: "TextHTMLWithLabel1" }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toBe("");
  });

  it("renders data", () => {
    const label = wrapper.get(".label");
    expect(label.text()).toBe("Description:");
    expect(mockElement.innerHTML).toEqual("");
  });
});


describe("TextHTMLWithLabel.vue ___ <p> start and end", () => {
  let wrapper: any;
  let docSpy: any;
  let mockElement: any;

  beforeEach(() => {
    jest.resetAllMocks();

    docSpy = jest.spyOn(document, "getElementById");
    mockElement = document.createElement("div");
    mockElement.innerHTML = "";
    docSpy.mockReturnValue(mockElement);

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: "<p>An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter<p>", size: "100%", id: "TextHTMLWithLabel1" }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toBe("<p class='TextHTMLWithLabel1-p'>An entry recording information about a criticial care encounter.</p><p class='TextHTMLWithLabel1-p'>common data model attributes for Critical care encounter</p>");
  });

  it("renders data", () => {
    const label = wrapper.get(".label");
    expect(label.text()).toBe("Description:");
    expect(mockElement.innerHTML).toEqual("<p class=\"TextHTMLWithLabel1-p\">An entry recording information about a criticial care encounter.</p><p class=\"TextHTMLWithLabel1-p\">common data model attributes for Critical care encounter</p>");
  });
});
