<template>
  <VDrilldownTable
    :headers="headers.material"
    :density="tableSettings.density"
    :items="tableSettings.items"
    :items-length="tableSettings.itemsLength"
    :items-per-page="tableSettings.itemsPerPage"
    :items-per-page-text="tableSettings.itemsPerPageText"
    :item-selectable="tableSettings.itemSelectable"
    :item-children-key="tableSettings.itemChildrenKey"
    :loading="tableSettings.loading"
    :loading-text="tableSettings.loadingText"
    :page="tableSettings.page"
    :page-text="tableSettings.pageText"
    :search="tableSettings.search"
    :search-debounce="tableSettings.searchDebounce"
    :search-max-wait="tableSettings.searchMaxWait"
    :expand-on-click="tableSettings.expandOnClick"
    :show-expand="tableSettings.showExpand"
    :show-search="tableSettings.showSearch"
    :show-select="tableSettings.showSelect"
    :level="tableSettings.level"
    :levels="tableSettings.levels"
    @update:drilldown="fetchServerData($event)"
  >
    <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <VBtn
            class="me-2 my-1"
            :icon="isGroupOpen(item) ? '$expand' : '$next'"
            size="x-small"
            variant="tonal"
            @click="toggleGroup(item)"
          >
          </VBtn>
          {{ item.value }}
        </td>
      </tr>
    </template>
    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        :to="{ name: 'materials-edit', query: { id: item.id } }"
        color="primary"
        size="x-small"
        variant="text"
        class="mr-2"
      />
      <v-btn icon="mdi-delete" color="error" size="x-small" variant="text" />
    </template>
  </VDrilldownTable>
</template>

<script setup>
import { VDrilldownTable } from "@wdns/vuetify-drilldown-table";

const client = useJwtClient();

const tableSettings = ref({
  // Defaults
  colorPercentageChange: 15,
  colorPercentageDirection: "desc",
  density: "default",
  drilldownKey: "id",
  elevation: 5,
  expandOnClick: false,
  firstIcon: "$first",
  fixedHeader: false,
  footers: [],
  headers: [],
  height: "auto",
  hideDrilldownWhenLoading: true,
  hideNoData: false,
  hover: false,
  itemChildrenKey: "child",
  itemSelectable: undefined,
  itemValue: "id",
  items: [],
  itemsLength: 0,
  itemsPerPage: 5,
  itemsPerPageOptions: [
    {
      title: "5",
      value: 5,
    },
    {
      title: "10",
      value: 10,
    },
    {
      title: "25",
      value: 25,
    },
    {
      title: "50",
      value: 50,
    },
    {
      title: "100",
      value: 100,
    },
    {
      title: "$vuetify.dataFooter.itemsPerPageAll",
      value: -1,
    },
  ],
  itemsPerPageText: "$vuetify.dataFooter.itemsPerPageText",
  lastIcon: "$last",
  level: 1,
  levels: 3,
  loaderProps: {
    circular: {
      bgColor: "theme-surface",
      color: "primary",
      indeterminate: true,
    },
    linear: {
      color: "surface-variant",
      height: "2px",
      indeterminate: true,
    },
    skelton: {
      type: "heading@1",
    },
    text: {
      color: "surface-variant",
    },
  },
  loaderType: ["linear"],
  loading: false,
  loadingText: "Loading",
  matchColumnWidths: false,
  mobile: false,
  multiSort: false,
  mustSort: false,
  nextIcon: "$next",
  noDataText: "$vuetify.noDataText",
  page: 1,
  pageText: "$vuetify.dataFooter.pageText",
  prevIcon: "$prev",
  search: "",
  searchContainerCols: {
    lg: 3,
    md: 6,
    sm: 12,
    xl: 3,
    xs: 12,
    xxl: 2,
  },
  searchDebounce: 0,
  searchMaxWait: 1000,
  searchProps: {
    clearable: true,
    color: "primary",
    density: "compact",
    prependInnerIcon: "mdi mdi-magnify",
    variant: "underlined",
  },
  selectStrategy: "page",
  separator: "horizontal",
  server: false,
  showCurrentPage: false,
  showDrilldownWhenLoading: true,
  showExpand: false,
  showFooterRow: true,
  showSearch: true,
  showSelect: true,
  sortAscIcon: "$sortAsc",
  sortBy: [],
  tag: "div",
  theme: undefined,

  // Custom
  // showExpand: true,
  // expandOnClick: true,
  ...{
    density: "comfortable",
    itemSelectable: false,
    showSelect: false,
    showSearch: false,
    searchDebounce: 750,
    server: true,
  },
});

