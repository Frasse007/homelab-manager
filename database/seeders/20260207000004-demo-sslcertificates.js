'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('ssl_certificates', [
            {
                service_id: 1,
                domain: 'cloud.homelab.local',
                issuer: "Let's Encrypt",
                certificate_type: "Let's Encrypt",
                issue_date: new Date('2024-01-01'),
                expiration_date: new Date('2024-04-01'),
                status: 'valid',
                auto_renewal_enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                service_id: 2,
                domain: 'plex.homelab.local',
                issuer: "Let's Encrypt",
                certificate_type: "Let's Encrypt",
                issue_date: new Date('2024-01-15'),
                expiration_date: new Date('2024-04-15'),
                status: 'valid',
                auto_renewal_enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                service_id: 4,
                domain: 'grafana.homelab.local',
                issuer: 'Self-Signed',
                certificate_type: 'Self-Signed',
                issue_date: new Date('2023-12-01'),
                expiration_date: new Date('2024-02-15'),
                status: 'expiring_soon',
                auto_renewal_enabled: false,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ssl_certificates', null, {});
    }
};
    