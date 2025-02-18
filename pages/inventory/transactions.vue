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
        <h1 class="text-h5 text-md-h4 ps-1">İşlemler</h1>
      </div>
    </section>

    <v-card border flat rounded="lg">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-length="data.meta.total"
        :headers="headers"
        :items="data.data"
        :loading="status === 'pending'"
        @update:options="execute"
      >
        <template #item.name="{ item }">
          <div>
            {{ item.material.name }}
            <v-chip
              label
              size="x-small"
              class="font-weight-medium ml-1"
              v-if="item.item_type == 'part'"
              >Parça</v-chip
            >
          </div>
          <div class="text-disabled">
            {{ item.material.sap_no }} | {{ item?.warehouse?.name }}
          </div>
        </template>

        <template #item.action="{ value }">
          {{ actionDisplayTexts?.[value] || value }}
        </template>

        <template #item.quantity="{ item }">
          <span
            v-if="item.type == 'in'"
            class="text-success font-weight-medium"
          >
            +{{ item.quantity }} {{ item?.uom?.symbol }}
          </span>
          <span v-else class="text-error font-weight-medium">
            -{{ item.quantity }} {{ item?.uom?.symbol }}
          </span>
        </template>

        <template #item.after_quantity="{ item }">
          {{ item.after_quantity }} {{ item?.uom?.symbol }}
        </template>

        <template #item.note="{ value }">
          <v-tooltip location="bottom center">
            <template #activator="{ props }">
              <v-icon v-if="value" v-bind="props" color="cyan"
                >mdi-comment</v-icon
              >
            </template>
            <span>{{ value }}</span>
          </v-tooltip>
        </template>

        <template #item.created_at="{ item, value }">
          {{ item?.user?.full_name }}
          <div class="text-disabled">
            {{ $datefns.format(new Date(value), "dd.MM.yyyy HH:mm") }}
          </div>
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

const actionDisplayTexts = {
  qty_update: "Miktar Güncellendi",
};

const { data, status, refresh, execute } = useLazyAsyncData(
  () =>
    client
      .get("/inventory/transactions", {
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
    title: "#",
    value: "id",
  },
  {
    title: "Malzeme",
    value: "name",
  },
  {
    title: "İşlem",
    value: "action",
  },
  {
    title: "Miktar",
    value: "quantity",
  },
  {
    title: "Kalan M.",
    value: "after_quantity",
  },
  {
    title: "Not",
    value: "note",
  },
  {
    title: "İşlemi Yapan",
    value: "created_at",
  },
];
</script>
