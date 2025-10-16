# API Reference

Complete documentation of all REST API endpoints used by the Demo System application.

## Base Configuration

**Base URL:** `https://jdwebapi01.dominiondiagnostics.com/`

**Authentication:** Bearer token in `Authorization` header

**Response Format:**
```json
{
  "success": true,
  "data": { },      // Returned when success === true
  "error": "..."    // Returned when success === false
}
```

---

## Authentication

### Get Authentication Token

**Endpoint:** `GET /user/token`

**Query Parameters:**
- `username` (string, required) - User's username
- `password` (string, required) - User's password

**Request:**
```
GET /user/token?username=jdewar&password=123connect?
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 123,
    "username": "jdewar"
  }
}
```

**Used By:** `user.service.ts:login()`

---

## Order Management

### View Single Order

**Endpoint:** `GET /demo/order/view/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "accessionId": "DS2024001",
    "sampleId": "SAMPL001",
    "created": "2024-01-15T10:30:00Z",
    "status": "Received",
    "location": { "id": 1, "name": "Main Lab" },
    "doctor": { "id": 10, "name": "Dr. Smith" },
    "patient": {
      "id": 50,
      "name": "John Doe",
      "dob": "1980-05-20"
    },
    "orderSet": { "id": 5, "name": "Standard Panel" },
    "medSet": { "id": 3, "name": "CARD Medications" }
  }
}
```

**Used By:** `order.service.ts:view()`

---

### Get Order Events

**Endpoint:** `GET /demo/order/events/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderId": 123,
      "event": "Order Created",
      "timestamp": "2024-01-15T10:30:00Z",
      "user": "jdewar"
    },
    {
      "id": 2,
      "orderId": 123,
      "event": "Sent to Copia",
      "timestamp": "2024-01-15T10:35:00Z",
      "user": "system"
    }
  ]
}
```

**Used By:** `order.service.ts:events()`

---

### Update Order Status

**Endpoint:** `GET /demo/order/update/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Description:** Refreshes order status and retrieves latest results from LIS

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "Completed",
    "resultsAvailable": true
  }
}
```

**Used By:** `order.service.ts:update()`

---

### Get Order Medications

**Endpoint:** `GET /demo/order/meds/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "name": "Alprazolam",
      "type": "Generic",
      "source": "Prescription",
      "template": "CARDSR"
    },
    {
      "id": 78,
      "name": "Xanax",
      "type": "Brand",
      "source": "Prescription",
      "template": "CARDRX"
    }
  ]
}
```

**Used By:** `order.service.ts:getMeds()`

---

### Get Order Tests

**Endpoint:** `GET /demo/order/tests/{orderSetId}`

**Parameters:**
- `orderSetId` (number) - Order set ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "80307",
      "name": "Drug Screen",
      "type": "Panel"
    },
    {
      "id": 2,
      "code": "G0480",
      "name": "Confirmation",
      "type": "Test"
    }
  ]
}
```

**Used By:** `order.service.ts:getTests()`

---

### Search Orders

**Endpoint:** `POST /demo/order/search/{page}`

**Parameters:**
- `page` (number) - Page number (1-indexed)

**Request Body:**
```json
{
  "query": "DS2024",
  "status": "Received",
  "patientId": null,
  "doctorId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [ /* array of orders */ ],
    "total": 150,
    "page": 1,
    "perPage": 5
  }
}
```

**Used By:** `order.service.ts:search()`

---

### Search Orders by Date Range

**Endpoint:** `POST /demo/order/searchDateRange/{page}`

**Parameters:**
- `page` (number) - Page number

**Request Body:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "status": "Completed"
}
```

**Response:** Same format as search orders

**Used By:** `order.service.ts:searchDateRange()`

---

## Order Actions

### Create New Order

**Endpoint:** `POST /demo/actions/create`

**Request Body:**
```json
{
  "location_id": 1,
  "doctor_id": 10,
  "patient_id": 50,
  "order_set_id": 5,
  "med_set_id": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 124,
    "accessionId": "DS2024002",
    "created": "2024-01-15T11:00:00Z"
  }
}
```

**Used By:** `order.service.ts:create()`

---

### Send Order to Copia

**Endpoint:** `GET /demo/actions/sendToCopia/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Description:** Sends order to Copia system for processing

**Response:**
```json
{
  "success": true,
  "data": {
    "copiaOrderId": "COP-2024-001",
    "status": "Sent"
  }
}
```

**Used By:** `order.service.ts:sendToCopia()`

---

### Release Order to LIS

**Endpoint:** `GET /demo/actions/release/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Description:** Sends order to Laboratory Information System

