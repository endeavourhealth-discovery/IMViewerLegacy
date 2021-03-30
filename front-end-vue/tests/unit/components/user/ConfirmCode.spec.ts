import store from '@/store/index';
// import { createStore } from 'vuex';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { mount } from '@vue/test-utils';
import ConfirmCode from '@/components/user/ConfirmCode.vue';
import InputText from 'primevue/inputtext';

test('renders username when set', async () => {
    store.commit("updateRegisteredUsername", "testUser");
    const wrapper = mount(ConfirmCode,
        {
            global: {
                plugins: [store],
                components: { Card, Button, InputText },
            }
        })
    // Assert the rendered text of the component
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('fieldUsername')
    expect(userNameInput.value).toBe("testUser");
})