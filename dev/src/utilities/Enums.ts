import {NewProductData} from "./DataObjects";

export enum SearchType{productName, category, keyword}
export enum FilterType{price, productRate, category, shopRate}
export const ShopRate: { [x: string]: 'NotRated'} = {
    NotRated: 'NotRated',
}
export type ShopRate = typeof ShopRate[keyof typeof ShopRate]
export const ProductCategory: { [x: string]: 'A' | 'B' | 'C'} = {
    A: 'A',
    B: 'B',
    C: 'C',
}
export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory]
export const ProductRate: { [x: string]: 'NotRated'} = {
    NotRated: 'NotRated',
}
export type ProductRate = typeof ProductRate[keyof typeof ProductRate]
export const ShopStatus: { [x: string]: 'Open' | 'Closed'} = {
    Open: 'Open',
    Closed: 'Closed',
}
export type ShopStatus = typeof ShopStatus[keyof typeof ShopStatus]
export const DiscountType: { [x: string]: 'Product' | 'Category' | 'Bag'} = {
    Product: 'Product',
    Category: 'Category',
    Bag: 'Bag',
}
export type DiscountType = typeof DiscountType[keyof typeof DiscountType]
export enum PolicyType {LogicalPolicy, SimplePolicy }
export const SimplePolicyType: { [x: string]: 'Product' | 'Category' | 'ShoppingBag' | 'UserInfo'} = {
    Product: 'Product',
    Category: 'Category',
    ShoppingBag: 'ShoppingBag',
    UserInfo: 'UserInfo',
}
export type SimplePolicyType = typeof SimplePolicyType[keyof typeof SimplePolicyType]
export const JobType: { [x: string]: 'Admin' | 'Founder' | 'Owner' | 'Manager'} = {
    Admin: 'Admin',
    Founder: 'Founder',
    Owner: 'Owner',
    Manager: 'Manager',
}
export type JobType = typeof JobType[keyof typeof JobType]
export const RelationType: { [x: string]: 'LessThan' | 'LessThanOrEqual' | 'Equal' | 'GreaterThan' | 'GreaterThanOrEqual' | 'NotEqual'} = {
    LessThan: 'LessThan',
    LessThanOrEqual: 'LessThanOrEqual',
    Equal: 'Equal',
    GreaterThan: 'GreaterThan',
    GreaterThanOrEqual: 'GreaterThanOrEqual',
    NotEqual: 'NotEqual',
}
export type RelationType = typeof RelationType[keyof typeof RelationType]

export const DiscountKinds: { [x: string]: 'SimpleDiscount' | 'ConditionalDiscount' | 'ContainerDiscount'} = {
    SimpleDiscount : 'SimpleDiscount',
    ConditionalDiscount : 'ConditionalDiscount',
    ContainerDiscount: 'ContainerDiscount',
}
export type DiscountKinds = typeof DiscountKinds[keyof typeof DiscountKinds]

export const PolicyKinds: { [x: string]: 'SimplePolicy' | 'ConditionalPolicy' | 'ContainerPolicy'} = {
    SimplePolicy: 'SimplePolicy',
    ConditionalPolicy : 'ConditionalPolicy',
    ContainerPolicy: 'ContainerPolicy',
}
export type PolicyKinds = typeof PolicyKinds[keyof typeof PolicyKinds]

export const DiscountRelation: { [x: string]: 'And' | 'Or' | 'Xor' | 'Addition' | 'Max'} = {
    And: 'And',
    Or: 'Or',
    Xor: 'Xor',
    Addition: 'Addition',
    Max: 'Max',
}
export type DiscountRelation = typeof DiscountRelation[keyof typeof DiscountRelation]
export enum PurchasePoliciesKinds {SimplePurchase, ContainerPurchasePolicy}
export const PurchasePoliciesRelation: { [x: string]: 'And' | 'Conditional' | 'Or'} = {
    And: 'And',
    Conditional: 'Conditional',
    Or: 'Or',
}
export type PurchasePoliciesRelation = typeof PurchasePoliciesRelation[keyof typeof PurchasePoliciesRelation]


//
// export function toCategoryEnum(productData: NewProductData) {
//     const str = productData.productCategory;
//     const enumType: ProductCategory = str as unknown as ProductCategory;
//     const cateEnum = ProductCategory[productData[enumType]];
//     console.log(cateEnum);
//     return cateEnum;
//
// }