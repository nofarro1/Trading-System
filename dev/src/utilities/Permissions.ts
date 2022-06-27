

export const Permissions: { [x: string]: 'AddProduct' | 'RemoveProduct' | 'ModifyProduct' | 'RequestPersonnelInfo' | 'GetPurchaseHistory' |
'AddShopOwner' | 'AddShopManager' | 'AddPermission' | 'RemovePermission' | 'CloseShop' | 'ReopenShop' | 'AdminControl' | 'AddDiscount' |
'RemoveDiscount' | 'AddPurchasePolicy' | 'RemovePurchasePolicy' | 'ShopOwner'} = {
    AddProduct: 'AddProduct',
    RemoveProduct: 'RemoveProduct',
    ModifyProduct: 'ModifyProduct',
    RequestPersonnelInfo: 'RequestPersonnelInfo',
    GetPurchaseHistory: 'GetPurchaseHistory',
    AddShopOwner: 'AddShopOwner',
    AddShopManager: 'AddShopManager',
    AddPermission: 'AddPermission',
    RemovePermission: 'RemovePermission',
    CloseShop: 'CloseShop',
    ReopenShop: 'ReopenShop',
    AdminControl: 'AdminControl',
    AddDiscount: 'AddDiscount',
    RemoveDiscount: 'RemoveDiscount',
    AddPurchasePolicy: 'AddPurchasePolicy',
    RemovePurchasePolicy: 'RemovePurchasePolicy',
    ShopOwner: 'ShopOwner',
}
export type Permissions = typeof Permissions[keyof typeof Permissions]
