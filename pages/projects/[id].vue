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
        <h1 class="text-h5 text-md-h4 ps-1">{{ data?.name }}</h1>
      </div>
    </section>

    <v-row>
      <v-col cols="12" sm="5" md="4">
        <v-card rounded="lg" border flat>
          <v-card-title class="text-h6">Proje Bilgileri</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12"><b>Pyp No</b></v-col>
              <v-col cols="12">{{ data.pyp_code || "-" }}</v-col>
              <v-col cols="12"><b>Başlangıç Tarihi</b></v-col>
              <v-col cols="12">{{
                data.start_date
                  ? $datefns.format(new Date(data.start_date), "dd.MM.yyyy")
                  : "-"
              }}</v-col>
              <v-col cols="12"><b>Bitiş Tarihi</b></v-col>
              <v-col cols="12">{{
                data.end_date
                  ? $datefns.format(new Date(data.end_date), "dd.MM.yyyy")
                  : "-"
              }}</v-col>
              <v-col cols="12"><b>Oluşturulma Tarihi</b></v-col>
              <v-col cols="12">{{
                data.created_at
                  ? $datefns.format(
                      new Date(data.created_at),
                      "dd.MM.yyyy HH:mm"
                    )
                  : "-"
              }}</v-col>
              <v-col cols="12"><b>Durum</b></v-col>
              <v-col cols="12">{{ data.status }}</v-col>
              <v-col cols="12"><b>Çalışan Sayısı</b></v-col>
              <v-col cols="12">{{ data.employees_count || "-" }}</v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { id } = useRoute()?.params;
const client = useJwtClient();

const { data } = await useAsyncData(
  () => client.get(`/projects/${id}`).then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => ({
      name: null,
      status: null,
      engineer_count: 0,
      contractor_count: 0,
    }),
  }
);

const items = [
  {
    title: "Anasayfa",
    disabled: false,
    to: "/dashboard",
  },
  {
    title: "Projeler",
    to: "/projects",
  },
  {
    title: "Görüntüle",
    disabled: true,
  },
];
</script>
