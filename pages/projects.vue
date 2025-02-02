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
        <h1 class="text-h5 text-md-h4 ps-1">Projeler</h1>
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
      >
        <template #item.role="{ value }">
          {{ roleDisplayTexts?.[value] || value }}
        </template>
        <template #item.last_login="{ value }">
          {{
            value ? $datefns.format(new Date(value), "dd.MM.yyyy HH:mm") : "-"
          }}
        </template>
        <template #item.is_active="{ value }">
          <div
            class="d-flex align-center ga-2 font-weight-medium"
            :class="[value ? 'text-success' : 'text-error']"
          >
            <v-icon size="18">mdi-circle</v-icon>
            {{ value ? "Aktif" : "Pasif" }}
          </div>
        </template>
        <template #item.start_date="{ value }">
          {{ value ? $datefns.format(new Date(value), "dd.MM.yyyy") : "-" }}
        </template>
        <template #item.end_date="{ value }">
          {{ value ? $datefns.format(new Date(value), "dd.MM.yyyy") : "-" }}
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

    <ProjectEditDialog ref="editDialog" @saved="refresh" />
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
    title: "Proje Adı",
    value: "name",
  },
  {
    title: "Başlangıç Tarihi",
    value: "start_date",
  },
  {
    title: "Bitiş Tarihi",
    value: "end_date",
  },
  {
    title: "Durum",
    value: "status",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

const { data, status, refresh } = useLazyAsyncData(
  () => client.get("/projects").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

function handleDelete(item) {
  confirm.open({
    title: "Proje Sil",
    description: `Proje silinecek: ${item.name}`,
    onConfirm: () => {
      loadingConfirm.value = true;
      client
        .delete(`/projects/${item.id}`)
        .then(() => {
          $toast.success("Proje başarıyla silindi.");
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
