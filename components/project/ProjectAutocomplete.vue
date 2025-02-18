<template>
  <PaginatedAutocomplete
    v-model="selectedRecord"
    :items="records"
    :loading="loading"
    @intersect="loadNextPage"
    @update:search-input="handleSearchInput"
    variant="outlined"
    density="comfortable"
    block
    item-title="name"
    item-subtitle="sap_no"
    item-value="id"
  >
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :subtitle="item.raw.pyp_code"
        :title="item.raw.name"
      ></v-list-item>
    </template>
  </PaginatedAutocomplete>
</template>

<script setup>
import PaginatedAutocomplete from "@/components/common/PaginatedAutocomplete.vue";

const emit = defineEmits(["select"]);

const client = useJwtClient();

const records = ref([]);
const loading = ref(false);
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 100,
});

function loadRecords() {
  loading.value = true;

  const params = {
    page: pagination.value.page,
    limit: pagination.value.perPage,
    search: query.value,
  };

  client
    .get("/projects", { params })
    .then(({ data }) => {
      if (pagination.value.page === 1) {
        records.value = data.data;
        pagination.value.total = data.meta.total;
      } else {
        records.value = [...records.value, ...data.data];
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function loadNextPage() {
  if (
    pagination.value.page * pagination.value.perPage >=
    pagination.value.total
  ) {
    return;
  }

  pagination.value.page++;

  loadRecords();
}

const query = ref(null);

function handleSearchInput(value) {
  if (selectedRecord.value === value) {
    return;
  }

  query.value = value;

  pagination.value = Object.assign({}, { page: 1, perPage: 10, total: 100 });

  loadRecords();
}

const selectedRecord = ref(null);

watch(selectedRecord, (value) => {
  emit(
    "select",
    records.value.find((x) => x.id === value)
  );
});

onMounted(() => {
  loadRecords();
});
</script>

<style></style>