console.log(tableSettings);

const headers = ref({
  material: [
    // {
    //   key: "data-table-select",
    //   title: "",
    // },
    {
      title: "Sap No",
      key: "sap_no",
    },
    {
      title: "Malzeme",
      key: "name",
    },
    {
      title: "Birim",
      key: "uom.name",
    },
    {
      title: "Toplam Stok",
      key: "total_stock",
    },
    {
      title: "İşlemler",
      key: "actions",
      align: "end",
    },
    {
      key: "data-table-expand",
      sortable: false,
      title: "",
    },
  ],
  inventory: [
    {
      title: "Depo",
      value: "warehouse.name",
    },
    {
      title: "Kurum",
      value: "institution.name",
    },
    {
      title: "Miktar",
      value: "quantity",
    },
    {
      title: "Rezerv Edilen",
      value: "reserved_quantity",
    },
    {
      title: "İşlemler",
      value: "actions",
      align: "end",
    },
  ],
});
const defaultSortBy = [
  {
    key: "id",
    order: "asc",
  },
];

function fetchServerData(drilldown = null, updateCurrentLevel = false) {
  if (drilldown === null || (updateCurrentLevel && drilldown.level === 1)) {
    getMaterials(drilldown ?? tableSettings.value);
    return;
  }

  if (drilldown?.level === 1 || (updateCurrentLevel && drilldown.level === 2)) {
    getInventory(drilldown, updateCurrentLevel);
    return;
  }
}

function getMaterials(drilldown = null) {
  tableSettings.value = {
    ...tableSettings.value,
    ...drilldown,
  };

  tableSettings.value.loading = true;

  const params = {
    limit: drilldown.itemsPerPage,
    page: drilldown.page,
    query: drilldown.search,
    sortBy: drilldown.sortBy?.length ? drilldown.sortBy : defaultSortBy,
  };

  client
    .get("/materials", { params })
    .then((x) => x.data)
    .then(({ data, meta }) => {
      tableSettings.value = Object.assign(
        {},
        {
          ...drilldown,
          ...{
            items: data,
            itemsLength: meta.total,
            loading: false,
            page: meta.page,
          },
        }
      );

      tableSettings.value.loading = false;
      return data;
    });
}

function getInventory(drilldown = null, updateCurrentLevel = false) {
  const item = drilldown?.item ?? null;

  const materialId = item.id;
  const material = tableSettings.value.items.find(
    (a) => parseInt(a.id) === parseInt(materialId)
  );

  material.child = drilldown?.drilldown ?? {};
  material.child = Object.assign(
    {},
    {
      ...material.child,
      ...{
        drilldownKey: "id",
        headers: headers.value.inventory,
        itemsLength: drilldown?.itemsLength ?? 0,
        itemsPerPage: drilldown?.itemsPerPage ?? 0,
        level: 2,
        loading: true,
        showSearch: false,
        server: true,
        sortBy: [],
      },
    }
  );

  if (updateCurrentLevel) {
    material.child.items = drilldown.items;
    material.child.sortBy = drilldown.sortBy;
  }

  const params = {
    limit: drilldown.itemsPerPage,
    page: drilldown.page,
    query: drilldown.search,
  };

  client
    .get(`/materials/${materialId}/inventory-items`, { params })
    .then((x) => x.data)
    .then(({ data, meta }) => {
      material.child = {
        ...material.child,
        ...{
          items: data,
          itemsLength: meta.itemsLength,
          itemsPerPage: material.child.server
            ? meta.limit
            : tableDefaults.itemsPerPage,
          loading: false,
          page: meta.page,
        },
      };
    });
}

onMounted(() => {
  fetchServerData();
});
</script>
