import store from "@/store/index";
import {mount } from '@vue/test-utils';
import ConfirmCode from '@/components/user/ConfirmCode.vue';
import InputText from 'primevue/inputtext';

describe("ConfirmCode.vue", () => {
    it('renders username when set', async () => {
        store.state.registeredUsername = "testUser";

        const wrapper = mount(ConfirmCode);
        const un = wrapper.findComponent(InputText);
        expect(un).not.toBeNull();
        console.log(un);
        expect(un.text()).toBe("testUser");
    })
});
