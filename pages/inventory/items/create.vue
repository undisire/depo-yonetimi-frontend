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
                :items="institutions"
                :loading="statusInstitution === 'pending'"
                item-title="name"
                item-value="id"
                clearable
                v-model="institutionId"
                v-bind="institutionIdProps"
              />
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Miktar"
                    variant="outlined"
                    density="comfortable"
                    type="number"
                    v-model="quantity"
                    v-bind="quantityProps"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    label="Birim"
                    variant="outlined"
                    density="comfortable"
                    :items="uoms"
                    :loading="statusUom === 'pending'"
                    item-title="name"
                    item-value="id"
                    v-model="uomId"
                    v-bind="uomIdProps"
                  />
                </v-col>
              </v-row>
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

const { data: warehouses, status: statusWarehouse } = useLazyAsyncData(
  () => client.get("/warehouses").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

const { data: institutions, status: statusInstitution } = useLazyAsyncData(
  () => client.get("/institutions").then((x) => x.data),
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

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {},
  validationSchema: toTypedSchema(
    object({
      material_id: number().required("Malzeme zorunludur."),
      warehouse_id: number().required("Depo zorunludur."),
      institution_id: number().nullable(),
      quantity: number().required("Miktar zorunludur."),
      uom_id: number().required("Birim zorunludur."),
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
const [uomId, uomIdProps] = defineField("uom_id", vuetifyConfig);

const submit = handleSubmit((values) => {
  console.log(values);
  client
    .post("/inventory", values)
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
