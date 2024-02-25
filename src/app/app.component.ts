import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {LoginOptions, OAuthService} from "angular-oauth2-oidc";
import {filter, map, mergeMap} from "rxjs/operators";
import {IconSetService} from "@coreui/icons-angular";
import {Title} from "@angular/platform-browser";
import {iconSubset} from "./icons/icon-subset";
import {NavigationEnd, Router} from "@angular/router";
import {authCodeFlowConfig} from "./common/auth/auth-code-flow.config";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'CoreUI Free Angular Admin Template';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService,
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
    // Run authentication process
    this.authService.runInitialLoginSequence();
    // Automatically load user profile
    this.authService.loadUserProfile();
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

}
