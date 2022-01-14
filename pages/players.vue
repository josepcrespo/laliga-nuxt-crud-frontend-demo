<template>
  <DatatableCrud
    :datatable-headers="[
      { text: 'Id', value: 'id', type: 'number' },
      { text: 'Name', value: 'name', type: 'text'},
      { text: 'Birth Date', value: 'birth_date', type: 'date' },
      { text: 'Position', value: 'position', type: 'enum', enumArray: ['Portero', 'Defensa', 'Centrocampista', 'Delantero'] },
      { text: 'Salary', value: 'salary', type: 'number' },
      { text: 'Team', value: 'team', type: 'relation', relationValue: 'name', relationForeignKey: 'team_id', multiple: false, mandatory: false }
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
