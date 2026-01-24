
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
    manual_sale: number
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
    manual_sale: number
  }