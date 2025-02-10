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
        <h1 class="text-h5 text-md-h4 ps-1">Çalışanlar</h1>
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
        :loading="status === 'pending'"
        hide-default-footer
        :items-per-page="-1"
      >
        <template #item.name="{ item }">
          {{ item.first_name }} {{ item.last_name }}
        </template>
        <template #item.actions="{ item }">
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
            size="x-small"
            variant="text"
          />
        </template>
      </v-data-table>
    </v-card>

    <EmployeeEditDialog ref="editDialog" @saved="refresh" />
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
  {
    title: "#",
    value: "id",
  },
  {
    title: "Çalışan Adı",
    value: "name",
  },
  {
    title: "Telefon Numarası",
    value: "phone",
  },
  {
    title: "Rol",
    value: "role.name",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

const { data, status, refresh } = useLazyAsyncData(
  () => client.get("/employees").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

function handleDelete(item) {
  confirm.open({
    title: "Çalışan Sil",
    description: `Çalışan silinecek: ${item.first_name}`,
    onConfirm: () => {
      loadingConfirm.value = true;
      client
        .delete(`/employees/${item.id}`)
        .then(() => {
          $toast.success("Çalışan başarıyla silindi.");
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
