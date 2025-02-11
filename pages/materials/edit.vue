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
        <h1 class="text-h5 text-md-h4 ps-1">{{ pageTitle }}</h1>
        <div class="d-flex ga-2 align-center"></div>
      </div>
    </section>

    <v-form @submit="submit" novalidate>
      <v-row>
        <v-col cols="12" md="6">
          <v-card border flat rounded="lg">
            <v-card-text>
              <v-text-field
                variant="outlined"
                density="comfortable"
                label="SAP No"
                v-model="sapNo"
                v-bind="sapNoProps"
              ></v-text-field>
              <v-text-field
                variant="outlined"
                density="comfortable"
                label="Malzeme Adı"
                v-model="name"
                v-bind="nameProps"
              ></v-text-field>
              <v-select
                variant="outlined"
                density="comfortable"
                label="Birim"
                :loading="statusUom === 'pending'"
                :items="uoms"
                item-title="name"
                item-value="id"
                v-model="uom"
                v-bind="uomProps"
              ></v-select>
              <v-textarea
                variant="outlined"
                density="comfortable"
                label="Açıklama"
                v-model="description"
                v-bind="descriptionProps"
              ></v-textarea>
            </v-card-text>
          </v-card>

          <div class="d-flex flex-column ga-3">
            <div class="d-flex justify-space-between align-center mt-8">
              <h3 class="text-h5 font-weight-semibold">Öznitelikler</h3>
              <div></div>
            </div>
            <v-card
              v-for="(attr, idx) in fields"
              :key="attr.key"
              border
              rounded="lg"
              flat
            >
              <v-card-title class="d-flex align-center">
                <h4 class="text-body-1 font-weight-medium">
                  {{ idx + 1 }}. Öznitelik
                </h4>
                <v-spacer />
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  flat
                  variant="text"
                  color="error"
                  @click="remove(idx)"
                />
              </v-card-title>
              <v-card-text>
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  label="Öznitelik Adı"
                  v-model="attr.value.name"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  label="Öznitelik Değeri"
                  v-model="attr.value.value"
                  hide-details
                ></v-text-field>
              </v-card-text>
            </v-card>
            <v-btn
              block
              variant="tonal"
              prepend-icon="mdi-plus"
              class="mt-4"
              color="primary"
              rounded="lg"
              @click="addAttribute"
              >Yeni Ekle</v-btn
            >
          </div>
          <v-btn
            block
            flat
            color="primary"
            rounded="lg"
            class="mt-4"
            type="submit"
            >Kaydet</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { object, string, number } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

const { id } = useRoute()?.query;
const client = useJwtClient();
const $toast = useToast();

const items = [
  {
    title: "Anasayfa",
    disabled: false,
    to: "/dashboard",
  },
  {
    title: "Malzemeler",
    disabled: false,
    to: "/materials",
  },
  {
    title: id ? "Düzenle" : "Ekle",
    disabled: true,
  },
];

const pageTitle = id ? "Malzeme Düzenle" : "Malzeme Ekle";

const { data: uoms, status: statusUom } = useLazyAsyncData(
  () => client.get("/uoms").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    uom_id: 1,
    attributes: [],
  },
  validationSchema: toTypedSchema(
    object({
      sap_no: string().required("SAP No zorunludur."),
      name: string().required("Malzeme adı zorunludur."),
      uom_id: number().required("Birim zorunludur."),
      description: string().nullable(),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [name, nameProps] = defineField("name", vuetifyConfig);
const [uom, uomProps] = defineField("uom_id", vuetifyConfig);
const [description, descriptionProps] = defineField(
  "description",
  vuetifyConfig
);
const [sapNo, sapNoProps] = defineField("sap_no", vuetifyConfig);
const { remove, push, fields } = useFieldArray("attributes", vuetifyConfig);

function addAttribute() {
  push({
    name: "",
    value: "",
  });
}

const submit = handleSubmit((values) => {
  client({
    url: id ? `/materials/${id}` : "/materials",
    method: id ? "put" : "post",
    data: values,
  })
    .then(() => {
      if (id) {
        $toast.success("Malzeme başarıyla güncellendi.");
      } else {
        $toast.success("Malzeme başarıyla eklendi.");
      }

      navigateTo("/materials");
    })
    .catch((err) => {
      $toast.error("Malzeme eklenirken bir hata oluştu.");
      // setErrors(err.response.data.errors);
    });
});

function loadData() {
  if (id) {
    client.get(`/materials/${id}`).then((res) => {
      const data = res.data.data;
      setValues({
        sap_no: data.sap_no,
        name: data.name,
        uom_id: data.uom_id,
        description: data.description,
      });

      data.attributes.forEach((attr) => {
        push({
          name: attr.name,
          value: attr.value,
        });
      });
    });
  }
}

await loadData();
</script>
