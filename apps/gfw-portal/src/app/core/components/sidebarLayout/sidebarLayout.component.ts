/* eslint-disable no-empty */
import { Component, OnInit, signal } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { sideBarLinks } from '../../models/sidebarLinks';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { PermissionSystemService } from '../../services/permission.service';
@Component({
  selector: 'app-sidebar-layout',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './sidebarLayout.component.html',
  styleUrl: './sidebarLayout.component.scss',
})
export class SidebarLayoutComponent implements OnInit, AfterViewInit {

  constructor(private _LayoutService: LayoutService, private _PermissionSystemService: PermissionSystemService) {
    this._LayoutService.sidebarState.subscribe((res: boolean) => {
      this.side_state.set(res)
    })


    // this._LayoutService.addToSide.subscribe((res: any) => {
    //   const lastMenuItem = this.menueItems()[this.menueItems().length - 1];
    //   const targetChildren = lastMenuItem?.children && lastMenuItem.children[2]?.children;
    //   if (targetChildren) {
    //     targetChildren.push(res);
    //   }
    // })
  }


  side_state = signal<boolean>(false)

  ngOnInit(): void {
    // this.getMenue();
    const sideBarPermissions = [
      {
        "name": "Governance",
        "id": 66,
        "nameAR": "الحوكمة",
        "icon": "fi fi-rr-bank",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 4,
        "children": [
          {
            "name": "Governance Dashboard",
            "id": 67,
            "nameAR": "لوحة معلومات الحوكمة",
            "icon": "",
            "link": "/gfw-portal/governance/Dashboard",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Controls Register",
            "id": 68,
            "nameAR": "سجل الضوابط",
            "icon": "",
            "link": "/gfw-portal/governance/control-management",
            "visible": () => this._PermissionSystemService.can('GOVERNANCE', 'CONTROL', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Governance Documents",
            "id": 150,
            "nameAR": "مستندات الحوكمة",
            "icon": "",
            "link": "/gfw-portal/governance/documents",
            "visible": () => this._PermissionSystemService.can('GOVERNANCE', 'GOVDOCUMENT', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 124,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/governance/master-data",
            "visible": () => this._PermissionSystemService.can('GOVERNANCE', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Risks",
        "id": 69,
        "nameAR": "المخاطر",
        "icon": "fi fi-rr-shield-check",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 5,
        "children": [
          {
            "name": "Risk Dashboard",
            "id": 70,
            "nameAR": "تقارير المخاطر",
            "icon": "",
            "link": "/gfw-portal/risks-management/dashboard",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Risk Register",
            "id": 72,
            "nameAR": "سجل المخاطر",
            "icon": "",
            "link": "/gfw-portal/risks-management/risks-list",
            "visible": () => this._PermissionSystemService.can('RISKS', 'RISK', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Risk Methodology",
            "id": 149,
            "nameAR": "منهجية المخاطر",
            "icon": "",
            "link": "/gfw-portal/risks-management/methodolgy",
            "visible": () => this._PermissionSystemService.can('RISKS', 'METHODOLOGY', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Key Risk Indicators",
            "id": 115,
            "nameAR": "مؤشرات المخاطر الرئيسية",
            "icon": "",
            "link": "/gfw-portal/risks-management/KRI",
            "visible": () => this._PermissionSystemService.can('RISKS', 'RISKS_INDICATORS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 119,
            "nameAR": "البيانات الرئيسيه",
            "icon": "",
            "link": "/gfw-portal/risks-management/master-data",
            "visible": () => this._PermissionSystemService.can('RISKS', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Compliance",
        "id": 80,
        "nameAR": "الامتثال",
        "icon": "fi fi-rr-compliance-document",
        "link": "pgGovernance",
        "visible": () => true,
        "expand": false,
        "childCount": 8,
        "children": [
          {
            "name": "Compliance Documents",
            "id": 81,
            "nameAR": "وثائق الالتزام",
            "icon": "",
            "link": "/gfw-portal/compliance/complianceDocuments",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'COMPLIANCEDOCUMENT', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Compliance Dashboard",
            "id": 154,
            "nameAR": "لوحة معلومات الامتثال",
            "icon": "",
            "link": "/gfw-portal/compliance/dashboard",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Assessments",
            "id": 82,
            "nameAR": "عمليات التدقيق",
            "icon": "",
            "link": "/gfw-portal/compliance/assessments",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'ASSESSMENT', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Competent Authorities",
            "id": 157,
            "nameAR": "الجهات المختصة",
            "icon": "",
            "link": "/gfw-portal/compliance/competent_authorities",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'COMPETENTAUTHORITIES', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Ongoing Assessments",
            "id": 83,
            "nameAR": "التقييمات الجارية",
            "icon": "",
            "link": "/gfw-portal/compliance/pending-assessments",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'ONGOINGASSESSMENT', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Key Compliance Indicators",
            "id": 117,
            "nameAR": "مؤشرات  الامتثال الرئيسية",
            "icon": "null",
            "link": "/gfw-portal/compliance/KCI",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'KEYCOMPLIANCEINDICATORS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Evidence Compliance",
            "id": 121,
            "nameAR": "الالتزام بالادله",
            "icon": "",
            "link": "/gfw-portal/compliance/evidenceType",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'EVIDENCECOMPLIANCE', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 129,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/compliance/master-data",
            "visible": () => this._PermissionSystemService.can('COMPLIANCE', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Library",
        "id": 156,
        "nameAR": "المكتبة",
        "icon": "fi fi-rr-book",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 2,
        "children": [
          {
            "name": "Standard Documents",
            "id": 148,
            "nameAR": "الوثائق القياسية",
            "icon": null,
            "link": "/gfw-portal/library/standard-docs",
            "visible": () => this._PermissionSystemService.can('LIBRARY', 'STANDARDDOCUMENTS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "System Documents",
            "id": 158,
            "nameAR": "ملفات النظام",
            "icon": null,
            "link": "/gfw-portal/library/system-documents",
            "visible": () => this._PermissionSystemService.can('LIBRARY', 'SYSTEMDOCUMENTS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Evidence Library",
            "id": 121,
            "nameAR": "مكتبة الأدلة",
            "icon": "",
            "link": "/gfw-portal/library/evidence-library",
            "visible": () => this._PermissionSystemService.can('LIBRARY', 'EVIDENCELIBRARY', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
        ]
      },
      {
        "name": "Third Parties",
        "id": 101,
        "nameAR": "الجهات الخارجية ",
        "icon": "fi fi-rr-refer",
        "link": "/gfw-portal/third-party",
        "visible": () => true,
        "expand": false,
        "childCount": 5,
        "children": [
          {
            "name": "Third Parties Register",
            "id": 102,
            "nameAR": "سجل الجهات الخارجية ",
            "icon": "",
            "link": "/gfw-portal/third-party/list",
            "visible": () => this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTY', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Contracts",
            "id": 103,
            "nameAR": "العقود",
            "icon": "",
            "link": "/gfw-portal/third-party/contracts",
            "visible": () => this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYCONTRACT', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "SLA",
            "id": 108,
            "nameAR": "اتفاقية مستوى الخدمة",
            "icon": "",
            "link": "/gfw-portal/third-party/SLA",
            "visible": () => this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYCONTRACTSLA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Key Third-Party Indicators\n",
            "id": 118,
            "nameAR": "مؤشرات الجهات الخارجية الرئيسية",
            "icon": "null",
            "link": "/gfw-portal/third-party/KTI",
            "visible": () => this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYINDICATORS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 135,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/third-party/master-data",
            "visible": () => this._PermissionSystemService.can('THIRDPARTY', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Incidents",
        "id": 97,
        "nameAR": "الحوادث",
        "icon": "fi fi-rr-light-emergency-on",
        "link": "/gfw-portal/incident",
        "visible": () => true,
        "expand": false,
        "childCount": 1,
        "children": [
          {
            "name": "Incident Register",
            "id": 98,
            "nameAR": " سجل الحوادث",
            "icon": "",
            "link": "/gfw-portal/incident/list",
            "visible": () => this._PermissionSystemService.can('INCIDENT', 'INCIDENT', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Assets",
        "id": 84,
        "nameAR": "الاصول",
        "icon": "fi fi-rr-database",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 2,
        "children": [
          {
            "name": "Asset Register",
            "id": 85,
            "nameAR": "قائمه الاصول",
            "icon": "",
            "link": "/gfw-portal/assets/list",
            "visible": () => this._PermissionSystemService.can('ASSETS', 'ASSETS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            name: "Categories",
            "id": 119885,
            "nameAR": "فئات الاصول ",
            "icon": "",
            "link": "/gfw-portal/assets/categories",
            "visible": () => this._PermissionSystemService.can('ORGINAIZATION', 'ORGINAIZATION', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 122,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/assets/master-data",
            "visible": () => this._PermissionSystemService.can('ASSETS', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Indicators",
        "id": 86,
        "nameAR": "المؤشرات",
        "icon": "fi fi-rr-chart-line-up",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 3,
        "children": [
          {
            "name": "Key Performance Indicators",
            "id": 87,
            "nameAR": "مؤشرات الاداء الرئيسية",
            "icon": "null",
            "link": "/gfw-portal/indicators/KPI",
            "visible": () => this._PermissionSystemService.can('INDICATORS', 'INDICATORS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Indicator Dashboard",
            "id": 155,
            "nameAR": "لوحة معلومات المؤشرات",
            "icon": "",
            "link": "/gfw-portal/indicators/dashboard",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 130,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/indicators/master-data",
            "visible": () => this._PermissionSystemService.can('INDICATORS', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Awareness",
        "id": 144,
        "nameAR": "التوعية",
        "icon": "fi fi-tr-ribbon",
        "link": "/gfw-portal/awareness",
        "visible": () => true,
        "expand": false,
        "childCount": 1,
        "children": [
          {
            "name": "Campaigns",
            "id": 145,
            "nameAR": "الحملات",
            "icon": "",
            "link": "/gfw-portal/awareness/campaign-list",
            "visible": () => this._PermissionSystemService.can('AWARNESS', 'CAMPAIGNS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Threats",
        "id": 106,
        "nameAR": "التهديدات",
        "icon": "fi fi-rr-triangle-warning",
        "link": "/gfw-portal/Threats-management",
        "visible": () => true,
        "expand": false,
        "childCount": 2,
        "children": [
          {
            "name": "Threads Register",
            "id": 137,
            "nameAR": "سجل التهديدات",
            "icon": null,
            "link": "/gfw-portal/Threats-management/list",
            "visible": () => this._PermissionSystemService.can('THREATS', 'THREATS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 133,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/Threats-management/master-data",
            "visible": () => this._PermissionSystemService.can('THREATS', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Vulnerabilities",
        "id": 107,
        "nameAR": "الثغرات",
        "icon": "fi fi-rr-bug",
        "link": "/gfw-portal/vulnerability",
        "visible": () => true,
        "expand": false,
        "childCount": 2,
        "children": [
          {
            "name": "Vulnerability Register",
            "id": 138,
            "nameAR": "سجل الغرات",
            "icon": null,
            "link": "/gfw-portal/vulnerability/list",
            "visible": () => this._PermissionSystemService.can('VULNERABILITY', 'VULNERABILITY', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 134,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/vulnerability/master-data",
            "visible": () => this._PermissionSystemService.can('VULNERABILITY', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Questionnaires",
        "id": 141,
        "nameAR": "الاستبيانات",
        "icon": "fi fi-rr-comment-question",
        "link": "/gfw-portal/questionnaire",
        "visible": () => true,
        "expand": false,
        "childCount": 4,
        "children": [
          {
            "name": "Questions",
            "id": 142,
            "nameAR": "الاسئله",
            "icon": "",
            "link": "/gfw-portal/questionnaire/questions-list",
            "visible": () => this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Questionnaires Register",
            "id": 146,
            "nameAR": "سجل الاستبيانات",
            "icon": "",
            "link": "/gfw-portal/questionnaire/instance",
            "visible": () => this._PermissionSystemService.can('QUESTIONNAIRES' , 'INSTANCE' , 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Templates",
            "id": 143,
            "nameAR": "القوالب",
            "icon": "",
            "link": "/gfw-portal/questionnaire/templates",
            "visible": () => this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "My Questionnaires",
            "id": 159,
            "nameAR": "استبياناتي",
            "icon": "",
            "link": "/gfw-portal/questionnaire/my-questionnaires",
            "visible": () => this._PermissionSystemService.can('QUESTIONNAIRES' , 'MYQUESTIONNAIRES' , 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Strategy",
        "id": 99,
        "nameAR": "الاستراتيجية",
        "icon": "fi fi-rr-rocket-lunch",
        "link": "/gfw-portal/strategy",
        "visible": () => true,
        "expand": false,
        "childCount": 2,
        "children": [
          {
            "name": "Strategy Plan",
            "id": 100,
            "nameAR": "خطة الاستراتيجية",
            "icon": "",
            "link": "/gfw-portal/strategy/plans",
            "visible": () => this._PermissionSystemService.can('STRATEGY', 'PLAN', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 132,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/strategy/master-data",
            "visible": () => this._PermissionSystemService.can('STRATEGY', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Business Process",
        "id": 78,
        "nameAR": "العمليات",
        "icon": "fi fi-rr-memo-circle-check",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 3,
        "children": [
          {
            "name": "Process List",
            "id": 79,
            "nameAR": "وثائق الالتزام",
            "icon": "",
            "link": "/gfw-portal/BPM/process-list",
            "visible": () => this._PermissionSystemService.can('BUSINESSPROCESS', 'PROCESS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "BPM Dashboard",
            "id": 153,
            "nameAR": "لوحة معلومات عملية الأعمال",
            "icon": "",
            "link": "/gfw-portal/BPM/dashboard",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 128,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/BPM/master-data",
            "visible": () => this._PermissionSystemService.can('BPM', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "MG Meetings",
        "id": 112,
        "nameAR": "اجتماعات الادارة ",
        "icon": "fi fi-rr-meeting",
        "link": "/gfw-portal/meetings",
        "visible": () => true,
        "expand": false,
        "childCount": 2,
        "children": [
          {
            "name": "Meetings ",
            "id": 114,
            "nameAR": " قائمه الاجتماعات",
            "icon": "",
            "link": "/gfw-portal/meetings/list",
            "visible": () => this._PermissionSystemService.can('MEETING', 'MEETING', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 131,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/meetings/master-data",
            "visible": () => this._PermissionSystemService.can('MEETING', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Access Management",
        "id": 89,
        "nameAR": "إدارة الوصول",
        "icon": "fi fi-rr-id-badge",
        "link": "/gfw-portal/setting/Access-management",
        "visible": () => true,
        "expand": false,
        "childCount": 4,
        "children": [
          {
            "name": "Roles & Groups",
            "id": 90,
            "nameAR": "الادوار و المجموعات",
            "icon": "",
            "link": "/gfw-portal/setting/access-management/roles&permssions",
            "visible": () => this._PermissionSystemService.can('ACCESSMANAGEMNET', 'ROLES', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Permissions",
            "id": 91,
            "nameAR": "الصلاحيات",
            "icon": "",
            "link": "/gfw-portal/setting/access-management/permssions-list",
            "visible": () => this._PermissionSystemService.can('ACCESSMANAGEMNET', 'PERMISSIONS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Users",
            "id": 92,
            "nameAR": "المستخدمين",
            "icon": "",
            "link": "/gfw-portal/setting/access-management/users",
            "visible": () => this._PermissionSystemService.can('ACCESSMANAGEMNET', 'USERS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Master Data",
            "id": 123,
            "nameAR": "البيانات الرئيسيه",
            "icon": null,
            "link": "/gfw-portal/setting/access-management/master-data",
            "visible": () => this._PermissionSystemService.can('ACCESSMANAGEMNET', 'MASTERDATA', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Management",
        "id": 73,
        "nameAR": "الاداره",
        "icon": "fi fi-rr-memo-circle-check",
        "link": "",
        "visible": () => true,
        "expand": false,
        "childCount": 4,
        "children": [
          {
            "name": "Tasks",
            "id": 74,
            "nameAR": "المهام",
            "icon": "",
            "link": "/gfw-portal/management/tasks",
            "visible": () => this._PermissionSystemService.can('MANAGEMENT', 'TASKS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Tasks Dashboard",
            "id": 152,
            "nameAR": "لوحة المهام",
            "icon": "",
            "link": "/gfw-portal/management/dashboard",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Projects",
            "id": 76,
            "nameAR": "المشاريع",
            "icon": "",
            "link": "/gfw-portal/management/projects",
            "visible": () => this._PermissionSystemService.can('MANAGEMENT', 'PROJECTS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Initiatives",
            "id": 77,
            "nameAR": "المبادرات",
            "icon": "",
            "link": "/gfw-portal/management/initiatives",
            "visible": () => this._PermissionSystemService.can('MANAGEMENT', 'INITIATIVE', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      },
      {
        "name": "Setting",
        "id": 88,
        "nameAR": "الإعدادات",
        "icon": "fi fi-rr-settings",
        "link": "/gfw-portal/setting",
        "visible": () => true,
        "expand": false,
        "childCount": 5,
        "children": [
          {
            "name": "Notifications",
            "id": 93,
            "nameAR": "الإشعارات",
            "icon": "",
            "link": "/gfw-portal/setting/notification-settings",
            "visible": () => this._PermissionSystemService.can('NOTIFICATIONS', 'NOTIFICATIONS', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Organizational Units",
            "id": 75,
            "nameAR": "الوحدات التنظيمية",
            "icon": "",
            "link": "/gfw-portal/management/org-units",
            "visible": () => this._PermissionSystemService.can('ORGINAIZATION', 'ORGINAIZATION', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Dashboards",
            "id": 94,
            "nameAR": "التقارير",
            "icon": "",
            "link": "/gfw-portal/setting/dashboard-builder",
            "visible": () => this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "WorkFlow",
            "id": 96,
            "nameAR": "خطوات سير العمل",
            "icon": "",
            "link": "/gfw-portal/setting/workflow",
            "visible": () => this._PermissionSystemService.can('WORKFLOW', 'WORKFLOW', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          },
          {
            "name": "Esclation",
            "id": 104,
            "nameAR": "التصعيد",
            "icon": "",
            "link": "/gfw-portal/esclation/list",
            "visible": () => this._PermissionSystemService.can('ESCLATIONS', 'ESCLATION', 'VIEW'),
            "expand": false,
            "childCount": 0,
            "children": []
          }
        ]
      }
    ]
    console.log(sideBarPermissions,'sideBarPermissions');

    sideBarPermissions.forEach(permission => {
      if (permission.children && permission.children.length) {
        const hasAtLeastVisibleChild = permission.children.some((child: any) => child.visible());
        permission.visible = () => hasAtLeastVisibleChild;
      }
    });
    this.menueItems.set(sideBarPermissions)
  }


  searchTerm = signal<string>('')

  menueItems = signal<sideBarLinks[]>([])
  private _resizeHandler = () => this.updatePerfectScrollbar();
  getMenue() {
    this._LayoutService.showGlobalLoader.next(true)
    this._LayoutService.getMenueSideBar().subscribe((res: sideBarLinks[]) => {
      // this.menueItems.set(res)
      this._LayoutService.showGlobalLoader.next(false)
    })
  }
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private ps!: PerfectScrollbar;

  private updatePerfectScrollbar(): void {
    if (!this.ps || !this.scrollContainer) return;
    // two-phase schedule: next paint then short timeout
    requestAnimationFrame(() => {
      // give CSS transitions/reflows a tick
      setTimeout(() => {
        try { this.ps.update(); } catch (e) { /* ignore */ }
      }, 30);
    });
  }

  ngAfterViewInit() {
    this.ps = new PerfectScrollbar(this.scrollContainer.nativeElement, {
      suppressScrollX: true
    });

    this._LayoutService.sidebarState.subscribe((res: boolean) => {
      this.side_state.set(res);
      this.updatePerfectScrollbar();
    });

    window.addEventListener('resize', this._resizeHandler);

  }


  ngOnDestroy(): void {
    try { window.removeEventListener('resize', this._resizeHandler); } catch { }
    try { this.ps?.destroy(); } catch { }
  }


}
