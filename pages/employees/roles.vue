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
        <h1 class="text-h5 text-md-h4 ps-1">Çalışan Rolleri</h1>
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

    <v-card flat border rounded="lg">
      <v-data-table
        :items="data"
        :headers="headers"
        :items-per-page="-1"
        hide-default-footer
        :loading="status === 'pending'"
        density="comfortable"
      >
        <template #item.type="{ item }">
          {{ typeDisplayTexts?.[item.type] || item.type }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            v-if="!item.is_system"
            icon="mdi-pencil"
            @click="editDialog.open(item)"
            color="primary"
            size="x-small"
            variant="text"
            class="mr-2"
          />
          <v-btn
            v-if="!item.is_system"
            icon="mdi-delete"
            @click="handleDelete(item)"
            color="error"
            size="x-small"
            variant="text"
          />
        </template>
      </v-data-table>
    </v-card>

    <RoleEditDialog ref="editDialog" @saved="refresh" type="employee" />
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const client = useJwtClient();
const $toast = useToast();
const confirm = useConfirm();

const loadingConfirm = ref(false);
const editDialog = ref(null);

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
  { title: "Rol Adı", value: "name" },
  { title: "İşlemler", value: "actions", sortable: false, align: "end" },
];

const typeDisplayTexts = {
  user: "Kullanıcı",
  employee: "Çalışan",
};

const { data, status, refresh } = useLazyAsyncData(
  () =>
    client
      .get("/roles", {
        params: {
          type: "employee",
        },
      })
      .then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

function handleDelete(item) {
  confirm.open({
    title: "Çalışan rolü Sil",
    description: `Çalışan rolü silinecek: ${item.name}`,
    onConfirm: () => {
      loadingConfirm.value = true;
      client
        .delete(`/roles/${item.id}`)
        .then(() => {
          $toast.success("Çalışan rolü başarıyla silindi.");
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
