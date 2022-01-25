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
      { text: 'Name', value: 'name', type: 'text'},
      { text: 'Birth Date', value: 'birth_date', type: 'date' },
      {
        text: 'Position',
        value: 'position',
        type: 'enum',
        enumArray: ['Portero', 'Defensa', 'Centrocampista', 'Delantero']
      },
      { text: 'Salary', value: 'salary', type: 'number' },
      {
        text: 'Team',
        value: 'team',
        type: 'relation',
        relationValue: 'name',
        relationId: 'id',
        multiple: false,
        mandatory: false
      },
      { text: 'Email', value: 'email', type: 'email' },
    ]"
    entity="player"
    entity-plural="players"
    icon="mdi-account"
    :remove-props-before-send="['timestamp', 'team']"
  />
</template>

<script>
export default {
  name: 'PlayersPage'
}
</script>