**Response:**
```json
{
  "success": true,
  "data": {
    "lisOrderId": "LIS-2024-001",
    "status": "Released"
  }
}
```

**Used By:** `order.service.ts:release()`

---

### Send Results to LIS

**Endpoint:** `GET /demo/actions/result/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Description:** Sends order results back to LIS

**Response:**
```json
{
  "success": true,
  "data": {
    "resultsSubmitted": true,
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

**Used By:** `order.service.ts:result()`

---

### Send Medications

**Endpoint:** `GET /demo/actions/sendMeds/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Description:** Sends medication list for order

**Used By:** `order.service.ts:sendMeds()`

---

### Save Medications with Source

**Endpoint:** `POST /demo/actions/saveMeds/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Request Body:**
```json
{
  "medications": [
    {
      "id": 45,
      "source": "Prescription"
    },
    {
      "id": 78,
      "source": "SelfReported"
    }
  ]
}
```

**Used By:** `order.service.ts:saveMeds()`

---

### Submit Missing Results

**Endpoint:** `POST /demo/actions/result/{orderId}[/1]`

**Parameters:**
- `orderId` (number) - Order ID
- Optional: `/1` flag for specific result submission

**Request Body:**
```json
{
  "results": [
    {
      "testCode": "80307",
      "value": "Positive",
      "units": "N/A"
    }
  ]
}
```

**Used By:** `order.service.ts:missing()`

---

### Full Order Process

**Endpoint:** `GET /demo/process/{orderId}`

**Parameters:**
- `orderId` (number) - Order ID

**Description:** Runs complete order workflow (Copia → LIS → Results)

**Response:**
```json
{
  "success": true,
  "data": {
    "stepsCompleted": [
      "Sent to Copia",
      "Released to LIS",
      "Results Received",
      "Results Sent to LIS"
    ]
  }
}
```

**Used By:** `order.service.ts:process()`

---

## Search Endpoints

### Search Patients

**Endpoint:** `POST /demo/search/patients/{page}`

**Parameters:**
- `page` (number) - Page number

**Request Body:**
```json
{
  "query": "john doe",
  "dob": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 50,
        "name": "John Doe",
        "dob": "1980-05-20"
      }
    ],
    "total": 1,
    "page": 1
  }
}
```

**Used By:** `order.service.ts:searchPatients()`

---

### Search Doctors

**Endpoint:** `POST /demo/search/doctors/{page}`

**Request Body:**
```json
{
  "query": "smith"
}
```

**Used By:** `order.service.ts:searchDoctors()`

---

### Search Locations

**Endpoint:** `POST /demo/search/locations/{page}`

**Request Body:**
```json
{
  "query": "main lab"
}
```

**Used By:** `order.service.ts:searchLocations()`

---

### Search Order Sets

**Endpoint:** `POST /demo/search/orderSets/{page}`

**Request Body:**
```json
{
  "query": "standard"
}
```

**Used By:** `order.service.ts:searchOrderSets()`

---

### Generic Search

**Endpoint:** `POST /demo/search/{name}s/{page}`

**Parameters:**
- `name` (string) - Entity type (patient, doctor, location, etc.)
- `page` (number) - Page number

**Request Body:**
```json
{
  "query": "search term"
}
```

**Used By:** Multiple services for generic searching

---

## Admin - Order Sets

### View Order Set

**Endpoint:** `GET /demo/orderSets/view/{orderSetId}`

**Parameters:**
- `orderSetId` (number) - Order set ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Standard Panel",
    "panels": [
      {
        "id": 1,
        "code": "80307",
        "name": "Drug Screen"
      }
    ],
    "tdPanels": [ /* TD test panels */ ],
    "results": [ /* Associated results */ ]
  }
}
```

**Used By:** `admin.service.ts:getOrderSet()`

---

### Save Order Set Panels

**Endpoint:** `POST /demo/orderSets/savePanels`

**Request Body:**
```json
{
  "orderSetId": 5,
  "panels": [
    { "id": 1, "code": "80307" },
    { "id": 2, "code": "G0480" }
  ]
}
```

**Used By:** `admin.service.ts:saveOrderSetPanels()`

---

### Delete Order Set

**Endpoint:** `GET /demo/orderSets/delete/{id}`

**Parameters:**
- `id` (number) - Order set ID

**Used By:** `admin.service.ts:deleteOrderSet()`

---

### Get Profile Tests

**Endpoint:** `GET /demo/orderSets/getProfileTests/{testId}`

**Parameters:**
- `testId` (number) - Test/profile ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "code": "TEST001",
      "name": "Component Test 1"
    }
  ]
}
```

