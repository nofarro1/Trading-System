
export const mockDependencies = {
    SecurityController: "../src/domain/SecurityController",
    MessageController: "../src/domain/notifications/MessageController",
    MarketplaceController: "../src/domain/marketplace/MarketplaceController",
    PurchaseController: "../src/domain/purchase/PurchaseController",
    UserController: "../src/domain/user/UserController",
    NotificationController: "../src/domain/notifications/NotificationController",
    SystemController: "../src/domain/SystemController",
    Shop: "../src/domain/marketplace/Shop",
    ShoppingBag: "../src/domain/marketplace/ShoppingBag",
    ShoppingCart: "../src/domain/marketplace/ShoppingCart",
    Product: "../src/domain/marketplace/Product",
    Service: "../src/service/Service",
}
export const mockInstance = (dependency: string) => {
    jest.mock(dependency)
}

export const mockMethod = <T extends {}, E>(obj: T, method: any, todoInstead: ((...args: jest.ArgsType<E>) => ReturnType<any>) | undefined) => {
    return jest.spyOn(obj, method).mockImplementation(todoInstead)
}

export const clearMocks = (...mocks: jest.SpyInstance<any, unknown[]>[]) => {
    for (const mock of mocks) {
        mock.mockReset()
    }
}