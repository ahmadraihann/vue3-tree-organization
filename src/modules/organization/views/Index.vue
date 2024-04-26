<script setup lang="ts">
import Input from "../../../components/Input.vue";
import Button from "../../../components/Button.vue";
import Select from "../../../components/Select.vue";
import { ref, watch } from "vue";
import { DataMaster, DataMasterRaw } from "../constant/OrganizationConstant";

const options_data = [
  { text: "NIK", value: "1" },
  { text: "KK", value: "8" },
];

const data = ref<any>({});
const data_model = ref<any>([]);
const horizontal = ref(false);
const collapsable = ref(true);
const onlyOneNode = ref(true);
const cloneNodeDrag = ref(true);
const expandAll = ref(true);
const style = ref({
  background: "#fff",
  color: "#5e6d82",
});
const tree_org = ref<any>(null);
const model = ref({
  select: "",
  input: "",
});
const show_tree = ref(false);

function onMenus({ node, command }: any) {
  console.log("menus", node, command);
}

function onNodeClick(e: any, data: any) {
  console.log("node", e, data);
}

function expandChange() {
  console.log("expand change");
}

function findActions(arr: any) {
  return arr?.map((item: any) => {
    const new_children: any = [];
    item?.children?.forEach((el: any) => {
      const find_item = new_children.find(
        (x: any) => x.id_group === el.id_group
      );
      if (!find_item) {
        new_children.push(el);
      }
    });

    return {
      id: item.id,
      title: item.title,
      label: item.label,
      actions: new_children?.map((element: any) => {
        return {
          id: element.id_group,
          title: element.title_group,
        };
      }),
    };
  });
}

function findElement(obj: any, id: number, id_action: number) {
  if (obj.id === id) {
    return obj.children.filter((item: any) => item.id_group === id_action);
  } else {
    for (let i = 0; i < obj.children.length; i++) {
      const current = obj.children[i];
      if (current.id === id) {
        return current.children.filter(
          (item: any) => item.id_group === id_action
        );
      } else {
        findElement(current, id, id_action);
      }
    }
  }
}

function buttonClick(obj: any, id: number, id_action: number, master: any) {
  if (obj?.id === id) {
    console.log("1");
    if (master.id === id) {
      const filter_children = master.children.filter(
        (item: any) => item.id_group === id_action
      );
      const new_children: any = [];
      filter_children?.forEach((item: any) => {
        new_children.push({
          id: item.id,
          pid: id,
          label: item.title,
          children: [],
        });
      });
      obj.children = [...obj.children, ...new_children];
      const new_model: any = [
        ...data_model.value,
        ...findActions(filter_children),
      ];
      data_model.value = new_model;
    } else {
      for (let i = 0; i < master.children.length; i++) {
        const current = master.children[i];

        if (current.id === id) {
          const filter_children = current.children.filter(
            (item: any) => item.id_group === id_action
          );
          const new_children: any = [];
          filter_children?.forEach((item: any) => {
            new_children.push({
              id: item.id,
              pid: id,
              label: item.title,
              children: [],
            });
          });
          obj.children = [...obj.children, ...new_children];
          const new_model: any = [
            ...data_model.value,
            ...findActions(filter_children),
          ];
          data_model.value = new_model;
        } else {
          buttonClick(obj, id, id_action, current);
        }
      }
    }
  } else {
    console.log("2");
    for (let i = 0; i < obj.children?.length; i++) {
      const current = obj.children[i];

      if (current.id === id) {
        const filter_children: any = [];
        DataMasterRaw.forEach((item: any) => {
          if (item.id_group === id_action) {
            const find_children = DataMasterRaw.filter(
              (element: any) => element.pid === item.id
            );
            filter_children.push({ ...item, children: find_children });
          }
        });

        filter_children?.forEach((item: any) => {
          obj.children[i].children.push({
            id: item.id,
            pid: current.id,
            label: item.title,
            children: [],
          });
        });
        const new_model: any = [
          ...data_model.value,
          ...findActions(filter_children),
        ];
        data_model.value = new_model;
      } else {
        buttonClick(current, id, id_action, master);
      }
    }
  }
}

function getNode(arr: any, id: number) {
  const find_item = arr.find((item: any) => item.id === id);
  if (find_item) {
    return find_item.actions;
  } else {
    return [];
  }
}

function getItem(id: number) {
  const find_index = data_model.value.findIndex((item: any) => item.id === id);
  return data_model.value[find_index]?.label;
}

function handleSearch() {
  if (model.value.input === "" && model.value.select === "") return;
  const find_item = DataMasterRaw.find(
    (item: any) => item.id === parseInt(model.value.select)
  );
  data.value = {
    id: find_item?.id,
    label: find_item?.title,
    children: [],
  };

  const find_children = DataMasterRaw.filter(
    (item: any) => item.pid === find_item?.id
  );
  console.log(find_item, find_children);

  const new_children: any = [];
  find_children.forEach((item: any) => {
    const find_element = new_children.find(
      (element: any) => element.id_group === item.id_group
    );
    if (!find_element) {
      new_children.push(item);
    }
  });

  data_model.value = [
    {
      id: find_item?.id as number,
      title: find_item?.title as string,
      label: model.value.input,
      actions: new_children.map((item: any) => {
        return {
          id: item.id_group,
          title: item.title_group,
        };
      }),
    },
  ];

  show_tree.value = true;
}

watch(
  data_model,
  (value) => {
    console.log("value", value);
  },
  { deep: true }
);

watch(
  data,
  (value) => {
    console.log("value2", value);
  },
  { deep: true }
);
</script>

<template lang="pug">
.org-container
  .org-container--form
    Select(
      id="select"
      v-model="model.select"
      :options="options_data"
    )
    Input(
      id="input"
      v-model="model.input"
    )
    .org-container--form--button 
      Button(text="Search" @click="handleSearch")

  .org-container--tree(v-if="show_tree")
    vue3-tree-org(
      ref="tree_org"
      :data="data"
      :horizontal="horizontal"
      :collapsable="collapsable"
      :label-style="style"
      :node-draggable="true"
      :scalable="false"
      :only-one-node="onlyOneNode"
      :default-expand-level="1"
      :clone-node-drag="cloneNodeDrag"
      @on-contextmenu="onMenus"
      @on-node-click="onNodeClick"
    )
      template(v-slot="{ node }")
        .tree-org-node--wrapper
          .tree-org-node--wrapper--title {{ node.label }}
          .tree-org-node--wrapper--text {{ getItem(node.id, '')}}
          .tree-org-node--wrapper--action
            Button.w-full(
              v-for="(item, key) in getNode(data_model, node.id)" 
              :key="key"
              :text="item.title"
              @click="buttonClick(data, node.id, item.id, DataMaster)"
            )
</template>

<style lang="sass">
.org-container
  @apply flex w-full gap-[50px]
  &--form
    @apply max-w-[400px] w-full flex flex-col gap-2
    &--button
      @apply mt-4 max-w-[100px]
  &--tree
    @apply w-full h-[800px]
    .tree-org-node
      &--wrapper
        @apply p-3 flex flex-col gap-2
        &--title
          @apply font-bold text-xl text-gray-900
        &--text
          @apply font-medium text-base mb-4
        &--action
          @apply flex items-center gap-2
</style>