**Used By:** `admin.service.ts:getProfileTests()`

---

### Transform Copia Tests

**Endpoint:** `POST /demo/orderSets/transformCopiaTests`

**Request Body:**
```json
{
  "copiaTests": [ /* Copia test format */ ]
}
```

**Description:** Converts Copia test format to internal format

**Used By:** `admin.service.ts:transformCopiaTests()`

---

### Get Order Results

**Endpoint:** `GET /demo/orderSets/getOrderResults/{hostCode}`

**Parameters:**
- `hostCode` (string) - Host system code

**Used By:** `admin.service.ts:getOrderResults()`

---

## Admin - Medication Sets

### Save Medication Set

**Endpoint:** `POST /demo/medSets/save`

**Request Body:**
```json
{
  "id": null,
  "name": "New CARD Set",
  "template": "R1A",
  "meds": [
    { "id": 45, "source": "Prescription" },
    { "id": 78, "source": "Prescription" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "New CARD Set"
  }
}
```

**Used By:** `admin.service.ts:saveMedSet()`

---

### View Medication Set

**Endpoint:** `GET /demo/medSets/view/{medSetId}`

**Parameters:**
- `medSetId` (number) - Medication set ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "CARD Medications",
    "template": "R1A",
    "meds": [ /* array of medications */ ]
  }
}
```

**Used By:** `admin.service.ts:getMedSet()`

---

### Delete Medication Set

**Endpoint:** `GET /demo/medSets/delete/{id}`

**Parameters:**
- `id` (number) - Medication set ID

**Used By:** `admin.service.ts:deleteMedSet()`

---

## Admin - Patients

### Search Test Patients

**Endpoint:** `POST /demo/search/testPatients/{page}`

**Parameters:**
- `page` (number) - Page number

**Request Body:**
```json
{
  "query": "john"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "patient_id": 50,
        "first_name": "John",
        "last_name": "Doe",
        "dob": "1980-05-20",
        "addr1": "123 Main St",
        "city": "Boston",
        "state": "MA",
        "zip": "02101",
        "phone": "555-1234",
        "sex": "M"
      }
    ],
    "total": 1
  }
}
```

**Used By:** `admin.service.ts:searchTestPatients()`

---

### Get Patient by ID

**Endpoint:** `GET /demo/testPatients/search/{patientId}`

**Parameters:**
- `patientId` (number) - Patient ID

**Used By:** `admin.service.ts:getTestPatient()`

---

### Edit Patient

**Endpoint:** `POST /demo/testPatients/edit`

**Request Body:**
```json
{
  "patient_id": 50,
  "first_name": "John",
  "last_name": "Doe",
  "dob": "1980-05-20",
  "addr1": "123 Main St",
  "city": "Boston",
  "state": "MA",
  "zip": "02101",
  "phone": "555-1234",
  "sex": "M"
}
```

**Used By:** `admin.service.ts:editTestPatient()`

---

### Create Patient

**Endpoint:** `POST /demo/testPatients/create`

**Request Body:** Same as Edit Patient (without patient_id)

**Used By:** `admin.service.ts:createTestPatient()`

---

## Admin - Scheduled Orders

### Search Scheduled Orders

**Endpoint:** `POST /demo/scheduledOrders/search/{page}`

**Parameters:**
- `page` (number) - Page number

**Request Body:**
```json
{
  "query": "",
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scheduledOrders": [
      {
        "id": 1,
        "location": { "id": 1, "name": "Main Lab" },
        "doctor": { "id": 10, "name": "Dr. Smith" },
        "patient": { "id": 50, "name": "John Doe" },
        "orderSet": { "id": 5, "name": "Standard Panel" },
        "medSet": { "id": 3, "name": "CARD Medications" },
        "period": "Weekly",
        "day": 1,
        "hour": 9,
        "enabled": true
      }
    ],
    "total": 1
  }
}
```

**Used By:** `admin.service.ts:searchScheduledOrders()`

---

### View Scheduled Order

**Endpoint:** `GET /demo/scheduledOrders/view/{scheduledOrderId}`

**Parameters:**
- `scheduledOrderId` (number) - Scheduled order ID

**Used By:** `admin.service.ts:getScheduledOrder()`

---

### Save Scheduled Order

**Endpoint:** `POST /demo/scheduledOrders/save`

**Request Body:**
```json
{
  "id": null,
  "location": { "id": 1 },
  "doctor": { "id": 10 },
  "patient": { "id": 50 },
  "orderSet": { "id": 5 },
  "medSet": { "id": 3 },
  "period": 1,
  "day": 1,
  "hour": 9,
  "enabled": true
}
```

**Used By:** `admin.service.ts:saveScheduledOrder()`

---

### Delete Scheduled Order

**Endpoint:** `GET /demo/scheduledOrders/delete/{id}`

**Parameters:**
- `id` (number) - Scheduled order ID

**Used By:** `admin.service.ts:deleteScheduledOrder()`

---

## Admin - Search Operations

### Search Tests

**Endpoint:** `POST /demo/search/tests/{page}`

**Request Body:**
```json
{
  "query": "drug screen"
}
```

**Used By:** `admin.service.ts:searchTests()`

---

### Search Profiles

**Endpoint:** `POST /demo/search/profiles/{page}`

**Request Body:**
```json
{
  "query": "comprehensive"
}
```

**Used By:** `admin.service.ts:searchProfiles()`

---

### Search Results

**Endpoint:** `POST /demo/search/results/{page}`

**Request Body:**
```json
{
  "query": "positive"
}
```

**Used By:** `admin.service.ts:searchResults()`

---

### Search TD Tests

**Endpoint:** `POST /demo/search/tdTests/{page}`

**Request Body:**
```json
{
  "query": "td panel"
}
```

**Used By:** `admin.service.ts:searchTdTests()`

---

## Medications

### Get Generic Medications

**Endpoint:** `GET /meds/generic/list`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "name": "Alprazolam",
      "type": "Generic",
      "templates": [
        { "id": 1, "name": "CARDSR" },
        { "id": 2, "name": "CARDRX" }
      ]
    }
  ]
}
```

