import {Injectable} from "@angular/core";
import {BehaviorSubject, combineLatestWith, first, from, Observable, of, ReplaySubject, tap} from "rxjs";
import {filter, map} from "rxjs/operators";
import {LoginOptions, OAuthErrorEvent, OAuthService} from "angular-oauth2-oidc";
import {Router} from "@angular/router";
import {authCodeFlowConfig} from "./common/auth/auth-code-flow.config";
import {JwksValidationHandler} from "angular-oauth2-oidc-jwks";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root'})
export class AuthService {

  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  private isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$: Observable<boolean> = this.isDoneLoadingSubject$.asObservable();

  userProfile: object | undefined;
  constructor(private oauthService: OAuthService,
              private router: Router,
              private httpClient: HttpClient) {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent Object:', event);
      }
    });
  }

  public canActivateProtectedRoutes$: Observable<boolean> =
    this.isAuthenticated$.pipe(
      combineLatestWith(this.isDoneLoading$),
      map(([one, two]) => one && two));

  private navigateToLoginPage(): Observable<any> {
    return of(this.router.navigateByUrl('/login'));
  }

  public runInitialLoginSequence() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin(this.createLoginOptions())
      .then(() => {
        if (!this.oauthService.hasValidIdToken() || !this.hasValidToken()) {
          this.oauthService.initCodeFlow('some-state');
        } else {
          this.refresh();
        }
      });
  }

  private createLoginOptions(): LoginOptions {
    let currentLocation = window.location.search;
    let options = new LoginOptions();
    options.customHashFragment = currentLocation;
    return options;
  }


  public logout() {
    console.log(this.oauthService.getIdToken());
    this.oauthService.logOut();
    this.oauthService.revokeTokenAndLogout().then(r => r);
  }
  public refresh() {
    this.oauthService.refreshToken()
      .then((info) => console.debug('refresh ok', info))
      .catch((err) => console.error('refresh error', err));
  }
  public hasValidToken() { return this.oauthService.hasValidAccessToken(); }

  // These normally won't be exposed from a service like this, but
  // for debugging it makes sense.
  public get accessToken() { return this.oauthService.getAccessToken(); }
  public get refreshToken() { return this.oauthService.getRefreshToken(); }
  public get identityClaims() { return this.oauthService.getIdentityClaims(); }
  public get idToken() { return this.oauthService.getIdToken(); }
  public get logoutUrl() { return this.oauthService.logoutUrl; }


}
