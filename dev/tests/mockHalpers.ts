export const mockDependencies = {
    SecurityController: "../../../src/domain/SecurityController",
    MessageController: "../../../src/domain/notifications/MessageController",
    MarketplaceController: "../../../src/domain/marketplace/MarketplaceController",
    PurchaseController: "../../../src/domain/purchase/PurchaseController",
    UserController: "../../../src/domain/user/UserController",
    NotificationController: "../../../src/domain/notifications/NotificationController",
    SystemController: "../../../src/domain/SystemController"
}
export const mockInstance = (dependency: string) => {
    jest.mock(dependency)
}

export const mockMethod = <T extends {}>(obj: T, method: any, todoInstead: ((...args: jest.ArgsType<any>) => ReturnType<any>) | undefined) => {
    return jest.spyOn(obj, method).mockImplementation(todoInstead)
}

export const clearMocks = (...mocks: jest.SpyInstance<any, unknown[]>[]) => {
    for (const mock of mocks) {
        mock.mockClear()
    }
}