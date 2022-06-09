export const mockDependencies = {
    SecurityController: "../../../src/domain/SecurityController",
    MessageController: "../../../src/domain/notifications/MessageController",
    MarketplaceController: "../../../src/domain/marketplace/MarketplaceController",
    PurchaseController: "../../../src/domain/purchase/PurchaseController",
    UserController: "../../../src/domain/user/UserController",
    NotificationController: "../../../src/domain/notifications/NotificationController",
    SystemController: "../../../src/domain/SystemController",
    Shop: "../src/domain/marketplace/Shop",
    ShoppingBag: "../src/domain/user/ShoppingBag",
    ShoppingCart: "../src/domain/user/ShoppingCart",
    Product: "../../src/domain/marketplace/Product",
    SimpleDiscount: "../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/SimpleDiscount",
    PredicateDiscountPolicy: "../src/domain/marketplace/DiscountAndPurchasePolicies/Predicates/PredicateDiscountPolicy",
    ConditionalDiscount: "../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/ConditionalDiscount",
    AndDiscounts: "../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/AndDiscounts",
    OrDiscounts: "../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/OrDiscounts",
    MaxDiscounts: "../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/MaxDiscounts",
    AdditionDiscounts: "../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/AdditionDiscounts",
    SimplePurchase: "../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/SimplePurchase",
}
export const mockInstance = (dependency: string) => {
    jest.mock(dependency)
}

export const mockMethod = <T extends {}, E>(obj: T, method: any, todoInstead: ((...args: jest.ArgsType<E>) => ReturnType<any>) | undefined) => {
    return jest.spyOn(obj, method).mockImplementation(todoInstead)
}

export const clearMocks = (...mocks: jest.SpyInstance<any, unknown[]>[]) => {
    for (const mock of mocks) {
        mock.mockClear()
    }
}