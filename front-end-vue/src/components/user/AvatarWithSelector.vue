<template>
  <div class="avatar-container">
    <img
      id="selected-avatar"
      :src="getUrl(selectedAvatar.value)"
      alt="avatar icon"
    />
    <Button
      icon="pi pi-angle-down"
      class="p-button-rounded p-button-primary avatar-button"
      @click="toggleAvatarSelect"
    />
    <OverlayPanel ref="avatar" class="avatar-popup">
      <div>
        Icons made by
        <a
          href="https://www.flaticon.com/authors/vitaly-gorbachev"
          title="Vitaly Gorbachev"
          >Vitaly Gorbachev</a
        >
        from
        <a href="https://www.flaticon.com/" title="Flaticon"
          >www.flaticon.com</a
        >
      </div>
      <SelectButton
        v-model="selectedAvatar"
        :options="avatarOptions"
        dataKey="value"
      >
        <template #option="slotProps">
          <img
            class="avatar-select"
            :src="require('@/assets/avatars/' + slotProps.option.value)"
            alt="avatar icon"
            style="width: 3em;"
          />
        </template>
      </SelectButton>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "AvatarWithSelector",
  props: ["selectedAvatar"],
  emits: ["avatarSelected"]
})

export default class AvatarWithSelector extends Vue {

}
</script>

<style scoped>
.avatar-container {
  position: relative;
  padding: 1.5em;
  /* margin: 1em; */
}

.avatar-button {
  position: absolute;
  bottom: 0;
  right: 0;
}

#selected-avatar {
  margin-block-start: 0.5em;
  width: 150px;
  border: 1px solid lightgray;
  border-radius: 50%;
}
</style>