**Used By:** `medication.service.ts:getGeneric()`

---

### Get Brand Medications

**Endpoint:** `GET /meds/brand/list`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 78,
      "name": "Xanax",
      "type": "Brand",
      "templates": [
        { "id": 2, "name": "CARDRX" }
      ]
    }
  ]
}
```

**Used By:** `medication.service.ts:getBrand()`

---

## User Management

### Save CRM ID

**Endpoint:** `GET /startup/save_crm/{id}`

**Parameters:**
- `id` (string) - CRM identifier

**Description:** Associates user session with CRM system

**Used By:** `user.service.ts:saveCrmId()`

---

## Reports

### Print Accession Report

**Endpoint:** `GET /accession/dupe/{accessionId}/10`

**Parameters:**
- `accessionId` (string) - Accession ID
- `10` - Number of copies (fixed)

**Description:** Generates printable accession report

**Used By:** `order.service.ts:print()`

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": 400
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Service Mapping

| Service | Primary Endpoints |
|---------|-------------------|
| **ApiService** | Base HTTP wrapper for all requests |
| **UserService** | `/user/token`, `/startup/save_crm` |
| **OrderService** | `/demo/order/*`, `/demo/actions/*`, `/demo/search/*` |
| **AdminService** | `/demo/orderSets/*`, `/demo/medSets/*`, `/demo/testPatients/*`, `/demo/scheduledOrders/*` |
| **MedicationService** | `/meds/generic/list`, `/meds/brand/list` |

---

## Authentication Flow

1. User provides credentials
2. App calls `GET /user/token?username=...&password=...`
3. Server returns JWT token
4. Token stored in ApiService (BehaviorSubject)
5. All subsequent requests include `Authorization: Bearer {token}` header
6. Token expires after session timeout (managed server-side)

---

## Pagination

All search endpoints support pagination:

**Request:** `/demo/search/patients/1` (page 1)

**Response:**
```json
{
  "data": {
    "patients": [ /* results */ ],
    "total": 50,
    "page": 1,
    "perPage": 5
  }
}
```

**Implementation:**
- 5 items per page (hardcoded)
- Pages are 1-indexed
- Client caches results by page number

---

## Rate Limiting

No explicit rate limiting documented in client code. Server may implement rate limiting independently.

---

## Notes

- All dates are in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- IDs are numeric integers
- Many GET endpoints could be POST for better REST compliance
- Legacy `@angular/http` module used (deprecated - should migrate to `HttpClient`)
