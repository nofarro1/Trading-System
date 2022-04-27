


interface IEventPublisher {
    subs: IEventListener[]
    notificationController: NotificationController
    addSub(sub:IEventListener): Result<boolean>
    removeSub(sub:IEventListener)

}