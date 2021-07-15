<template>
  <ScrollPanel class="scroll-panel">
    <div class="card">
      <div class="p-grid">
        <div class="p-lg-4 p-md-12 p-sm-12">
          <FileUpload
            ref="fileUpload"
            name="demo[]"
            :customUpload="true"
            @uploader="onUpload"
            @clear="clearUpload"
            :preview-width="0"
            @remove="clearUpload"
            accept="text/plain"
            chooseLabel="Select"
            :fileLimit="1"
            :maxFileSize="1000000"
            @paste="onPaste"
          >
            <template #empty>
              <p>Drag and drop files here to upload.</p>
            </template>
          </FileUpload>
        </div>
        <div
          class="p-lg-4 p-md-12 p-sm-12"
          id="file-upload-instructions-container"
          style="font-size: small;"
        >
          <p class="p-text-bold">File format description:</p>
          <p>
            The address file to be uploaded must contain two columns separated
            by a single tab character with a .txt extension
          </p>
          <p>The first line must not contain any header information</p>
          <p>The first column is a unique numeric row id</p>
          <p>
            The second column is an address string including a postcode at the
            end with a comma separating the address from the postcode
          </p>
          <p>
            The third column is the postal region (not mandatory, but useful
            when you don't know the address candidates postcode)
          </p>
        </div>
        <div class="p-lg-4 p-md-12 p-sm-12" style="font-size: small">
          <p class="p-text-bold">Example records:</p>
          <p>1[tab]10 Downing St,Westminster,London,SW1A2AA</p>
          <p>2[tab]10 Downing St,Westminster,London[tab]SW</p>
          <p>3[tab]Bridge Street,London,SW1A 2LW</p>
          <p>4[tab]221b Baker St,Marylebone,London,NW1 6XE</p>
          <p>5[tab]3 Abbey Rd,St John's Wood,London,NW8 9AY</p>
        </div>
      </div>
      <Button
        label="Refresh table"
        icon="fa fa-fw fa-redo"
        @click="refreshActivity"
        style="margin: 2rem 0 1rem 0"
      />
      <DataTable
        :value="activity"
        responsiveLayout="scroll"
        showGridlines
        id="activity"
        :scrollable="true"
        scrollHeight="flex"
      >
        <Column field="DT" header="Time"></Column>
        <Column field="A" header="Status"></Column>
        <Column field="F" header="Action">
          <template #body="slotProps">
            <button
              v-if="slotProps.data.F"
              type="button"
              @click="download(slotProps.data.F)"
              class="p-button button-download pi pi-download"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </ScrollPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UprnService from "@/services/UprnService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "FileWorkflow",
  data() {
    return {
      activity: []
    };
  },
  mounted() {
    this.refreshActivity();
  },
  methods: {
    async refreshActivity() {
      this.activity = (await UprnService.getActivity()).data;
    },
    async download(filename: string) {
      await UprnService.download(filename).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      });
    },
    async onUpload(event: any) {
      console.log(event.files[0]);
      await UprnService.upload(event.files[0])
        .then(() => {
          this.$toast.add(LoggerService.success("fileUploaded"));
          this.refreshActivity();
        })
        .catch(error => {
          this.$toast.add(LoggerService.error("errorUploading", error));
        });
      console.log("upload" + event.files[0].name);
    },
    async clearUpload() {
      const x = this.$refs.fileUpload as any;
      x.uploadedFileCount = 0;
      console.log("Clear upload");
    },
    async onPaste(event: any) {
      // console.log(event.clipboardData.items[0]);
      const x = this.$refs.fileUpload as any;
      x.files.push(event.clipboardData.files[0]);
      console.log(event.clipboardData.files[0]);
    }
  }
});
</script>

<style scoped>
.scroll-panel {
  width: 100%;
  height: calc(100vh - 10rem);
  overflow-y: auto;
}

#activity {
  height: calc(100vh - 32rem);
  overflow-y: auto;
}

.p-fileupload-row div:first-of-type {
  display: none;
}

.file-upload-instructions-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  gap: 7px;
}
</style>
