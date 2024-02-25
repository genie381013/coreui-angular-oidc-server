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
    private oauthService: OAuthService,
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
    this.authService.runInitialLoginSequence();

    // Automatically load user profile
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  private loadUserProfile() {
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => {
        console.debug('state', this.oauthService.state);
        this.oauthService.loadUserProfile().then(r => r);

        const scopes = this.oauthService.getGrantedScopes();
        console.debug('scopes', scopes);
      });
  }

}
