'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add bio and profile_completion_pct columns
    await queryInterface.addColumn('doctors', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('doctors', 'profile_completion_pct', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    });

    // 2. Change languages column to JSON
    // Rename existing column first to avoid type collision during migration
    await queryInterface.renameColumn('doctors', 'languages', 'languages_old');
    
    // Add new languages column of type JSON
    await queryInterface.addColumn('doctors', 'languages', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Migrate existing string list data to JSON array format
    const [doctors] = await queryInterface.sequelize.query('SELECT id, languages_old FROM doctors');
    for (const doc of doctors) {
      let languagesArray = [];
      if (doc.languages_old) {
        languagesArray = doc.languages_old.split(',').map(s => s.trim()).filter(Boolean);
      }
      const jsonStr = JSON.stringify(languagesArray);
      await queryInterface.sequelize.query(
        'UPDATE doctors SET languages = :languages WHERE id = :id',
        {
          replacements: { languages: jsonStr, id: doc.id }
        }
      );
    }

    // Drop the old VARCHAR column
    await queryInterface.removeColumn('doctors', 'languages_old');
  },

  async down(queryInterface, Sequelize) {
    // Revert columns
    await queryInterface.removeColumn('doctors', 'bio');
    await queryInterface.removeColumn('doctors', 'profile_completion_pct');

    // Revert languages to VARCHAR(255)
    await queryInterface.renameColumn('doctors', 'languages', 'languages_json');
    await queryInterface.addColumn('doctors', 'languages', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    const [doctors] = await queryInterface.sequelize.query('SELECT id, languages_json FROM doctors');
    for (const doc of doctors) {
      let languagesStr = null;
      if (doc.languages_json) {
        try {
          const arr = typeof doc.languages_json === 'string' ? JSON.parse(doc.languages_json) : doc.languages_json;
          if (Array.isArray(arr)) {
            languagesStr = arr.join(', ');
          }
        } catch (e) {
          // ignore
        }
      }
      await queryInterface.sequelize.query(
        'UPDATE doctors SET languages = :languages WHERE id = :id',
        {
          replacements: { languages: languagesStr, id: doc.id }
        }
      );
    }

    await queryInterface.removeColumn('doctors', 'languages_json');
  }
};
