import { Component, OnInit, Input} from '@angular/core';
import { AuthenticationService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input()  title: string;
  @Input()  subtitle: string;
  @Input()  selectedPage: string;

  constructor(
    private auth: AuthenticationService
  ) {
  }

  ngOnInit() {
  }

  home() {
    window.open('#/mainPage', 'IMViewer_MainPage');
  }

  logout() {
    this.auth.logout();
  }

}
