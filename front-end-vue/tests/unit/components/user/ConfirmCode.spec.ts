import store from '@/store/index';
// import { createStore } from 'vuex';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { mount } from '@vue/test-utils';
import ConfirmCode from '@/components/user/ConfirmCode.vue';
import InputText from 'primevue/inputtext';

let wrapper: any;

it('starts empty if no store registeredUsername', async() => {
    wrapper = mount(ConfirmCode, {
        global: {
            plugins: [store],
            components: { Card, Button, InputText}
        },
    })
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('fieldUsername')
    expect(userNameInput.value).toBe("");
})

beforeEach(() => {
    store.commit("updateRegisteredUsername", "testUser");
    wrapper = mount(ConfirmCode, {
        global: {
            plugins: [store],
            components: { Card, Button, InputText}
        },
    })
})

it('renders username when set', async () => {
    // Assert the rendered text of the component
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('fieldUsername')
    expect(userNameInput.value).toBe("testUser");
})

it('renders the store registeredUsername if present', async() => {
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('fieldUsername')
    expect(userNameInput.value).toBe("testUser");
})

it('updatesUsername when edited', async () => {
    wrapper.vm.username = "John"
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('fieldUsername')
    expect(userNameInput.value).toBe("John");
})
