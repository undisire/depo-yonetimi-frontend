<template>
  <v-container>
    <section class="mb-5">
      <v-breadcrumbs
        :items="items"
        divider="›"
        class="px-0 pb-0 text-body-2 mb-2"
      ></v-breadcrumbs>
      <div
        class="d-flex justify-space-between align-center flex-wrap ga-4 mb-2"
      >
        <h1 class="text-h5 text-md-h4 ps-1">Depolar</h1>
        <div class="d-flex ga-2 align-center">
          <v-btn
            color="primary"
            rounded="lg"
            flat
            @click="editDialog.open()"
            prepend-icon="mdi-plus"
            >Yeni Ekle</v-btn
          >
        </div>
      </div>
    </section>

    <v-card border flat rounded="lg">
      <v-data-table
        density="comfortable"
        :headers="headers"
        :items="data"
        :loading="status === 'loading'"
        hide-default-footer
        :items-per-page="-1"
        :no-data-text="
          status === 'success' ? 'Depo bulunamadı' : 'Depolar yükleniyor...'
        "
      >
        <template v-slot:item.is_active="{ value }">
          <div
            class="d-flex align-center ga-2 font-weight-medium"
            :class="[value ? 'text-success' : 'text-error']"
          >
            <v-icon size="18">mdi-circle</v-icon>
            {{ value ? "Aktif" : "Pasif" }}
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            @click="editDialog.open(item)"
            color="primary"
            size="x-small"
            variant="text"
            class="mr-2"
          />
          <v-btn
            icon="mdi-delete"
            @click="handleDelete(item)"
            color="error"
            variant="text"
            size="x-small"
          />
        </template>
      </v-data-table>
    </v-card>

    <WarehouseEditDialog ref="editDialog" @saved="refresh" />
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const client = useJwtClient();
const confirm = useConfirm();
const $toast = useToast();

const editDialog = ref();

const items = [
  {
    title: "Anasayfa",
    disabled: false,
    to: "/dashboard",
  },
  {
    title: "Liste",
    disabled: true,
  },
];

const headers = [
  { title: "Kod", value: "code" },
  { title: "Depo", value: "name" },
  { title: "Konum", value: "location" },
  { title: "Durum", value: "is_active" },
  { title: "İşlemler", value: "actions", sortable: false, align: "end" },
];

const loadingConfirm = ref(false);

const { data, status, refresh } = useLazyAsyncData(
  () => {
    return client.get("/warehouses").then((x) => x.data);
  },
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

function handleDelete(item) {
  confirm.open({
    title: "Depo Sil",
    description: `Depo silinecek: ${item.name}`,
    onConfirm: () => {
      loadingConfirm.value = true;
      client
        .delete(`/warehouses/${item.id}`)
        .then(() => {
          $toast.success("Depo başarıyla silindi.");
          refresh();
          confirm.close();
        })
        .finally(() => {
          loadingConfirm.value = false;
        });
    },
  });
}
</script>
