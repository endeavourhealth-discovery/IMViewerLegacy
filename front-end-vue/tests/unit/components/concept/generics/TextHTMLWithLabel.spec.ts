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
