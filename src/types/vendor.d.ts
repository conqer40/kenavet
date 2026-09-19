declare module 'exceljs' {
  class Workbook {
    addWorksheet(name:string, options?:unknown):any;
    xlsx:{writeBuffer():Promise<ArrayBuffer>};
  }
  const ExcelJS:{Workbook:typeof Workbook};
  export default ExcelJS;
}
declare module 'lucide-react' {
  import type {ComponentType,SVGProps} from 'react';
  type Icon=ComponentType<SVGProps<SVGSVGElement>>;
  export const Activity:Icon,Archive:Icon,BarChart3:Icon,Bell:Icon,Building2:Icon,Calendar:Icon,CalendarDays:Icon,CheckCircle2:Icon,ChevronLeft:Icon,CircleDollarSign:Icon,ClipboardCheck:Icon,Compass:Icon,CreditCard:Icon,ExternalLink:Icon,FileText:Icon,Globe2:Icon,Home:Icon,Lock:Icon,LogOut:Icon,MapPin:Icon,Menu:Icon,Navigation:Icon,Phone:Icon,Plus:Icon,Search:Icon,Settings:Icon,ShieldCheck:Icon,Smartphone:Icon,Store:Icon,User:Icon,UserCheck:Icon,Users:Icon,X:Icon;
}
