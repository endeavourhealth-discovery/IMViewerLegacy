import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent implements OnInit {
  @Input()  title: string;
  @Input()  subtitle: string;
  @Input()  selectedPage: string;
  @Input()  icon: string;
  @Input()  color: string;

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
