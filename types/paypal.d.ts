declare module '@paypal/checkout-server-sdk' {
  export namespace core {
    export class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    
    export class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    
    export class PayPalHttpClient {
      constructor(environment: any);
      execute(request: any): Promise<any>;
    }
  }
  
  export namespace orders {
    export class OrdersCreateRequest {
      prefer(value: string): void;
      requestBody(orderRequest: any): void;
    }
    
    export class OrdersCaptureRequest {
      constructor(orderId: string);
      requestBody(captureRequest: any): void;
    }
  }
  
  export class PaymentsController {
    constructor(client: any);
    ordersCreate(request: any): Promise<any>;
    ordersCapture(orderId: string, request: any): Promise<any>;
  }
}
