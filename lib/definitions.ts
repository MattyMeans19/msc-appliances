
export type Employee_Login = {
    username: string, 
    password: string
}

export type User = {
    id: number,
    username: string, 
    fname: string,
    lname: string,
    privilege: string,
    password: string
}

export type NewUser = {
    username: string, 
    fname: string,
    lname: string,
    privilege: string,
    password: string
}

export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

  export type SessionPayload = {
    username: string, 
    expiresAt: Date
  }

  export type Specials = {
    name: string,
    info: string,
    textcolor: string,
    bgimage: string,
    current: boolean,
    sales_price: number
  }

  export type Product = {
    id: number;
    name: string;
    info: string;
    sku: string;
    cost: number;
    price: number;
    deliverable: boolean;
    on_sale: boolean;
    count: number;
    in_store_warranty: number;
    parts_labor_warranty: number;
    photos: string[];
    manual_sale: number,
    type: string,
    subtype:string
  }

    export type NewProduct = {
    name: string;
    info: string;
    sku: string;
    cost: number;
    price: number;
    deliverable: boolean;
    on_sale: boolean;
    count: number;
    in_store_warranty: number;
    parts_labor_warranty: number;
    photos: string[];
    manual_sale: number,
    type: string,
    subtype:string
  }

  export type Coupon = {
    code: string,
    discount: number,
    type: string
  }

  export type Customer = {
      first_name: string,
      last_name: string,
      email: string,
      phone: string
  }

  export type Sale = {
    transactionId: string,
    items: [{
      sku: string,
      name: string,
      price: number
    }]
    status: string,
    totalAmount: number
    createdAt: Date,
    fulfillmentType: string
  }

  export type Receipt = {
    id:string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    items: any[],
    fulfillmentType: string,
    delivery_fee: number,
    tax_amount: number,
    totalAmount: number,
  }