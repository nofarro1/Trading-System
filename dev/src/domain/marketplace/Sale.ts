import PriorityQueue from "ts-priority-queue";
import { Product } from "./Product";

export interface Sale{
    name: String;
    description: String;
    
    applyDiscount(products: PriorityQueue<Product>):number;
}