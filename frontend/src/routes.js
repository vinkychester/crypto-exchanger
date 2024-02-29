import React from "react";

const HomePage = React.lazy(() => import('./pages/home/home.component'));
const RegistrationPage = React.lazy(() => import('./pages/registration/registration.component'));
const AuthPage = React.lazy(() => import('./pages/auth/auth.component'));
const RatesPage = React.lazy(() => import('./pages/rates/rates.component'));
const ContactsPage = React.lazy(() => import('./pages/contacts/contacts.component'));
// panel
const EmailConfirmPage = React.lazy(() => import('./pages/email-confirm/email-confirm.component'));
const ForgotPasswordPage = React.lazy(() => import('./pages/forgot-password/forgot-password.component'));
const ChangePasswordPage = React.lazy(() => import('./pages/change-password/change-password.component'));
const ClientsPage = React.lazy(() => import('./pages/clients/clients.component'));
const ClientsDetailsPage = React.lazy(() => import('./pages/clients/clients-details.component'));
const PaymentSettingsPage = React.lazy(() => import('./pages/payment-settings/payment-settings.component'));
const ReviewPage = React.lazy(() => import("./pages/review/review.component"));
const ReviewPanelPage = React.lazy(() => import("./pages/review/review-panel.component"));
const ReviewPanelEdit = React.lazy(() => import("./components/review/review-panel/review-panel-edit.component"));
const RequisitionPage = React.lazy(() => import("./pages/requisition/requisition.component"));
const RequisitionDetailsPage = React.lazy(() => import("./pages/requisition/requisition-details.component"));
const FeedbackPage = React.lazy(() => import("./pages/feedback/feedback.component"));
const FeedbackDetailsPage = React.lazy(() => import('./pages/feedback/feedback-details.component'));
const CurrencyPage = React.lazy(() => import("./pages/currency/currency.component"));
const CardVerificationPage = React.lazy(() => import('./pages/card-verification/card-verification.component'));
const CardVerificationDetailsPage = React.lazy(() => import('./pages/card-verification/card-verification-details.component'));
const BankDetails = React.lazy(() => import('./pages/bank-details/bank-details.component'));
const Account = React.lazy(() => import('./pages/account/account.component'));

const routes = [
  {
    title: "RegistrationPage",
    path: "/registration",
    component: RegistrationPage,
  },
  {
    title: "AuthPage",
    path: "/login",
    component: AuthPage,
  },
  {
    title: "RatesPage",
    path: "/rates",
    component: RatesPage,
  },
  {
    title: "ContactsPage",
    path: "/contacts",
    component: ContactsPage
  },
  // panel
  {
    title: "CardVerificationDetailsPage",
    path: "/panel/card-verification/details/:id",
    component: CardVerificationDetailsPage,
  },
  {
    title: "CardVerificationPage",
    path: "/panel/card-verification",
    component: CardVerificationPage,
  },
  {
    title: "ClientsDetailsPage",
    path: "/panel/client-details/:id",
    component: ClientsDetailsPage,
  },
  {
    title: "ClientsPage",
    path: "/panel/clients",
    component: ClientsPage,
  },
  {
    title: "PaymentSettingsPage",
    path: "/panel/payment-settings",
    component: PaymentSettingsPage,
  },
  {
    title: "Reviews",
    path: "/reviews",
    component: ReviewPage
  },
  {
    title: "ReviewsAdmin",
    path: "/panel/reviews",
    component: ReviewPanelPage
  },
  {
    title: "ReviewsAdminEdit",
    path: "/panel/review/edit/:id",
    component: ReviewPanelEdit
  },
  {
    title: "RequisitionPage",
    path: "/panel/requisitions",
    component: RequisitionPage,
  },
  {
    title: "RequisitionDetailsPage",
    path: "/panel/requisition-details/:id",
    component: RequisitionDetailsPage,
  },
  {
    title: "CurrencyPage",
    path: "/panel/currencies",
    component: CurrencyPage,
  },
  {
    title: "BankDetailsPage",
    path: "/panel/bank-details",
    component: BankDetails,
  },

  {
    title: "FeedbackPage",
    path: "/panel/feedbacks",
    component: FeedbackPage
  },
  {
    title: "FeedbackDetailsPage",
    path: "/panel/feedback/details/:id",
    component: FeedbackDetailsPage
  },
  // main
  {
    title: "Home",
    path: "/:id(.refToken=[a-z-_0-9]*&cur_from=[A-Za-z0-9]*&cur_to=[A-Za-z0-9]*|[a-z-0-9@&]*-to-[a-z-0-9@&]*)?", //hrivna-uah-visa-to-hcrypto-bsv-bsv  ([a-z-%\(\w+\)]*-to-[a-z-%\(\w+\)]*)? //[a-z-0-9@&]*-to-[a-z-0-9@&]*
    exact: true,
    component: HomePage,
  },
  {
    title: "EmailConfirmPage",
    path: "/email-confirm",
    component: EmailConfirmPage,
  },
  {
    title: "Account",
    path: "/panel/account",
    component: Account,
  },
  {
    title: "ForgotPasswordPage",
    path: "/forgot-password",
    component: ForgotPasswordPage,
  },
  {
    title: "ChangePasswordPage",
    path: "/change-password/:token?",
    component: ChangePasswordPage,
  },
  // {
  //   title: "404",
  //   path: "/404",
  //   exact: true,
  //   component: NotFoundComponent,
  // },
  // {
  //   title: "404",
  //   path: "/404",
  //   exact: true,
  //   component: NotFoundComponent,
  // },
];

export default routes;