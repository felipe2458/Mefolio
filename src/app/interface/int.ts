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

export interface Projects {
  image_url: { image: string }[];
  name_project: string;
  technologies: string;
  url_of_project: string;
  url_of_repository: string;
  opacity_slides: { opacity: number }[];
  slide: { image: string, opacity: number }[];
}

export interface Services{
  icon: string;
  service: string;
}

export interface SafeServices extends Omit<Services, 'icon'>{
  icon: SafeHtml;
}

export interface Skills{
  title: string;
  icon: string;
  class: string;
}

export interface SafeSkills extends Omit<Skills, 'icon'>{
  icon: SafeHtml;
}
