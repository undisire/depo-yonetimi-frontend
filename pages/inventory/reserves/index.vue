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
        <h1 class="text-h5 text-md-h4 ps-1">Rezervler</h1>
        <div class="d-flex ga-2 align-center">
          <v-btn
            color="primary"
            rounded="lg"
            flat
            prepend-icon="mdi-plus"
            :to="{ name: 'inventory-reserves-create' }"
            >Yeni Ekle</v-btn
          >
        </div>
      </div>
    </section>

    <v-card border flat rounded="lg">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-length="data.meta.total"
        density="comfortable"
        :headers="headers"
        :items="data.data"
        :loading="status === 'pending'"
        @update:options="execute"
      >
        <template #item.quantity="{ item }">
          {{ item.quantity }} {{ item?.uom?.symbol }}
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

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

const client = useJwtClient();

const itemsPerPage = ref(50);
const currentPage = ref(1);

const { data, status, refresh, execute } = useLazyAsyncData(
  () =>
    client
      .get("/inventory/reserves", {
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
        meta: {
          total: 0,
        },
      };
    },
  }
);

const headers = [
  {
    title: "Sap No",
    value: "material.sap_no",
  },
  {
    title: "Malzeme",
    value: "material.name",
  },
  {
    title: "Rezerve Miktarı",
    value: "quantity",
  },
  {
    title: "Rezerve Tarihi",
    value: "created_at",
  },
  {
    title: "Proje",
    value: "project.name",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];
</script>
