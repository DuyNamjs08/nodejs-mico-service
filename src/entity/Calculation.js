const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Calculation',
  tableName: 'Calculation',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    number: {
      type: 'bigint',
    },
    result: {
      type: 'bigint',
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});
