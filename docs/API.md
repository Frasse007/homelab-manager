### API Reference
- [Authentication](#authentication-endpoints)
- [Services](#service-endpoints)
- [Maintenance Logs](#maintenance-log-endpoints)
- [Vulnerabilities](#vulnerability-endpoints)
- [SSL Certificates](#ssl-certificate-endpoints)

### Authentication Endpoints

#### Register a new user
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "first_name": "John",
      "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get current user profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### Service Endpoints

#### Get all services
```http
GET /api/services
Authorization: Bearer <token>
```

**Query Parameters:**
- `service_type` (optional): Filter by type (web, database, storage, monitoring, networking, other)
- `status` (optional): Filter by status (running, stopped, error, maintenance)
- `public_facing` (optional): Filter by public facing (true/false)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": 1,
      "service_name": "Nextcloud",
      "service_type": "storage",
      "description": "Self-hosted cloud storage",
      "url": "https://cloud.homelab.local",
      "port": 443,
      "status": "running",
      "public_facing": true,
      "security_score": 85,
      "owner": {
        "id": 1,
        "username": "admin",
        "email": "admin@homelab.local"
      }
    }
  ]
}
```

#### Get service by ID
```http
GET /api/services/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Service retrieved successfully",
  "data": {
    "id": 1,
    "service_name": "Nextcloud",
    "service_type": "storage",
    "description": "Self-hosted cloud storage",
    "url": "https://cloud.homelab.local",
    "port": 443,
    "internal_ip": "192.168.1.100",
    "docker_container_name": "nextcloud",
    "docker_image": "nextcloud:latest",
    "cpu_allocated": 2.0,
    "ram_allocated": 2048,
    "status": "running",
    "uptime_percentage": 99.8,
    "public_facing": true,
    "security_score": 85,
    "vulnerabilities": [],
    "sslCertificates": [],
    "maintenanceLogs": []
  }
}
```

#### Create a new service
```http
POST /api/services
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_name": "Nextcloud",
  "service_type": "storage",
  "description": "Self-hosted cloud storage",
  "url": "https://cloud.homelab.local",
  "port": 443,
  "internal_ip": "192.168.1.100",
  "docker_container_name": "nextcloud",
  "docker_image": "nextcloud:latest",
  "cpu_allocated": 2.0,
  "ram_allocated": 2048,
  "status": "running",
  "public_facing": true,
  "authentication_method": "LDAP",
  "security_score": 85
}
```

**Response:** `201 Created`

#### Update a service
```http
PUT /api/services/:id
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "status": "maintenance",
  "security_score": 90,
  "uptime_percentage": 99.9
}
```

**Response:** `200 OK`

#### Delete a service
```http
DELETE /api/services/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Service deleted successfully",
  "data": null
}
```

#### Get service statistics
```http
GET /api/services/stats
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Service statistics retrieved successfully",
  "data": {
    "total": 10,
    "by_status": {
      "running": 8,
      "stopped": 1,
      "error": 0,
      "maintenance": 1
    },
    "public_facing": 3,
    "private": 7
  }
}
```

---

### Maintenance Log Endpoints

#### Get all maintenance logs
```http
GET /api/maintenance-logs
Authorization: Bearer <token>
```

**Query Parameters:**
- `service_id` (optional): Filter by service
- `maintenance_type` (optional): Filter by type
- `success` (optional): Filter by success status

**Response:** `200 OK`

#### Get maintenance log by ID
```http
GET /api/maintenance-logs/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Create a maintenance log
```http
POST /api/maintenance-logs
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_id": 1,
  "maintenance_date": "2024-02-05T10:00:00Z",
  "maintenance_type": "Security Patch",
  "title": "Applied critical security update",
  "description": "Updated service to patch CVE-2024-1234",
  "downtime_minutes": 10,
  "version_before": "1.0.0",
  "version_after": "1.0.1",
  "success": true,
  "notes": "No issues during update"
}
```

**Response:** `201 Created`

#### Delete a maintenance log
```http
DELETE /api/maintenance-logs/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

---

### Vulnerability Endpoints

#### Get all vulnerabilities
```http
GET /api/vulnerabilities
Authorization: Bearer <token>
```

**Query Parameters:**
- `service_id` (optional): Filter by service
- `severity` (optional): Filter by severity (Critical, High, Medium, Low, Informational)
- `status` (optional): Filter by status (open, in_progress, patched, mitigated, accepted)

**Response:** `200 OK`

#### Get vulnerability by ID
```http
GET /api/vulnerabilities/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Create a vulnerability
```http
POST /api/vulnerabilities
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_id": 1,
  "cve_id": "CVE-2024-1234",
  "title": "SQL Injection Vulnerability",
  "description": "A SQL injection vulnerability was discovered...",
  "severity": "High",
  "cvss_score": 7.5,
  "discovered_date": "2024-02-01T00:00:00Z",
  "status": "open",
  "remediation_notes": "Update to version 1.2.3"
}
```

**Response:** `201 Created`

#### Update a vulnerability
```http
PUT /api/vulnerabilities/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Delete a vulnerability
```http
DELETE /api/vulnerabilities/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Get vulnerability statistics
```http
GET /api/vulnerabilities/stats
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vulnerability statistics retrieved successfully",
  "data": {
    "total": 15,
    "by_severity": {
      "critical": 2,
      "high": 5,
      "medium": 6,
      "low": 2
    },
    "by_status": {
      "open": 8,
      "patched": 7,
      "other": 0
    }
  }
}
```

---

### SSL Certificate Endpoints

#### Get all SSL certificates
```http
GET /api/ssl-certificates
Authorization: Bearer <token>
```

**Query Parameters:**
- `service_id` (optional): Filter by service
- `status` (optional): Filter by status (valid, expiring_soon, expired, revoked)

**Response:** `200 OK`

#### Get certificate by ID
```http
GET /api/ssl-certificates/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Create an SSL certificate
```http
POST /api/ssl-certificates
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_id": 1,
  "domain": "cloud.homelab.local",
  "issuer": "Let's Encrypt",
  "certificate_type": "Let's Encrypt",
  "issue_date": "2024-01-01T00:00:00Z",
  "expiration_date": "2024-04-01T00:00:00Z",
  "status": "valid",
  "auto_renewal_enabled": true
}
```

**Response:** `201 Created`

#### Update an SSL certificate
```http
PUT /api/ssl-certificates/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Delete an SSL certificate
```http
DELETE /api/ssl-certificates/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Get expiring certificates
```http
GET /api/ssl-certificates/expiring
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (optional, default: 30): Number of days to check

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Certificates expiring within 30 days retrieved successfully",
  "data": [
    {
      "id": 1,
      "domain": "cloud.homelab.local",
      "issuer": "Let's Encrypt",
      "expiration_date": "2024-03-15T00:00:00Z",
      "days_until_expiry": 20,
      "status": "expiring_soon"
    }
  ]
}
```