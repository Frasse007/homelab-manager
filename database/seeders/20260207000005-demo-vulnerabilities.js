'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('vulnerabilities', [
            {
                service_id: 1,
                cve_id: 'CVE-2024-1234',
                title: 'SQL Injection in Nextcloud Contacts',
                description: 'A SQL injection vulnerability was discovered in the Nextcloud Contacts app that could allow authenticated users to execute arbitrary SQL commands.',
                severity: 'High',
                cvss_score: 7.5,
                discovered_date: new Date('2024-01-15'),
                status: 'patched',
                patched_date: new Date('2024-01-20'),
                remediation_notes: 'Updated Nextcloud to version 27.1.5',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                service_id: 2,
                cve_id: 'CVE-2024-5678',
                title: 'Cross-Site Scripting (XSS) in Plex Web',
                description: 'A stored XSS vulnerability in the Plex Web interface could allow attackers to inject malicious scripts.',
                severity: 'Medium',
                cvss_score: 5.4,
                discovered_date: new Date('2024-02-01'),
                status: 'in_progress',
                remediation_notes: 'Patch available, scheduled for maintenance window',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                service_id: 3,
                cve_id: 'CVE-2023-9999',
                title: 'Privilege Escalation in PostgreSQL',
                description: 'A privilege escalation vulnerability in PostgreSQL could allow low-privileged users to gain superuser access.',
                severity: 'Critical',
                cvss_score: 9.8,
                discovered_date: new Date('2024-01-10'),
                status: 'patched',
                patched_date: new Date('2024-01-12'),
                remediation_notes: 'Emergency patch applied, upgraded to PostgreSQL 15.5',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('vulnerabilities', null, {});
    }
};