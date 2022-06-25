export enum SearchType{productName, category, keyword}
export enum FilterType{price, productRate, category, shopRate}
export enum ShopRate {NotRated}
export enum ProductCategory{A, B, C}
export enum ProductRate{NotRated}
export enum ShopStatus{open, close}
export enum DiscountType {Product, Category, Bag}
export enum PolicyType {LogicalPolicy, SimplePolicy }
export enum SimplePolicyType {Product, Category, ShoppingBag, UserInfo}
export enum LogicalPolicy {AndPolicy, OrPolicy, ConditionalPolicy}
export enum JobType {Founder, Owner, Manager, admin}
export enum RelationType {LessThen, LessThenOrEqual, Equal, GreaterThen, GreaterThenOrEqual, NotEqual }
export enum DiscountKinds {SimpleDiscount, ConditionalDiscount, ContainerDiscount}
export enum DiscountRelation {And, Or, Xor, Addition, Max}
export enum PurchasePoliciesKinds {SimplePurchase, ContainerPurchasePolicy}
export enum PurchasePoliciesRelation { And, Conditional, Or}


export function toCategoryEnum(productData) {
    const str = productData.category;
    const enumType: ProductCategory = str as unknown as ProductCategory;
    const cateEnum = ProductCategory[ProductCategory[enumType]];
    console.log(cateEnum);
    return cateEnum;

}