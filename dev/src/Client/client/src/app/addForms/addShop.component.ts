import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { api } from 'src/backendService/Service';
import { MessageService } from 'primeng/api';
import { SimpleShop } from '../../../../../utilities/simple_objects/marketplace/SimpleShop';

@Component({
  selector: 'app-add-shop',
  templateUrl: './addShop.component.html',
  styleUrls: ['./addShop.component.scss'],
  providers: [MessageService],
})
export class AddShopComponent implements OnInit {
  @Input() session: string;
  @Input() username: string;
  @Output() finishAddShop = new EventEmitter<any>();
  newShopName: string = '';

  constructor(private messageService: MessageService, private service: api) {}

  async ngOnInit() {}

  addNewShop() {
    console.log('addNewShop');
    this.service.setUpShop(this.session, this.username, this.newShopName).then((shop) => {
        this.showSuccessMsg(`The shop opened`);
        this.newShopName = '';
        this.finishAddShop.emit();
    });
  }

  showErrorMsg(msg: string) {
    this.messageService.add({
      severity: 'error',
      key: 'tc',
      summary: 'Error',
      detail: msg,
    });
  }

  showSuccessMsg(msg: string) {
    this.messageService.add({
      severity: 'success',
      key: 'tc',
      summary: 'success',
      detail: msg,
    });
  }
}
