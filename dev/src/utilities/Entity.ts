export interface Entity {
    save(...params: any);

    update();

    findById();
}