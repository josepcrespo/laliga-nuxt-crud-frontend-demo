<template>
  <DatatableCrud
    :datatable-headers="[
      { text: 'Id', value: 'id'},
      { text: 'Name', value: 'name'},
      { text: 'Emblem', value: 'emblem'},
      { text: 'Salary Limit', value: 'salary_limit'}
    ]"
    :editable-props="[
      { text: 'Name', value: 'name', type: 'text', required: true },
      { text: 'Emblem', value: 'emblem', type: 'image', required: false },
      { text: 'Salary Limit', value: 'salary_limit', type: 'number', required: true }
    ]"
    entity="team"
    entity-plural="teams"
    icon="mdi-account-group"
    :remove-props-before-send="['players', 'timestamp']"
  />
</template>

<script>
export default {
  name: 'TeamsPage'
}
</script>
