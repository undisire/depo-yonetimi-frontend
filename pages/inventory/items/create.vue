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
        <h1 class="text-h5 text-md-h4 ps-1">Envanter Ekle</h1>
        <div class="d-flex ga-2 align-center"></div>
      </div>
    </section>

    <v-row>
      <v-col cols="12" md="6">
        <v-form @submit.prevent="submit" novalidate>
          <v-card border flat rounded="lg">
            <v-card-text>
              <MaterialAutocomplete
                label="Malzeme"
                placeholder="Malzeme seçiniz"
                variant="outlined"
                density="comfortable"
                @select="onSelectMaterial"
                v-model="materialId"
                v-bind="materialIdProps"
              />
              <v-select
                label="Depo"
                variant="outlined"
                density="comfortable"
                :items="warehouses"
                :loading="statusWarehouse === 'pending'"
                item-title="name"
                item-value="id"
                v-model="warehouseId"
                v-bind="warehouseIdProps"
              />
              <v-select
                label="Kurum"
                variant="outlined"
                density="comfortable"
                :items="suppliers"
                :loading="statusSupplier === 'pending'"
                item-title="name"
                item-value="id"
                clearable
                v-model="institutionId"
                v-bind="institutionIdProps"
              />
              <v-select
                variant="outlined"
                density="comfortable"
                label="Malzeme Türü"
                :items="itemTypeOptions"
                v-model="itemType"
                v-bind="itemTypeProps"
              />
              <v-text-field
                label="Miktar"
                variant="outlined"
                density="comfortable"
                type="number"
                v-model="quantity"
                v-bind="quantityProps"
              >
                <template #append-inner>
                  {{ materialUom }}
                </template>
              </v-text-field>
              <v-btn
                color="primary"
                flat
                block
                class="text-none"
                size="large"
                @click="submit"
                >Ekle</v-btn
              >
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { object, number } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

const client = useJwtClient();
const $toast = useToast();

const items = [
  {
    title: "Anasayfa",
    disabled: false,
    to: "/dashboard",
  },
  {
    title: "Envanter",
    disabled: false,
    to: "/inventory/items",
  },
  {
    title: "Ekle",
    disabled: true,
  },
];

const itemTypeOptions = [
  { title: "Bütün", value: "whole" },
  { title: "Parça", value: "part" },
];

const uomId = ref(null);
const materialUom = computed(() => {
  const uom = uoms.value.find((x) => x.id === uomId.value);
  return uom ? uom.symbol : "";
});

const { data: warehouses, status: statusWarehouse } = useLazyAsyncData(
  () => client.get("/warehouses").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

const { data: suppliers, status: statusSupplier } = useLazyAsyncData(
  () => client.get("/suppliers").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

const { data: uoms, status: statusUom } = useLazyAsyncData(
  () => client.get("/uoms").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

function onSelectMaterial(material) {
  uomId.value = material?.uom_id || null;
}

const { setErrors, handleSubmit, defineField, resetForm } = useForm({
  initialValues: {
    item_type: "whole",
  },
  validationSchema: toTypedSchema(
    object({
      material_id: number().required("Malzeme zorunludur."),
      warehouse_id: number().required("Depo zorunludur."),
      institution_id: number().nullable(),
      quantity: number().required("Miktar zorunludur."),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [materialId, materialIdProps] = defineField("material_id", vuetifyConfig);
const [warehouseId, warehouseIdProps] = defineField(
  "warehouse_id",
  vuetifyConfig
);
const [institutionId, institutionIdProps] = defineField(
  "institution_id",
  vuetifyConfig
);
const [quantity, quantityProps] = defineField("quantity", vuetifyConfig);
const [itemType, itemTypeProps] = defineField("item_type", vuetifyConfig);

const submit = handleSubmit((values) => {
  client
    .post("/inventory/items", values)
    .then(() => {
      navigateTo("/inventory/items");
      $toast.success("Envanter başarıyla eklendi.");
      resetForm();
    })
    .catch((error) => {
      setErrors(error.response.data.errors);
    });
});
</script>
