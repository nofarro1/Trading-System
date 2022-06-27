export interface Entity {
    save(...params: any);

    update(...params: any);

    findById(...params: any);

    delete(...params: any);
}