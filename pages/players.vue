<template>
  <DatatableCrud
    :datatable-headers="[
      { text: 'Id', value: 'id'},
      { text: 'Name', value: 'name'},
      { text: 'Position', value: 'position'},
      { text: 'Salary', value: 'salary'},
      {
        text: 'Team',
        value: 'team',
        relationValue: 'name'
      }
    ]"
    :editable-props="[
      { text: 'Name', value: 'name', type: 'text', required: true },
      { text: 'Birth Date', value: 'birth_date', type: 'date', required: true },
      {
        text: 'Position',
        value: 'position',
        type: 'enum',
        enumArray: ['Portero', 'Defensa', 'Centrocampista', 'Delantero'],
        required: true
      },
      { text: 'Salary', value: 'salary', type: 'number', required: false },
      {
        text: 'Team',
        value: 'team',
        type: 'relation',
        relationValue: 'name',
        relationId: 'id',
        multiple: false,
        required: false
      },
      { text: 'Email', value: 'email', type: 'email', required: true },
    ]"
    entity="player"
    entity-plural="players"
    icon="mdi-account"
    :remove-props-before-send="['timestamp']"
  />
</template>

<script>
export default {
  name: 'PlayersPage'
}
</script>
