# Angular 7.2 Beginner's Guide - How This App Works

A step-by-step walkthrough of how Angular routing, templates, business logic, and API calls work in this application.

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [How Routing Works](#how-routing-works)
3. [How HTML Templates Load](#how-html-templates-load)
4. [How Business Logic Works](#how-business-logic-works)
5. [How Forms Submit Data](#how-forms-submit-data)
6. [How API Calls Work](#how-api-calls-work)
7. [Complete Example Walkthrough](#complete-example-walkthrough)

---

## The Big Picture

Angular applications follow this pattern:

```
User visits URL → Router matches URL → Component loads → HTML renders → User clicks button →
Component method runs → Service called → API request made → Response returns → Component updates → HTML re-renders
```

Let me break down each step with real examples from this codebase.

---

## How Routing Works

### 1. Route Configuration (`app-routing.module.ts`)

Routes are defined in `src/app/app-routing.module.ts`. Think of this as a map that tells Angular "when the user goes to this URL, load this component".

**Example from our app:**

```typescript
const routes: Routes = [
  // Default route - redirect to /orders
  { path: '', redirectTo: '/orders', pathMatch: 'full' },

  // /orders route - shows OrdersComponent
  {
    path: 'orders',
    component: OrdersComponent,
    children: [
      // /orders/new - modal overlay
      { path: 'new', component: NewOrderComponent },
      // /orders/view/123 - modal with order ID
      { path: 'view/:orderId', component: OrderComponent }
    ]
  },

  // /admin route - shows AdminComponent
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      // Nested admin routes
      { path: 'order-sets', component: OrderSetsComponent },
      // ... more routes
    ]
  }
];
```

**What this means:**

| URL | What Loads | Where It Shows |
|-----|-----------|----------------|
| `http://localhost:4200/` | Redirects to `/orders` | N/A |
| `http://localhost:4200/orders` | `OrdersComponent` | Main page - list of orders |
| `http://localhost:4200/orders/new` | `OrdersComponent` + `NewOrderComponent` | Page + modal overlay |
| `http://localhost:4200/orders/view/123` | `OrdersComponent` + `OrderComponent` | Page + modal with order 123 |
| `http://localhost:4200/admin` | `AdminComponent` | Admin dashboard |

### 2. Router Outlet (`app.component.html`)

The root component has a `<router-outlet>` tag - this is where Angular puts the component that matches the current URL.

**File: `src/app/app.component.html`**
```html
<app-navigator></app-navigator>
<router-outlet></router-outlet>
```

**What happens:**
1. User visits `/orders`
2. Angular looks at routing table
3. Finds `{ path: 'orders', component: OrdersComponent }`
4. Loads `OrdersComponent` into the `<router-outlet>`

### 3. Nested Router Outlets (Child Routes)

Child routes work the same way but with nested `<router-outlet>` tags.

**File: `src/app/pages/orders/orders.component.html`**
```html
<div class="orders-page">
  <h1>Orders</h1>

  <!-- Orders list here -->
  <div *ngFor="let order of orders">
    {{ order.accessionId }}
  </div>

  <!-- Child routes render here (modals) -->
  <router-outlet></router-outlet>
</div>
```

**What happens when user visits `/orders/view/123`:**
1. `OrdersComponent` loads in main `<router-outlet>` (from app.component.html)
2. `OrderComponent` loads in nested `<router-outlet>` (from orders.component.html)
3. Both components are visible - page underneath, modal on top

---

## How HTML Templates Load

### 1. Component Decorator Links Template

Every component has a TypeScript file that links to its HTML template.

**File: `src/app/pages/orders/orders.component.ts`**
```typescript
@Component({
  selector: 'app-orders',                          // HTML tag name
  templateUrl: './orders.component.html',          // Path to HTML
  styleUrls: ['./orders.component.scss']           // Path to styles
})
export class OrdersComponent implements OnInit {
  // Component logic here
  orders: Order[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Load orders from API
  }
}
```

### 2. Template Displays Data

The HTML template uses special Angular syntax to display data from the component.

**File: `src/app/pages/orders/orders.component.html`**
```html
<div class="container">
  <!-- Search input bound to component property -->
  <input type="text"
         [(ngModel)]="searchText"
         placeholder="Search orders...">

  <!-- Loop through orders array from component -->
  <div *ngFor="let order of orders" class="order-row">
    <!-- Display order properties with {{ }} -->
    <h3>Accession: {{ order.accessionId }}</h3>
    <p>Patient: {{ order.patient.name }}</p>
    <p>Status: {{ order.status }}</p>

    <!-- Button click calls component method -->
    <button (click)="viewOrder(order.id)">View Details</button>
  </div>
</div>
```

### 3. Angular Directives

Angular has special HTML attributes that add functionality:

| Directive | Purpose | Example |
|-----------|---------|---------|
| `*ngFor` | Loop through array | `<div *ngFor="let order of orders">` |
| `*ngIf` | Show/hide based on condition | `<div *ngIf="isLoading">Loading...</div>` |
| `[(ngModel)]` | Two-way data binding | `<input [(ngModel)]="searchText">` |
| `(click)` | Click event handler | `<button (click)="save()">` |
| `[disabled]` | Bind property | `<button [disabled]="!isValid">` |
| `{{ }}` | Display variable | `<h1>{{ title }}</h1>` |

---

## How Business Logic Works

### 1. Component Properties (Data)

Components have properties that store data and state.

**File: `src/app/pages/orders/orders.component.ts`**
```typescript
export class OrdersComponent implements OnInit {
  // DATA PROPERTIES
  orders: Order[] = [];              // List of orders
  searchText: string = '';           // Search input value
  currentPage: number = 1;           // Current page number
  isLoading: boolean = false;        // Loading state

  // DEPENDENCY INJECTION (Angular provides these)
  constructor(
    private orderService: OrderService,  // Service for API calls
    private router: Router                // Service for navigation
  ) { }

  // LIFECYCLE HOOK - runs when component loads
  ngOnInit() {
    this.loadOrders();
  }

  // METHODS (functions)
  loadOrders() {
    this.isLoading = true;
    this.orderService.search(this.searchText, this.currentPage)
      .subscribe(result => {
        this.orders = result.list;
        this.isLoading = false;
      });
  }

  viewOrder(orderId: number) {
    // Navigate to order detail modal
    this.router.navigate(['/orders', 'view', orderId]);
  }

  onSearchChange(text: string) {
    this.searchText = text;
    this.loadOrders();  // Reload with new search
  }
}
```

### 2. Lifecycle Hooks

Angular calls special methods at specific times:

```typescript
export class OrdersComponent implements OnInit, OnDestroy {

  ngOnInit() {
    // Called ONCE when component first loads
    // Perfect place to load initial data
    this.loadOrders();
  }

  ngOnDestroy() {
    // Called when component is about to be destroyed
    // Clean up subscriptions, timers, etc.
    this.subscription.unsubscribe();
  }
}
```

### 3. Services (Shared Business Logic)

Services are classes that handle business logic and API calls. Components use services instead of making API calls directly.

**File: `src/app/services/order.service.ts`**
```typescript
@Injectable({
  providedIn: 'root'  // One instance shared across entire app
})
export class OrderService {
  private orders: any = { list: {} };  // Cache

  constructor(private api: ApiService) { }

  // Search orders method
  search(query: string, page: number): Observable<any> {
    // Check cache first
    if (this.orders.list[page]) {
      return of(this.orders.list[page]);  // Return cached data
    }

    // Make API call
    return this.api.post(`/demo/order/search/${page}`, { query })
      .pipe(
        tap(result => {
          // Cache the result
          this.orders.list[page] = result;
        })
      );
  }

  // Get single order
  view(orderId: number): Observable<Order> {
    return this.api.get(`/demo/order/view/${orderId}`);
  }

  // Create new order
  create(order: any): Observable<any> {
    return this.api.post('/demo/actions/create', order);
  }
}
```

**Why use services?**
- Reusable across multiple components
- Centralizes business logic
- Handles caching
- Easier to test

---

## How Forms Submit Data

### 1. Template-Driven Form (Simple)

This app uses template-driven forms where form data is bound to component properties.

**File: `src/app/modals/new-order/new-order.component.html`**
```html
<form #orderForm="ngForm" (submit)="createOrder()">

  <!-- Patient search dropdown -->
  <ng-select
    [(ngModel)]="order.patient"
    name="patient"
    required
    [items]="patients"
    bindLabel="name"
    placeholder="Select patient">
  </ng-select>

  <!-- Doctor search dropdown -->
  <ng-select
    [(ngModel)]="order.doctor"
    name="doctor"
    required
    [items]="doctors"
    bindLabel="name"
    placeholder="Select doctor">
  </ng-select>

  <!-- Order Set dropdown -->
  <ng-select
    [(ngModel)]="order.orderSet"
    name="orderSet"
    required
    [items]="orderSets"
    bindLabel="name"
    placeholder="Select order set">
  </ng-select>

  <!-- Submit button - disabled until form is valid -->
  <button type="submit" [disabled]="!orderForm.valid">
    Create Order
  </button>
</form>
```

### 2. Component Handles Form Submission

**File: `src/app/modals/new-order/new-order.component.ts`**
```typescript
export class NewOrderComponent implements OnInit {
  // Form data object
  order = {
    patient: null,
    doctor: null,
    location: null,
    orderSet: null,
    medSet: null
  };

  // Dropdown options
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  orderSets: OrderSet[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    // Load dropdown options
    this.searchPatients('');
    this.searchDoctors('');
    this.searchOrderSets('');
  }

  // Called when form is submitted
  createOrder() {
    console.log('Creating order:', this.order);

    // Prepare API request data
    const orderData = {
      patient_id: this.order.patient.id,
      doctor_id: this.order.doctor.id,
      location_id: this.order.location.id,
      order_set_id: this.order.orderSet.id,
      med_set_id: this.order.medSet.id
    };

    // Call service to create order
    this.orderService.create(orderData)
      .subscribe(
        response => {
          console.log('Order created:', response);
          // Navigate back to orders list
          this.router.navigate(['/orders']);
        },
        error => {
          console.error('Error creating order:', error);
        }
      );
  }
}
```

### 3. How `[(ngModel)]` Works (Two-Way Binding)

```html
<input [(ngModel)]="searchText">
```

**What this means:**
1. **Display value:** Shows `searchText` value in the input
2. **Update value:** When user types, updates `searchText` immediately

**It's equivalent to:**
```html
<input
  [value]="searchText"                      <!-- One-way: component → view -->
  (input)="searchText = $event.target.value"> <!-- One-way: view → component -->
```

---

## How API Calls Work

### 1. The API Service (HTTP Wrapper)

All API calls go through `ApiService` which adds authentication and handles responses.

**File: `src/app/services/api.service.ts`**
```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://jdwebapi01.dominiondiagnostics.com/';
  private token: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private http: Http) { }

  // GET request
  get(endpoint: string): Observable<any> {
    const url = this.baseUrl + endpoint;
    const headers = this.getHeaders();  // Adds auth token

    return this.http.get(url, { headers })
      .map(response => response.json())
      .map(this.handleResponse)  // Parse success/error format
      .catch(this.handleError);
  }

  // POST request
  post(endpoint: string, data: any): Observable<any> {
    const url = this.baseUrl + endpoint;
    const headers = this.getHeaders();

    return this.http.post(url, data, { headers })
      .map(response => response.json())
      .map(this.handleResponse)
      .catch(this.handleError);
  }

  // Add Authorization header with token
  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const token = this.token.getValue();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Handle API response format
  private handleResponse(response: any): any {
    if (response.success) {
      return response.data;  // Return just the data
    } else {
      throw new Error(response.error);  // Throw error
    }
  }
}
```

### 2. Business Service Uses API Service

**File: `src/app/services/order.service.ts`**
```typescript
export class OrderService {
  constructor(private api: ApiService) { }

  // Search orders
  search(query: string, page: number): Observable<any> {
    // api.post() returns an Observable
    return this.api.post(`/demo/order/search/${page}`, { query });
  }

  // Get single order
  view(orderId: number): Observable<Order> {
    return this.api.get(`/demo/order/view/${orderId}`);
  }

  // Create order
  create(order: any): Observable<any> {
    return this.api.post('/demo/actions/create', order);
  }
}
```

### 3. Component Subscribes to Observable

**File: `src/app/pages/orders/orders.component.ts`**
```typescript
export class OrdersComponent {
  orders: Order[] = [];

  loadOrders() {
    // Call service method - returns Observable
    this.orderService.search('', 1)
      .subscribe(
        // SUCCESS callback - runs when API returns success
        (result) => {
          console.log('Got orders:', result);
          this.orders = result.list;  // Update component property
        },
        // ERROR callback - runs if API returns error
        (error) => {
          console.error('Failed to load orders:', error);
        },
        // COMPLETE callback - runs when Observable completes
        () => {
          console.log('Request completed');
        }
      );
  }
}
```

### 4. Observables and Subscriptions

**What is an Observable?**
Think of it like a promise that can return multiple values over time. It's a stream of data.

```typescript
// Service returns Observable
getOrders(): Observable<Order[]> {
  return this.api.get('/orders');
}

// Component subscribes to get the data
this.orderService.getOrders()
  .subscribe(orders => {
    // This function runs when data arrives
    this.orders = orders;
  });
```

**Why use Observables instead of Promises?**
- Can cancel requests
- Can retry failed requests
- Can transform data with operators
- Can combine multiple streams
- Better for real-time data

---

## Complete Example Walkthrough

Let's trace exactly what happens when a user views an order, step by step.

### Step 1: User Clicks "View" Button

**File: `src/app/pages/orders/orders.component.html`**
```html
<div *ngFor="let order of orders" class="order-row">
  <h3>{{ order.accessionId }}</h3>
  <button (click)="viewOrder(order.id)">View</button>
  <!--                         ↑ Calls component method -->
</div>
```

### Step 2: Component Method Runs

**File: `src/app/pages/orders/orders.component.ts`**
```typescript
export class OrdersComponent {
  viewOrder(orderId: number) {
    // Navigate to /orders/view/123
    this.router.navigate(['/orders', 'view', orderId]);
  }
}
```

### Step 3: Router Navigates to New URL

**What happens:**
1. URL changes to `/orders/view/123`
2. Router looks at routing table
3. Finds child route: `{ path: 'view/:orderId', component: OrderComponent }`
4. Loads `OrderComponent` into nested `<router-outlet>`

### Step 4: OrderComponent Loads

**File: `src/app/modals/order/order.component.ts`**
```typescript
export class OrderComponent implements OnInit {
  order: Order;
  orderId: number;

  constructor(
    private route: ActivatedRoute,      // Access route params
    private orderService: OrderService, // Make API calls
    private router: Router              // Navigate
  ) { }

  ngOnInit() {
    // Get orderId from URL parameter
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];  // Gets '123' from /orders/view/123
      this.loadOrder();
    });
  }

  loadOrder() {
    // Call service to get order data
    this.orderService.view(this.orderId)
      .subscribe(order => {
        this.order = order;  // Store in component
      });
  }
}
```

### Step 5: Service Makes API Call

**File: `src/app/services/order.service.ts`**
```typescript
export class OrderService {
  view(orderId: number): Observable<Order> {
    // Call API service
    return this.api.get(`/demo/order/view/${orderId}`);
  }
}
```

### Step 6: API Service Sends HTTP Request

**File: `src/app/services/api.service.ts`**
```typescript
get(endpoint: string): Observable<any> {
  // Build URL: https://jdwebapi01.dominiondiagnostics.com/demo/order/view/123
  const url = this.baseUrl + endpoint;

  // Add Authorization: Bearer {token}
  const headers = this.getHeaders();

  // Make HTTP GET request
  return this.http.get(url, { headers })
    .map(response => response.json())
    .map(this.handleResponse);
}
```

### Step 7: Server Responds

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "accessionId": "DS2024001",
    "patient": {
      "id": 50,
      "name": "John Doe"
    },
    "status": "Completed",
    "created": "2024-01-15T10:30:00Z"
  }
}
```

### Step 8: Data Flows Back Through Services

```typescript
ApiService.handleResponse() // Extracts data from {success: true, data: {...}}
  ↓
OrderService.view()         // Returns Observable<Order>
  ↓
OrderComponent.loadOrder()  // Receives order in subscribe()
  ↓
this.order = order          // Stores in component property
```

### Step 9: Template Updates

**File: `src/app/modals/order/order.component.html`**
```html
<div class="modal">
  <h2>Order Details</h2>

  <!-- These values automatically update when this.order changes -->
  <p>Accession: {{ order.accessionId }}</p>
  <p>Patient: {{ order.patient.name }}</p>
  <p>Status: {{ order.status }}</p>
  <p>Created: {{ order.created | date }}</p>

  <button (click)="close()">Close</button>
</div>
```

### Step 10: User Sees Modal

Angular's change detection automatically updates the HTML when `this.order` is set.

**Visual Flow:**
```
User clicks button
  ↓
viewOrder(123) runs
  ↓
Router navigates to /orders/view/123
  ↓
OrderComponent loads
  ↓
ngOnInit() runs
  ↓
Gets orderId from URL
  ↓
Calls orderService.view(123)
  ↓
Service calls api.get('/demo/order/view/123')
  ↓
HTTP GET request sent with auth token
  ↓
Server responds with order data
  ↓
Data flows back: API → Service → Component
  ↓
Component stores in this.order
  ↓
Template updates automatically
  ↓
User sees order details in modal
```

---

## Key Concepts Summary

### 1. Routing
- Routes map URLs to components
- Defined in `app-routing.module.ts`
- Components render in `<router-outlet>`
- Use `router.navigate()` to change routes programmatically

### 2. Components
- Have TypeScript class (logic) + HTML template (view) + CSS (styles)
- Use `@Component` decorator to link them together
- Store data in properties
- Have methods that HTML can call
- Use lifecycle hooks (`ngOnInit`, `ngOnDestroy`, etc.)

### 3. Services
- Singleton classes that provide shared functionality
- Injected into components via constructor
- Handle API calls and business logic
- Use `@Injectable` decorator

### 4. Data Flow
```
Component Property → Template (one-way)
Template Event → Component Method (one-way)
[(ngModel)] → Both directions (two-way)
```

### 5. API Calls
- Use Observables (not Promises)
- Must subscribe() to get data
- Can transform with operators (map, filter, etc.)
- Should unsubscribe to prevent memory leaks

### 6. Dependency Injection
```typescript
constructor(
  private orderService: OrderService,  // Angular provides this
  private router: Router                // Angular provides this
) { }
```
Angular automatically creates and provides these services.

---

## Common Patterns in This App

### Pattern 1: Load Data on Init
```typescript
ngOnInit() {
  this.loadOrders();
}

loadOrders() {
  this.orderService.search('', 1)
    .subscribe(result => {
      this.orders = result.list;
    });
}
```

### Pattern 2: Debounced Search
```typescript
searchTextChanged = new Subject<string>();

ngOnInit() {
  this.searchTextChanged
    .pipe(
      debounceTime(200),           // Wait 200ms after typing stops
      distinctUntilChanged()       // Only search if value changed
    )
    .subscribe(text => {
      this.search(text);
    });
}

onSearchInput(text: string) {
  this.searchTextChanged.next(text);  // Emit value to Subject
}
```

### Pattern 3: Navigate to Modal
```typescript
viewOrder(id: number) {
  this.router.navigate(['/orders', 'view', id]);
}

close() {
  this.router.navigate(['/orders']);  // Navigate back
}
```

### Pattern 4: Form Submission
```typescript
// Component
order = { patient: null, doctor: null };

createOrder() {
  const data = {
    patient_id: this.order.patient.id,
    doctor_id: this.order.doctor.id
  };

  this.orderService.create(data)
    .subscribe(
      response => {
        console.log('Success!', response);
        this.router.navigate(['/orders']);
      },
      error => {
        console.error('Failed:', error);
      }
    );
}
```

```html
<!-- Template -->
<form (submit)="createOrder()">
  <ng-select [(ngModel)]="order.patient" name="patient"></ng-select>
  <ng-select [(ngModel)]="order.doctor" name="doctor"></ng-select>
  <button type="submit">Create</button>
</form>
```

---

## Debugging Tips

### 1. Check the Console
Open browser DevTools (F12) and check Console tab for:
- `console.log()` messages
- Errors
- Network requests

### 2. Check Network Tab
See actual HTTP requests:
- Request URL
- Request headers (including auth token)
- Request body
- Response data
- Status codes

### 3. Add Console Logs
```typescript
loadOrders() {
  console.log('Loading orders...');

  this.orderService.search('', 1)
    .subscribe(result => {
      console.log('Got result:', result);
      this.orders = result.list;
    });
}
```

### 4. Use Angular DevTools
Chrome extension "Angular DevTools" lets you:
- Inspect component properties
- See component tree
- Track change detection

---

## Next Steps

1. **Read the code:** Start with `app-routing.module.ts` to see all routes
2. **Follow a flow:** Pick a feature (like viewing an order) and trace the code from click to API call
3. **Experiment:** Change values, add console.logs, break things and fix them
4. **Check the docs:** See `ANGULAR_GUIDE.md` for more advanced patterns

Remember: Angular may seem complex, but it's just:
- Routes show components
- Components display data and handle events
- Services make API calls
- Everything is connected through dependency injection

Once you understand these core concepts, the rest is just variations on the same patterns!
