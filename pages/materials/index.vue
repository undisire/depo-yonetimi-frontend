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
        <h1 class="text-h5 text-md-h4 ps-1">Malzemeler</h1>
        <div class="d-flex ga-2 align-center">
          <v-btn
            color="primary"
            rounded="lg"
            flat
            :to="{ name: 'materials-edit' }"
            prepend-icon="mdi-plus"
            >Yeni Ekle</v-btn
          >
        </div>
      </div>
    </section>

    <v-card border flat rounded="lg">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-length="data.pagination.total"
        density="comfortable"
        :headers="headers"
        :items="data.data"
        :loading="status === 'loading'"
        @update:options="execute"
      >
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            :to="{ name: 'materials-edit', query: { id: item.id } }"
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
      </v-data-table-server>
    </v-card>
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
const itemsPerPage = ref(50);
const currentPage = ref(1);

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
    title: "Kod",
    value: "code",
  },
  {
    title: "Malzeme",
    value: "name",
  },
  {
    title: "Birim",
    value: "uom.name",
  },
  {
    title: "Toplam Stok",
    value: "total_stock",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

const { data, status, refresh, execute } = useLazyAsyncData(
  () =>
    client
      .get("/materials", {
        params: {
          page: currentPage.value,
          limit: itemsPerPage.value,
        },
      })
      .then((x) => x.data),
  {
    immediate: false,
    default: () => {
      return {
        data: [],
        pagination: {
          total: 0,
        },
      };
    },
  }
);

function handleDelete(item) {
  confirm.open({
    title: "Malzeme Sil",
    description: `Malzeme silinecek: ${item.name}`,
    onConfirm: () => {
      loadingConfirm.value = true;
      client
        .delete(`/materials/${item.id}`)
        .then(() => {
          $toast.success("Malzeme başarıyla silindi.");
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
