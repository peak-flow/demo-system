# File Guide

Comprehensive guide explaining what each file does in the Demo System application.

## Table of Contents

1. [Root Configuration Files](#root-configuration-files)
2. [Source Entry Points](#source-entry-points)
3. [Environment Configuration](#environment-configuration)
4. [Data Models (Classes)](#data-models-classes)
5. [Services](#services)
6. [Components](#components)
7. [Pages](#pages)
8. [Modals](#modals)
9. [Test Files](#test-files)

---

## Root Configuration Files

### `package.json`
**Purpose:** npm package configuration and dependency management

**Key Sections:**
- `dependencies` - Runtime dependencies (Angular, Bootstrap, RxJS, etc.)
- `devDependencies` - Development tools (TypeScript, testing frameworks)
- `scripts` - npm commands (serve, build, test, lint)

**Dependencies:**
- Angular 7.2.x framework
- Bootstrap 4.3.1 for styling
- ng-bootstrap for Angular Bootstrap components
- ng-select for dropdown select components
- RxJS 6.3.3 for reactive programming
- Moment.js for date handling

---

### `package-lock.json`
**Purpose:** Locks exact versions of all dependencies

Ensures consistent installations across different environments.

---

### `angular.json`
**Purpose:** Angular CLI configuration

**Key Configuration:**
- Project name: `demo-system`
- Source root: `src`
- Output path: `dist/demo-system`
- Main entry: `src/main.ts`
- Index file: `src/index.html`
- Styles: `src/styles.scss`
- Build optimization settings
- Bundle size budgets (2MB warning, 5MB error)

---

### `tsconfig.json`
**Purpose:** TypeScript compiler configuration

**Compiler Options:**
- `target: es5` - Output ES5 JavaScript for compatibility
- `module: es2015` - Use ES2015 modules
- `experimentalDecorators: true` - Enable decorators (@Component, @Injectable)
- `emitDecoratorMetadata: true` - Emit metadata for decorators
- `lib: ["es2018", "dom"]` - Include ES2018 and DOM typings

---

### `tslint.json`
**Purpose:** TSLint code quality rules

Enforces code style and best practices:
- No console statements
- Use single quotes
- Enforce semicolons
- Component class naming conventions

---

### `.editorconfig`
**Purpose:** Editor configuration for consistent formatting

Settings:
- Charset: UTF-8
- Indent: 2 spaces
- Line endings: LF
- Trim trailing whitespace

---

### `.gitignore`
**Purpose:** Specifies files Git should ignore

Ignores:
- `/node_modules/` - Dependencies
- `/dist/` - Build output
- `*.js.map` - Source maps
- `.DS_Store` - macOS files

---

## Source Entry Points

### `src/index.html`
**Purpose:** Main HTML document (single page)

**Content:**
- `<app-root>` - Root component mount point
- Meta tags for viewport and charset
- Favicon link
- Base href for routing

**Flow:**
1. Browser loads index.html
2. Angular bootstraps and replaces `<app-root>` with AppComponent
3. Router renders current route inside AppComponent

---

### `src/main.ts`
**Purpose:** Application entry point (bootstraps Angular)

```typescript
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

**Flow:**
1. Loads browser platform (platformBrowserDynamic)
2. Bootstraps root module (AppModule)
3. AppModule bootstraps AppComponent
4. Application starts

---

### `src/polyfills.ts`
**Purpose:** Browser polyfills for compatibility

Imports polyfills needed for:
- ES2015+ features in older browsers
- Zone.js for Angular change detection
- Web Animations API

---

### `src/test.ts`
**Purpose:** Test environment configuration

Configures Karma test runner:
- Imports test dependencies
- Initializes Angular testing environment
- Discovers all `.spec.ts` test files

---

### `src/styles.scss`
**Purpose:** Global application styles

Imports:
- Bootstrap CSS
- ng-select CSS
- Custom global styles

Applies to entire application (not scoped to components).

---

## Environment Configuration

### `src/environments/environment.ts`
**Purpose:** Development environment configuration

```typescript
export const environment = {
  production: false,
  api_url: 'https://jdwebapi01.dominiondiagnostics.com/',
  env_name: 'development',
  user_name: 'jdewar',
  password: '123connect?'
};
```

**Usage:**
```typescript
import { environment } from '../environments/environment';
const apiUrl = environment.api_url;
```

---

### `src/environments/environment.prod.ts`
**Purpose:** Production environment configuration

Same structure as development, but with:
- `production: true`
- Production API URL
- No hardcoded credentials (should be removed)

Angular CLI automatically uses correct environment based on build flag:
- `ng serve` → `environment.ts`
- `ng build --prod` → `environment.prod.ts`

---

## Data Models (Classes)

### `src/app/classes/order.ts`
**Purpose:** Order-related TypeScript interfaces and classes

**Exports:**
- `Order` - Main order model
- `OrderLocation` - Location information
- `OrderDoctor` - Doctor information
- `OrderPatient` - Patient information
- `OrderEvent` - Order status event
- `OrderResult` - Test result
- `MissingResult` - Missing result data
- `OrderStatus` - Status enumeration

**Key Properties:**
```typescript
export class Order {
  id: number;
  accessionId: number;
  sampleId: string;
  created: Date;
  status: OrderStatus;
  location: OrderLocation;
  doctor: OrderDoctor;
  patient: OrderPatient;
  orderSet: OrderSet;
  medSet: MedicationSet;
  events?: OrderEvent[];
  orders: any[];
}
```

---

### `src/app/classes/medication.ts`
**Purpose:** Medication-related models

**Exports:**
- `Medication` - Single medication
- `MedicationSet` - Collection of medications for reporting
- `MedicationType` - Generic vs Brand enum
- `MedicationSource` - Source enum (Prescription, Self-Reported, PRN)
- `MedicationChoiceTemplate` - Template enum (CARDSR, CARDRX, SAMM)
- `ReportTemplate` - Report type (CARD='R1A', SAMM='R1P')

---

### `src/app/classes/order-set.ts`
**Purpose:** Test order set models

**Exports:**
- `OrderSet` - Test panel collection
- `OrderPanel` - Individual test panel
- `OrderTdPanel` - TD test panel

**Structure:**
```typescript
export class OrderSet {
  id: number;
  name: string;
  panels?: OrderPanel[];
  tdPanels?: OrderTdPanel[];
  results?: OrderResult[];
}
```

---

### `src/app/classes/patient.ts`
**Purpose:** Patient information models

**Exports:**
- `Patient` - Simple patient (id, name)
- `TestPatient` - Detailed test patient with demographics

**TestPatient Fields:**
- `patient_id` - Unique identifier
- `first_name`, `last_name`
- `dob` - Date of birth
- `addr1`, `addr2`, `city`, `state`, `zip`
- `phone`
- `sex` - M/F
- `country`

---

### `src/app/classes/scheduled-order.ts`
**Purpose:** Recurring order configuration

**Exports:**
- `ScheduledOrder` - Recurring order settings
- `ScheduledOrderPeriod` - Weekly=1, Monthly=2

**Properties:**
```typescript
export class ScheduledOrder {
  id?: number;
  location: OrderLocation;
  doctor: OrderDoctor;
  patient: OrderPatient;
  orderSet: OrderSet;
  medSet: MedicationSet;
  period: ScheduledOrderPeriod;
  day: number;        // Day of week or month
  hour: number;       // Hour of day (0-23)
  enabled: boolean;
}
```

---

### `src/app/classes/message.ts`
**Purpose:** Inter-component message model

**Structure:**
```typescript
export class Message {
  type: string;    // Message type identifier
  data: any;       // Message payload
}
```

**Used By:** MessageService for component communication

---

### `src/app/classes/test-patient.ts`
**Purpose:** Test patient model (duplicate of patient.ts)

Likely duplicate/legacy file - functionality in `patient.ts`.

---

## Services

### `src/app/services/api.service.ts`
**Purpose:** Core HTTP client wrapper with authentication

**Key Features:**
- Bearer token management via BehaviorSubject
- Automatic Authorization header injection
- Response parsing (success/error format)
- Observable-based HTTP methods

**Methods:**
- `setToken(token)` - Set authentication token
- `getToken()` - Get current token as Observable
- `get(endpoint)` - HTTP GET
- `post(endpoint, data)` - HTTP POST
- `put(endpoint, data)` - HTTP PUT
- `delete(endpoint)` - HTTP DELETE

**Response Format Handling:**
```typescript
// API returns: { success: true, data: {...} }
// Service returns: Observable<data>

// API returns: { success: false, error: "..." }
// Service returns: Observable.throw(error)
```

**Used By:** All other services for API communication

---

### `src/app/services/user.service.ts`
**Purpose:** User authentication and management

**Methods:**
- `login()` - Authenticate with hardcoded credentials (development)
- `saveCrmId(id)` - Save CRM identifier
- `getToken()` - Get authentication token

**Flow:**
1. `login()` calls `/user/token` endpoint
2. Receives JWT token from server
3. Stores token in ApiService via `setToken()`
4. Token automatically included in all future requests

**Storage:** Token stored in ApiService BehaviorSubject (memory only, not persisted)

---

### `src/app/services/message.service.ts`
**Purpose:** Inter-component communication via postMessage API

**Use Case:** Communication between iframe and parent window

**Methods:**
- `sendMessage(message)` - Send message to listeners
- `getMessages()` - Subscribe to incoming messages

**Pattern:**
```typescript
// Component A (sender)
messageService.sendMessage({ type: 'TOKEN', data: token });

// Component B (receiver)
messageService.getMessages().subscribe(message => {
  if (message.type === 'TOKEN') {
    this.handleToken(message.data);
  }
});
```

**Used By:** NavigatorComponent for iframe communication

---

### `src/app/services/order.service.ts`
**Purpose:** Order management and business logic

**Key Features:**
- Order CRUD operations
- Search with pagination
- Order workflow actions (send to Copia, release to LIS, etc.)
- Caching mechanism for performance

**Core Methods:**

**Order Operations:**
- `view(orderId)` - Get single order
- `create(order)` - Create new order
- `update(orderId)` - Refresh order status
- `events(orderId)` - Get order event history
- `getMeds(orderId)` - Get order medications
- `getTests(orderSetId)` - Get order test panels

**Search:**
- `search(query, page)` - Search orders
- `searchDateRange(start, end, page)` - Search by date range
- `searchPatients(query, page)` - Search patients
- `searchDoctors(query, page)` - Search doctors
- `searchLocations(query, page)` - Search locations
- `searchOrderSets(query, page)` - Search order sets

**Actions:**
- `sendToCopia(orderId)` - Send order to Copia system
- `release(orderId)` - Release order to LIS
- `result(orderId)` - Send results to LIS
- `sendMeds(orderId)` - Send medications
- `saveMeds(orderId, meds)` - Save medications with source
- `missing(orderId, results)` - Submit missing results
- `process(orderId)` - Run complete workflow

**Other:**
- `print(accessionId)` - Print accession report

**Caching:**
```typescript
orders: {
  list: { [page: number]: Order[] }  // Cached by page
}
```

---

### `src/app/services/medication.service.ts`
**Purpose:** Medication data management

**Methods:**
- `getGeneric()` - Get all generic medications
- `getBrand()` - Get all brand medications
- `getByTemplate(template)` - Filter medications by template type

**Templates:**
- CARDSR (1) - CARD Self-Reported
- CARDRX (2) - CARD Prescription
- SAMM (3) - SAMM Report

**Usage:**
```typescript
medicationService.getGeneric().subscribe(meds => {
  this.medications = meds;
});

// Filter by template
const sammMeds = medicationService.getByTemplate(3);
```

---

### `src/app/services/admin.service.ts`
**Purpose:** Admin panel operations

**Order Set Management:**
- `getOrderSet(id)` - View order set
- `saveOrderSetPanels(orderSet)` - Save test panels
- `deleteOrderSet(id)` - Delete order set
- `getProfileTests(testId)` - Get tests for profile
- `transformCopiaTests(tests)` - Transform Copia format
- `getOrderResults(hostCode)` - Get results by host code

**Medication Set Management:**
- `getMedSet(id)` - View medication set
- `saveMedSet(medSet)` - Create/update medication set
- `deleteMedSet(id)` - Delete medication set

**Patient Management:**
- `searchTestPatients(query, page)` - Search patients
- `getTestPatient(id)` - Get patient by ID
- `createTestPatient(patient)` - Create new patient
- `editTestPatient(patient)` - Update patient

**Scheduled Order Management:**
- `searchScheduledOrders(query, page)` - Search scheduled orders
- `getScheduledOrder(id)` - View scheduled order
- `saveScheduledOrder(order)` - Create/update scheduled order
- `deleteScheduledOrder(id)` - Delete scheduled order

**Search Operations:**
- `searchTests(query, page)` - Search tests
- `searchProfiles(query, page)` - Search profiles
- `searchResults(query, page)` - Search results
- `searchTdTests(query, page)` - Search TD tests

---

## Components

### `src/app/components/navigator/navigator.component.ts`
**Purpose:** iframe bridge for cross-origin navigation

**Functionality:**
- Embeds iframe pointing to external URL
- Sends messages to parent window via postMessage
- Receives messages from parent (token, user info)
- Reports iframe state (loading, height, location)

**Message Flow:**
```
Parent Window ←→ NavigatorComponent ←→ iframe
```

**Sent Messages:**
- Current location URL
- iframe content height
- Loading state

**Received Messages:**
- Authentication token
- User information

**Use Case:** Allows embedding external application that needs authentication context from Angular app

---

## Pages

### `src/app/pages/orders/orders.component.ts`
**Purpose:** Main orders list page

**Location:** `/orders` route

**Features:**
- Display paginated order list
- Search orders by various criteria
- Filter by status
- Navigate to order detail modal
- Create new order modal
- Refresh and auto-refresh functionality

**Key Methods:**
- `ngOnInit()` - Load initial orders
- `search(query)` - Search orders
- `loadPage(page)` - Load specific page
- `viewOrder(id)` - Open order detail modal
- `createOrder()` - Open new order modal
- `refresh()` - Reload current page

**Template Features:**
- Search input with debounce
- Status filter dropdown
- Order list with infinite scroll
- Action buttons (view, process, print)

**Child Routes:**
- `/orders/new` → NewOrderComponent (modal)
- `/orders/view/:id` → OrderComponent (modal)

---

### `src/app/pages/admin/admin.component.ts`
**Purpose:** Admin panel container

**Location:** `/admin` route

**Structure:** Container component with navigation tabs

**Child Routes:**
- `/admin/order-sets` → Order sets management
- `/admin/med-sets` → Medication sets management
- `/admin/patients` → Patient management
- `/admin/recurring` → Scheduled orders management

**Template:** Tab navigation with `<router-outlet>` for child pages

---

### `src/app/pages/order-sets/order-sets.component.ts`
**Purpose:** Order sets management page

**Location:** `/admin/order-sets` route

**Features:**
- List all order sets
- Search order sets
- Create new order set
- Edit existing order set
- Delete order set

**Methods:**
- `searchOrderSets(query)` - Search order sets
- `viewOrderSet(id)` - Open order set editor modal
- `createOrderSet()` - Open new order set modal
- `deleteOrderSet(id)` - Delete with confirmation

**Child Routes:**
- `/admin/order-sets/new` → OrderSetComponent (modal)
- `/admin/order-sets/view/:id` → OrderSetComponent (modal)

---

### `src/app/pages/med-sets/med-sets.component.ts`
**Purpose:** Medication sets management page

**Location:** `/admin/med-sets` route

**Features:**
- List medication sets
- Filter by template (CARD, SAMM)
- Create new medication set
- Edit existing medication set
- Delete medication set

**Methods:**
- `loadMedSets()` - Load all medication sets
- `viewMedSet(id)` - Open medication set editor
- `createMedSet()` - Open new medication set modal
- `deleteMedSet(id)` - Delete with confirmation

**Child Routes:**
- `/admin/med-sets/new` → MedSetComponent (modal)
- `/admin/med-sets/view/:id` → MedSetComponent (modal)

---

### `src/app/pages/patients/patients.component.ts`
**Purpose:** Test patient management page

**Location:** `/admin/patients` route

**Features:**
- List test patients
- Search by name, ID, or demographics
- Create new test patient
- Edit existing test patient
- View patient details

**Methods:**
- `searchPatients(query)` - Search patients
- `viewPatient(id)` - Open patient editor
- `createPatient()` - Open new patient modal
- `loadPage(page)` - Load specific page

**Child Routes:**
- `/admin/patients/new` → PatientComponent (modal)
- `/admin/patients/view/:id` → PatientComponent (modal)

---

### `src/app/pages/scheduled-orders/scheduled-orders.component.ts`
**Purpose:** Scheduled orders management page (filename: `order-sets.component.ts` but actually ScheduledOrdersComponent)

**Location:** `/admin/recurring` route

**Features:**
- List scheduled orders
- Enable/disable scheduled orders
- Create new scheduled order
- Edit existing scheduled order
- Delete scheduled order
- View schedule details (period, day, hour)

**Methods:**
- `searchScheduledOrders(query)` - Search scheduled orders
- `viewScheduledOrder(id)` - Open editor
- `createScheduledOrder()` - Open new scheduled order modal
- `toggleEnabled(id)` - Enable/disable order
- `deleteScheduledOrder(id)` - Delete with confirmation

**Child Routes:**
- `/admin/recurring/new` → ScheduledOrderComponent (modal)
- `/admin/recurring/view/:id` → ScheduledOrderComponent (modal)

---

## Modals

### `src/app/modals/new-order/new-order.component.ts`
**Purpose:** Create new order modal

**Location:** `/orders/new` child route

**Features:**
- Multi-field search (patient, doctor, location, order set, med set)
- Debounced search inputs
- Dropdown selections with ng-select
- Form validation
- Create order action

**Form Fields:**
- Patient (searchable)
- Doctor (searchable)
- Location (searchable)
- Order Set (searchable)
- Medication Set (searchable)

**Methods:**
- `searchPatients(query)` - Search patients
- `searchDoctors(query)` - Search doctors
- `searchLocations(query)` - Search locations
- `searchOrderSets(query)` - Search order sets
- `searchMedSets(query)` - Search med sets
- `create()` - Submit order creation
- `close()` - Navigate back to orders list

**Validation:**
- All fields required
- Submit button disabled until valid

---

### `src/app/modals/order/order.component.ts`
**Purpose:** View/edit order details modal

**Location:** `/orders/view/:orderId` child route

**Features:**
- Display order details
- View order events timeline
- View order medications
- View order results
- Action buttons (send to Copia, release, etc.)
- Print report
- Update order status

**Methods:**
- `loadOrder(id)` - Load order data
- `loadEvents(id)` - Load event history
- `loadMeds(id)` - Load medications
- `sendToCopia()` - Send to Copia
- `release()` - Release to LIS
- `result()` - Send results
- `process()` - Run full workflow
- `print()` - Print report
- `close()` - Navigate back

**Displays:**
- Order information
- Patient demographics
- Doctor and location
- Order set and med set
- Status timeline
- Test results
- Action history

---

### `src/app/modals/order-set/order-set.component.ts`
**Purpose:** Create/edit order set modal

**Location:** `/admin/order-sets/view/:id` or `/admin/order-sets/new`

**Features:**
- Edit order set name
- Search and add test panels
- Search and add profiles
- Search and add results
- Remove tests/panels/results
- Save order set
- Transform Copia tests

**Methods:**
- `loadOrderSet(id)` - Load existing order set
- `searchTests(query)` - Search available tests
- `searchProfiles(query)` - Search test profiles
- `searchResults(query)` - Search results
- `addPanel(panel)` - Add test panel to order set
- `removePanel(index)` - Remove test panel
- `save()` - Save order set
- `close()` - Navigate back

**Form Structure:**
- Name input
- Test panels list (sortable)
- TD test panels list
- Results list
- Search interfaces for each type

---

### `src/app/modals/med-set/med-set.component.ts`
**Purpose:** Create/edit medication set modal

**Location:** `/admin/med-sets/view/:id` or `/admin/med-sets/new`

**Features:**
- Edit medication set name
- Select template type (CARD/SAMM)
- Select medications from filtered list
- Assign medication source (Prescription, Self-Reported, PRN)
- Save medication set

**Methods:**
- `loadMedSet(id)` - Load existing med set
- `loadMedications()` - Load available medications
- `filterByTemplate(template)` - Filter meds by template
- `addMedication(med)` - Add medication to set
- `removeMedication(index)` - Remove medication
- `setSource(med, source)` - Set medication source
- `save()` - Save medication set
- `close()` - Navigate back

**Template Types:**
- CARD (R1A) - Shows CARDSR and CARDRX medications
- SAMM (R1P) - Shows SAMM medications

---

### `src/app/modals/patient/patient.component.ts`
**Purpose:** Create/edit test patient modal

**Location:** `/admin/patients/view/:id` or `/admin/patients/new`

**Features:**
- Patient demographics form
- Address information
- Contact information
- Form validation
- Save patient

**Form Fields:**
- First name (required)
- Last name (required)
- Date of birth (required)
- Sex (M/F, required)
- Address line 1
- Address line 2
- City
- State
- ZIP code
- Phone
- Country

**Methods:**
- `loadPatient(id)` - Load existing patient
- `save()` - Save patient (create or update)
- `close()` - Navigate back

**Validation:**
- Required fields enforced
- Date format validation
- Phone number format
- ZIP code format

---

### `src/app/modals/scheduled-order/scheduled-order.component.ts`
**Purpose:** Create/edit scheduled order modal

**Location:** `/admin/recurring/view/:id` or `/admin/recurring/new`

**Features:**
- Configure recurring order settings
- Select patient, doctor, location, order set, med set
- Set recurrence period (Weekly/Monthly)
- Set day and hour
- Enable/disable schedule

**Form Fields:**
- Patient (searchable dropdown)
- Doctor (searchable dropdown)
- Location (searchable dropdown)
- Order Set (searchable dropdown)
- Medication Set (searchable dropdown)
- Period (Weekly=1, Monthly=2)
- Day (1-7 for weekly, 1-31 for monthly)
- Hour (0-23)
- Enabled (checkbox)

**Methods:**
- `loadScheduledOrder(id)` - Load existing scheduled order
- `searchPatients(query)` - Search patients
- `searchDoctors(query)` - Search doctors
- `searchLocations(query)` - Search locations
- `searchOrderSets(query)` - Search order sets
- `searchMedSets(query)` - Search med sets
- `save()` - Save scheduled order
- `close()` - Navigate back

**Business Logic:**
- Weekly: day 1-7 (Monday-Sunday)
- Monthly: day 1-31 (day of month)
- Hour: 0-23 (24-hour format)
- Creates orders automatically based on schedule

---

## Test Files

### `*.spec.ts` Files
**Purpose:** Unit test files for components, services, and classes

**Framework:** Jasmine testing framework

**Structure:**
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentName],
      imports: [...],
      providers: [...]
    });
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should do something', () => {
    // Test logic
    expect(result).toEqual(expected);
  });
});
```

**Run Tests:** `ng test` (launches Karma test runner)

---

### `src/karma.conf.js`
**Purpose:** Karma test runner configuration

**Settings:**
- Browser: ChromeHeadless
- Framework: Jasmine
- Code coverage: enabled
- Reporters: progress, kjhtml

---

### `e2e/` Directory
**Purpose:** End-to-end tests

**Framework:** Protractor (deprecated)

**Files:**
- `protractor.conf.js` - Protractor configuration
- `src/*.e2e-spec.ts` - E2E test scenarios

**Run E2E Tests:** `ng e2e`

---

## Module and Routing Files

### `src/app/app.module.ts`
**Purpose:** Root module - application configuration

**Responsibilities:**
1. Declare all components
2. Import required modules
3. Register services (providers)
4. Bootstrap root component

**Declarations:** (13 components)
- AppComponent
- NavigatorComponent
- OrdersComponent, OrderComponent, NewOrderComponent
- OrderSetsComponent, OrderSetComponent
- MedSetsComponent, MedSetComponent
- PatientsComponent, PatientComponent
- ScheduledOrdersComponent, ScheduledOrderComponent

**Imports:**
- BrowserModule - Browser platform
- FormsModule - Template-driven forms
- HttpModule - HTTP client (deprecated)
- NgbModule - ng-bootstrap components
- NgSelectModule - ng-select dropdowns
- AppRoutingModule - Routing configuration

**Providers:** (6 services)
- ApiService
- UserService
- MessageService
- OrderService
- MedicationService
- AdminService

**Bootstrap:**
- AppComponent - Root component

---

### `src/app/app-routing.module.ts`
**Purpose:** Application routing configuration

**Route Structure:**
```
/                          → Redirect to /orders
/orders                    → OrdersComponent
  /orders/new              → NewOrderComponent (modal)
  /orders/view/:orderId    → OrderComponent (modal)
/admin                     → AdminComponent
  /admin/order-sets        → OrderSetsComponent
    /admin/order-sets/new  → OrderSetComponent (modal)
    /admin/order-sets/view/:id → OrderSetComponent (modal)
  /admin/med-sets          → MedSetsComponent
    /admin/med-sets/new    → MedSetComponent (modal)
    /admin/med-sets/view/:id → MedSetComponent (modal)
  /admin/patients          → PatientsComponent
    /admin/patients/new    → PatientComponent (modal)
    /admin/patients/view/:id → PatientComponent (modal)
  /admin/recurring         → ScheduledOrdersComponent
    /admin/recurring/new   → ScheduledOrderComponent (modal)
    /admin/recurring/view/:id → ScheduledOrderComponent (modal)
```

**Features:**
- Child routes for modals
- Route parameters (`:orderId`, `:id`)
- Default redirect
- Nested routing structure

---

### `src/app/app.component.ts`
**Purpose:** Root component

**Template:**
```html
<app-navigator></app-navigator>
<router-outlet></router-outlet>
```

**Responsibilities:**
1. Render navigator component (iframe bridge)
2. Provide router outlet for page rendering
3. Initialize authentication on startup

**Lifecycle:**
```typescript
ngOnInit() {
  this.userService.login(); // Auto-login on startup
}
```

---

## Summary

**Total Files:** 69 TypeScript/HTML/CSS files

**File Categories:**
- **Configuration:** 7 files (package.json, angular.json, tsconfig, etc.)
- **Entry Points:** 4 files (main.ts, index.html, polyfills.ts, test.ts)
- **Environment:** 2 files (environment.ts, environment.prod.ts)
- **Data Models:** 6 files (classes/)
- **Services:** 6 files (services/)
- **Components:** 2 files (components/)
- **Pages:** 5 files (pages/)
- **Modals:** 6 files (modals/)
- **Routing/Module:** 3 files (app.module.ts, app-routing.module.ts, app.component.ts)
- **Test Files:** 28 files (*.spec.ts)

**Key Architectural Decisions:**
1. Single module architecture (no feature modules)
2. Service layer for all business logic
3. Modal pattern using child routes
4. Reactive patterns with RxJS
5. Template-driven forms
6. Centralized API service with token management
7. Pagination and caching in services
