'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('maintenance_logs', [
        {
            service_id: 1,
            performed_by_user_id: 1,
            maintenance_date: new Date('2024-01-20'),
            maintenance_type: 'Security Patch',
            title: 'Applied security update to Nextcloud',
            description: 'Updated Nextcloud from 27.1.4 to 27.1.5 to patch CVE-2024-1234',
            downtime_minutes: 10,
            version_before: '27.1.4',
            version_after: '27.1.5',
            success: true,
            notes: 'No issues during update, all users notified',
            created_at: new Date('2024-01-20')
        },
        {
            service_id: 2,
            performed_by_user_id: 1,
            maintenance_date: new Date('2024-01-25'),
            maintenance_type: 'Restart',
            title: 'Restarted Plex after performance issues',
            description: 'Server was experiencing high memory usage and slow response times. Restart resolved the issue.',
            downtime_minutes: 2,
            success: true,
            notes: 'Memory leak suspected, monitoring for recurrence',
            created_at: new Date('2024-01-25')
        },
        {
            service_id: 3,
            performed_by_user_id: 2,
            maintenance_date: new Date('2024-01-12'),
            maintenance_type: 'Security Patch',
            title: 'Emergency PostgreSQL security update',
            description: 'Applied critical security patch for CVE-2023-9999 privilege escalation vulnerability',
            downtime_minutes: 15,
            version_before: '15.4',
            version_after: '15.5',
            success: true,
            notes: 'High priority patch, applied outside maintenance window with approval',
            created_at: new Date('2024-01-12')
        },
        {
            service_id: 4,
            performed_by_user_id: 2,
            maintenance_date: new Date('2024-02-01'),
            maintenance_type: 'Backup',
            title: 'Grafana configuration backup',
            description: 'Regular backup of Grafana dashboards and data sources',
            downtime_minutes: 0,
            success: true,
            notes: 'Backup stored in NAS, verified integrity',
            created_at: new Date('2024-02-01')
        }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('maintenance_logs', null, {});
    }
};