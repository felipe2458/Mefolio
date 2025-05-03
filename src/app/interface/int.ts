import { SafeHtml } from "@angular/platform-browser";

export interface AboutMeInfos {
  sub_info: string;
  info: string;
  icon: string;
  redirectTo: string;
}

export interface SafeAboutMeInfos extends Omit<AboutMeInfos, 'icon'>{
  icon: SafeHtml;
}
