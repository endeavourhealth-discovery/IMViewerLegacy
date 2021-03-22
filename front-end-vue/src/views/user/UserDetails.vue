<template>
  <div v-if="currentUser" class="p-d-flex p-flex-row p-ai-center">
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center user-details-card">
      <template #header>
        <i class="pi pi-fw pi-user" style="fontSize: 50px; margin: 1em;" />
      </template>
      <template #title>
        My Account Details
      </template>
      <template #content>
        <InputText type="text" :placeholder="currentUser.firstName" disabled />
        <InputText type="text" :placeholder="currentUser.lastName" disabled />
        <InputText type="text" :placeholder="currentUser.email" disabled />
        <Button class="user-edit" type="submit" label="Edit" v-on:click.prevent="handleEditClicked"/>
      </template>
    </Card>

  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";

@Options({
  name: "UserDetails",
  components: {

  },
  props: ["currentUser"]
})

export default class UserDetails extends Vue {

  handleEditClicked() {
    this.$router.push({name: "UserEdit"})
  }
}
</script>

<style>

</style>
