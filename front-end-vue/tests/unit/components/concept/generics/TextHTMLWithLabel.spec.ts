import { shallowMount } from "@vue/test-utils";
import TextHTMLWithLabel from "@/components/concept/generics/TextHTMLWithLabel.vue";

describe("TextHTMLWithLabel.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter", size: "100%", id: "TextHTMLWithLabel1" }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toBe("<p class='description-p'>An entry recording information about a criticial care encounter.</p>\n<p class='description-p'>common data model attributes for Critical care encounter</p>");
  });
});

describe("TextHTMLWithLabel.vue ___ descContainer", () => {
  let wrapper: any;
  let docSpy: any;
  let mockElement: any;

  beforeEach(() => {
    jest.resetAllMocks();

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    mockElement = document.createElement("div");
    mockElement.innerHTML = "";
    docSpy.mockReturnValue(mockElement);

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter", size: "100%", id: "TextHTMLWithLabel1" }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toBe("<p class='description-p'>An entry recording information about a criticial care encounter.</p>\n<p class='description-p'>common data model attributes for Critical care encounter</p>");
    expect(mockElement.innerHTML).toBe('<p class="description-p">An entry recording information about a criticial care encounter.</p>\n<p class="description-p">common data model attributes for Critical care encounter</p>');
  });
});

describe("TextHTMLWithLabel.vue ___ noData", () => {
  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(TextHTMLWithLabel, {
      props: { label: "Description", data: undefined, size: "100%", id: undefined }
    });
  });

  it("can create convertedText", () => {
    expect(wrapper.vm.convertedText).toBe("");
  });
});
